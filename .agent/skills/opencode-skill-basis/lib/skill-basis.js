/**
 * OpenCode Skill Basis - Core Library
 * Provides foundational infrastructure for all skills
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = '.agent/skills';
const CONFIG_FILE = '.agent/config.json';

class SkillBasis {
  constructor() {
    this.loadedSkills = new Map();
    this.config = {};
    this.eventHandlers = new Map();
    this.projectInfo = null;
  }

  async initialize() {
    await this.loadConfig();
    await this.discoverSkills();
    return { success: true, data: { skills_count: this.loadedSkills.size } };
  }

  async loadConfig() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
        this.config = JSON.parse(content);
      } else {
        this.config = this.getDefaultConfig();
      }
      return { success: true, data: this.config };
    } catch (error) {
      return { success: false, error: { code: 'CONFIG_LOAD_ERROR', message: error.message } };
    }
  }

  getDefaultConfig() {
    return {
      github: {
        token_env: 'GH_TOKEN',
        default_repo: null,
        api_url: 'https://api.github.com'
      },
      defaults: {
        branch: 'main',
        branch_prefix: 'ai-task',
        commit_style: 'conventional'
      },
      workspace: {
        startup_script: 'npm install',
        auto_update_tasks: true
      },
      skills: {
        enabled: [],
        disabled: []
      }
    };
  }

  async discoverSkills() {
    try {
      if (!fs.existsSync(SKILLS_DIR)) {
        return { success: true, data: { skills: [] } };
      }

      const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = path.join(SKILLS_DIR, entry.name);
          const skillJsonPath = path.join(skillPath, 'skill.json');
          
          if (fs.existsSync(skillJsonPath)) {
            try {
              const content = fs.readFileSync(skillJsonPath, 'utf-8');
              const skillData = JSON.parse(content);
              this.loadedSkills.set(entry.name, skillData);
            } catch (e) {
              console.warn(`Failed to load skill ${entry.name}:`, e.message);
            }
          }
        }
      }
      return { success: true, data: { skills: Array.from(this.loadedSkills.keys()) } };
    } catch (error) {
      return { success: false, error: { code: 'DISCOVERY_ERROR', message: error.message } };
    }
  }

  async list_available_skills() {
    const skills = Array.from(this.loadedSkills.keys());
    return {
      success: true,
      data: {
        skills,
        count: skills.length
      }
    };
  }

  async load_skill(skillName) {
    if (this.loadedSkills.has(skillName)) {
      return {
        success: true,
        data: {
          skill: skillName,
          loaded: true,
          message: 'Skill already loaded'
        }
      };
    }

    const skillPath = path.join(SKILLS_DIR, skillName);
    const skillJsonPath = path.join(skillPath, 'skill.json');

    if (!fs.existsSync(skillJsonPath)) {
      return {
        success: false,
        error: {
          code: 'SKILL_NOT_FOUND',
          message: `Skill '${skillName}' not found in ${SKILLS_DIR}`
        }
      };
    }

    try {
      const content = fs.readFileSync(skillJsonPath, 'utf-8');
      const skillData = JSON.parse(content);
      this.loadedSkills.set(skillName, skillData);
      
      this.emit('skill.loaded', { skill_name: skillName, version: skillData.version });

      return {
        success: true,
        data: {
          skill: skillName,
          loaded: true,
          version: skillData.version
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SKILL_LOAD_ERROR',
          message: error.message
        }
      };
    }
  }

  async get_skill_info(skillName) {
    if (!this.loadedSkills.has(skillName)) {
      const result = await this.load_skill(skillName);
      if (!result.success) {
        return {
          success: false,
          error: { code: 'SKILL_NOT_FOUND', message: `Skill '${skillName}' not found` }
        };
      }
    }

    const skillData = this.loadedSkills.get(skillName);
    return {
      success: true,
      data: {
        name: skillData.name,
        version: skillData.version,
        description: skillData.description,
        author: skillData.author,
        created: skillData.created,
        tags: skillData.tags || [],
        tools: skillData.tools.map(t => t.name),
        tool_count: skillData.tools.length,
        dependencies: skillData.dependencies || []
      }
    };
  }

  async execute_tool(skillName, toolName, parameters = {}) {
    if (!this.loadedSkills.has(skillName)) {
      const loadResult = await this.load_skill(skillName);
      if (!loadResult.success) {
        return loadResult;
      }
    }

    const skillData = this.loadedSkills.get(skillName);
    const tool = skillData.tools.find(t => t.name === toolName);

    if (!tool) {
      return {
        success: false,
        error: {
          code: 'TOOL_NOT_FOUND',
          message: `Tool '${toolName}' not found in skill '${skillName}'`
        }
      };
    }

    this.emit('tool.executed', { skill_name: skillName, tool_name: toolName, parameters });

    return {
      success: true,
      data: {
        skill_name: skillName,
        tool_name: toolName,
        executed: true,
        message: `Tool '${toolName}' execution requested (implementation depends on skill)`
      }
    };
  }

  async get_config(key) {
    const value = this.getNestedValue(this.config, key);
    
    if (value === undefined) {
      return {
        success: false,
        error: { code: 'CONFIG_NOT_FOUND', message: `Config key '${key}' not found` }
      };
    }

    return {
      success: true,
      data: { key, value, type: typeof value }
    };
  }

  async set_config(key, value) {
    const oldValue = this.getNestedValue(this.config, key);
    this.setNestedValue(this.config, key, value);
    
    this.emit('config.changed', { key, old_value: oldValue, new_value: value });

    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
      return {
        success: true,
        data: { key, value, persisted: true }
      };
    } catch (error) {
      return {
        success: true,
        data: { key, value, persisted: false },
        warning: { code: 'PERSIST_ERROR', message: 'Config updated in memory but not persisted' }
      };
    }
  }

  async get_project_info() {
    const pkgPath = 'package.json';
    let version = '0.0.0';
    let name = 'ki-dev-agent';

    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        name = pkg.name || name;
        version = pkg.version || version;
      } catch (e) {}
    }

    const gitInfo = await this.getGitInfo();

    return {
      success: true,
      data: {
        name,
        version,
        root: process.cwd(),
        branch: gitInfo.branch,
        last_commit: gitInfo.lastCommit,
        skills_count: this.loadedSkills.size,
        config: {
          default_branch: this.config.defaults?.branch || 'main',
          branch_prefix: this.config.defaults?.branch_prefix || 'ai-task'
        }
      }
    };
  }

  async getGitInfo() {
    try {
      const { execSync } = require('child_process');
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
      const lastCommit = execSync('git log -1 --format="%H %s"', { encoding: 'utf-8' }).trim();
      return { branch, lastCommit };
    } catch (e) {
      return { branch: 'unknown', lastCommit: 'unknown' };
    }
  }

  getNestedValue(obj, key) {
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
  }

  setNestedValue(obj, key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
    target[lastKey] = value;
  }

  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || [];
    for (const handler of handlers) {
      try {
        handler(data);
      } catch (e) {
        console.error(`Event handler error for ${event}:`, e.message);
      }
    }
  }

  async register_handler(event, handler) {
    return {
      success: true,
      data: { event, handler, registered: true }
    };
  }
}

// Export for use as module
module.exports = SkillBasis;

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  const basis = new SkillBasis();

  async function run() {
    await basis.initialize();

    const command = args[0];

    switch (command) {
      case 'list':
      case 'skills': {
        const result = await basis.list_available_skills();
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'info': {
        const skillName = args[1];
        if (!skillName) {
          console.log('Usage: opencode-skill-basis.js info <skill-name>');
          process.exit(1);
        }
        const result = await basis.get_skill_info(skillName);
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'project': {
        const result = await basis.get_project_info();
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'config': {
        if (args[1] === 'get') {
          const key = args[2];
          const result = await basis.get_config(key);
          console.log(JSON.stringify(result, null, 2));
        } else if (args[1] === 'set') {
          const key = args[2];
          const value = args.slice(3).join(' ');
          const result = await basis.set_config(key, value);
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(`
🔧 OpenCode Skill Basis CLI

Usage:
  opencode-skill-basis.js list                  List all skills
  opencode-skill-basis.js info <skill-name>     Get skill info
  opencode-skill-basis.js project               Get project info
  opencode-skill-basis.js config get <key>      Get config value
  opencode-skill-basis.js config set <key> <val> Set config value

Examples:
  opencode-skill-basis.js list
  opencode-skill-basis.js info git-expert
  opencode-skill-basis.js project
  opencode-skill-basis.js config get defaults.branch
  opencode-skill-basis.js config set defaults.branch main
          `);
        }
        break;
      }
      default:
        console.log(`
🔧 OpenCode Skill Basis - Core Framework CLI

Usage:
  opencode-skill-basis.js list                  List all skills
  opencode-skill-basis.js info <skill-name>     Get skill info
  opencode-skill-basis.js project               Get project info
  opencode-skill-basis.js config get <key>      Get config value
  opencode-skill-basis.js config set <key> <val> Set config value
        `);
    }
  }

  run().catch(console.error);
}
