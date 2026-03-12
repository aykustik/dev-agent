#!/usr/bin/env node

/**
 * Skill Loader - Multi-format skill discovery and context loading
 * 
 * Supports three skill formats:
 * 1. skill.json + README.md (KI-Dev-Agent native)
 * 2. SKILL.md + _meta.json (opencode format)
 * 3. SKILL.md standalone (bare)
 * 
 * Usage:
 *   node skill-loader.js list              - List all skills
 *   node skill-loader.js find <query>      - Find skills by keywords
 *   node skill-loader.js show <name>       - Show skill metadata
 *   node skill-loader.js context <name>    - Load skill context (for agents)
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = '.agent/skills';

class SkillLoader {
  constructor() {
    this.skills = new Map();
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return;
    
    if (!fs.existsSync(SKILLS_DIR)) {
      console.warn('⚠️  Skills directory not found:', SKILLS_DIR);
      return;
    }

    const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillPath = path.join(SKILLS_DIR, entry.name);
        const skill = await this.loadSkill(entry.name, skillPath);
        if (skill) {
          this.skills.set(entry.name, skill);
        }
      }
    }

    this.loaded = true;
    console.log(`✅ Loaded ${this.skills.size} skills`);
  }

  async loadSkill(name, skillPath) {
    const skillJsonPath = path.join(skillPath, 'skill.json');
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    const metaJsonPath = path.join(skillPath, '_meta.json');
    const readmePath = path.join(skillPath, 'README.md');

    let skillData = null;
    let source = null;
    let content = null;
    let hasContent = false;

    // Try skill.json format first (native KI-Dev-Agent format)
    if (fs.existsSync(skillJsonPath)) {
      try {
        const jsonContent = fs.readFileSync(skillJsonPath, 'utf-8');
        if (jsonContent.trim().length > 0) {
          skillData = JSON.parse(jsonContent);
          source = 'skill.json';
          hasContent = true;
        }
      } catch (error) {
        console.warn(`⚠️  Invalid skill.json for: ${name}`);
      }
    }

    // Try SKILL.md format (opencode format)
    if (!skillData && fs.existsSync(skillMdPath)) {
      try {
        const mdContent = fs.readFileSync(skillMdPath, 'utf-8');
        if (mdContent.trim().length > 0) {
          // Parse first line as name, rest as description
          const lines = mdContent.split('\n').filter(l => l.trim());
          const title = lines[0]?.replace(/^#\s*/, '') || name;
          const description = lines.slice(1).join('\n').trim().substring(0, 200);
          
          skillData = {
            name: title,
            description: description || 'Skill documentation available',
            keywords: [],
            tags: []
          };
          source = 'SKILL.md';
          content = mdContent;
          hasContent = true;
        }
      } catch (error) {
        console.warn(`⚠️  Error reading SKILL.md for: ${name}`);
      }
    }

    // Try _meta.json as supplementary metadata
    if (fs.existsSync(metaJsonPath)) {
      try {
        const metaContent = fs.readFileSync(metaJsonPath, 'utf-8');
        if (metaContent.trim().length > 0) {
          const metaData = JSON.parse(metaContent);
          if (skillData) {
            skillData.keywords = metaData.keywords || skillData.keywords || [];
            skillData.tags = metaData.tags || skillData.tags || [];
          } else {
            skillData = {
              name: metaData.name || name,
              description: metaData.description || '',
              keywords: metaData.keywords || [],
              tags: metaData.tags || []
            };
            source = '_meta.json';
            hasContent = true;
          }
        }
      } catch (error) {
        // Silent fail for empty meta files
      }
    }

    // If no structured data but README.md exists, use that
    if (!skillData && fs.existsSync(readmePath)) {
      try {
        const readmeContent = fs.readFileSync(readmePath, 'utf-8');
        if (readmeContent.trim().length > 0) {
          const lines = readmeContent.split('\n').filter(l => l.trim());
          const title = lines[0]?.replace(/^#\s*/, '') || name;
          const description = lines.slice(1).join('\n').trim().substring(0, 200);
          
          skillData = {
            name: title,
            description: description || 'Documentation available',
            keywords: [],
            tags: []
          };
          source = 'README.md';
          content = readmeContent;
          hasContent = true;
        }
      } catch (error) {
        // Silent fail
      }
    }

    // Last resort: directory name only
    if (!skillData) {
      skillData = {
        name: name,
        description: '[kein Inhalt]',
        keywords: [],
        tags: []
      };
      source = 'directory';
      hasContent = false;
    }

    // Load all files for context
    const files = {};
    try {
      const dirEntries = fs.readdirSync(skillPath, { withFileTypes: true });
      for (const file of dirEntries) {
        if (file.isFile()) {
          const filePath = path.join(skillPath, file.name);
          try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            if (fileContent.trim().length > 0) {
              files[file.name] = fileContent;
            }
          } catch (e) {
            // Skip unreadable files
          }
        }
      }
    } catch (e) {
      // Silent fail
    }

    return {
      name: skillData.name || name,
      description: skillData.description || '',
      keywords: skillData.keywords || skillData.tags || [],
      tags: skillData.tags || skillData.keywords || [],
      tools: skillData.tools || [],
      files,
      path: skillPath,
      source,
      hasContent,
      rawContent: content || files['SKILL.md'] || files['README.md'] || null
    };
  }

  findSkills(query) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const [name, skill] of this.skills) {
      let score = 0;

      // Name match (highest priority)
      if (name.toLowerCase().includes(queryLower)) score += 10;
      if (skill.name.toLowerCase().includes(queryLower)) score += 10;

      // Description match
      if (skill.description.toLowerCase().includes(queryLower)) score += 5;

      // Keywords/tags match
      for (const keyword of skill.keywords) {
        if (keyword.toLowerCase().includes(queryLower)) score += 3;
        if (queryLower.includes(keyword.toLowerCase())) score += 2;
      }

      // Content match (if loaded)
      if (skill.rawContent && skill.rawContent.toLowerCase().includes(queryLower)) {
        score += 2;
      }

      if (score > 0) {
        results.push({ name, skill, score });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  getSkill(name) {
    return this.skills.get(name);
  }

  listSkills() {
    const list = [];
    for (const [name, skill] of this.skills) {
      list.push({
        name,
        displayName: skill.name,
        description: skill.description,
        keywords: skill.keywords,
        hasContent: skill.hasContent,
        source: skill.source
      });
    }
    // Sort by name alphabetically
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  getSkillFile(name, filename) {
    const skill = this.skills.get(name);
    if (!skill || !skill.files[filename]) {
      return null;
    }
    return skill.files[filename];
  }

  getSkillContext(name) {
    const skill = this.skills.get(name);
    if (!skill) {
      return null;
    }

    // Return best available content
    if (skill.files['SKILL.md']) {
      return skill.files['SKILL.md'];
    }
    if (skill.files['README.md']) {
      return skill.files['README.md'];
    }
    if (skill.files['skill.json']) {
      // For skill.json format, return structured info
      return `# ${skill.name}\n\n${skill.description}\n\n## Tools\n\n${skill.tools.map(t => `- ${t.name}: ${t.description}`).join('\n') || 'None'}`;
    }
    
    return `# ${skill.name}\n\n${skill.description}`;
  }
}

const loader = new SkillLoader();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  await loader.load();

  switch (command) {
    case 'list': {
      const skills = loader.listSkills();
      console.log('\n📋 Available Skills:\n');
      let loadedCount = 0;
      let emptyCount = 0;
      
      for (const skill of skills) {
        const contentIndicator = skill.hasContent ? '' : ' [kein Inhalt]';
        console.log(`  ${skill.name}${contentIndicator}`);
        console.log(`    ${skill.description.substring(0, 100)}${skill.description.length > 100 ? '...' : ''}`);
        if (skill.keywords.length > 0) {
          console.log(`    Keywords: ${skill.keywords.join(', ')}`);
        }
        console.log();
        
        if (skill.hasContent) loadedCount++;
        else emptyCount++;
      }
      
      console.log(`\n📊 Summary: ${loadedCount} with content, ${emptyCount} placeholders`);
      break;
    }

    case 'find': {
      const query = args[1];
      if (!query) {
        console.log('Usage: skill-loader.js find <query>');
        console.log('Examples:');
        console.log('  skill-loader.js find git');
        console.log('  skill-loader.js find "database"');
        process.exit(1);
      }
      
      const results = loader.findSkills(query);
      console.log(`\n🔍 Results for "${query}":\n`);
      
      if (results.length === 0) {
        console.log('  No matching skills found.');
        console.log('  Try broader search terms or "npm run skills:list" for all skills.');
      } else {
        for (const result of results.slice(0, 10)) {
          const contentIndicator = result.skill.hasContent ? '' : ' [kein Inhalt]';
          console.log(`  ${result.name} (score: ${result.score})${contentIndicator}`);
          console.log(`    ${result.skill.description.substring(0, 80)}${result.skill.description.length > 80 ? '...' : ''}\n`);
        }
        
        if (results.length > 10) {
          console.log(`  ... and ${results.length - 10} more results`);
        }
      }
      break;
    }

    case 'show': {
      const skillName = args[1];
      if (!skillName) {
        console.log('Usage: skill-loader.js show <skill-name>');
        console.log('Examples:');
        console.log('  skill-loader.js show git-expert');
        process.exit(1);
      }
      
      const skill = loader.getSkill(skillName);
      if (!skill) {
        console.log(`❌ Skill not found: ${skillName}`);
        console.log(`\nRun "npm run skills:list" to see all available skills.`);
        process.exit(1);
      }
      
      console.log(`\n📦 ${skill.name}\n`);
      console.log(`Description: ${skill.description}`);
      console.log(`Source: ${skill.source}`);
      console.log(`Has Content: ${skill.hasContent ? '✅' : '⚠️  placeholder'}`);
      
      if (skill.keywords.length > 0) {
        console.log(`Keywords: ${skill.keywords.join(', ')}`);
      }
      if (skill.tags.length > 0 && JSON.stringify(skill.tags) !== JSON.stringify(skill.keywords)) {
        console.log(`Tags: ${skill.tags.join(', ')}`);
      }
      if (skill.tools.length > 0) {
        console.log(`\nTools: ${skill.tools.length} available`);
        for (const tool of skill.tools.slice(0, 5)) {
          console.log(`  - ${tool.name}`);
        }
        if (skill.tools.length > 5) {
          console.log(`  ... and ${skill.tools.length - 5} more`);
        }
      }
      
      const fileList = Object.keys(skill.files);
      if (fileList.length > 0) {
        console.log(`\nFiles: ${fileList.join(', ')}`);
      }
      break;
    }

    case 'context': {
      const skillName = args[1];
      if (!skillName) {
        console.log('Usage: skill-loader.js context <skill-name>');
        console.log('Examples:');
        console.log('  skill-loader.js context git-expert');
        console.log('  skill-loader.js context skill-checker');
        console.log('\nThis command outputs the full skill content for agent context injection.');
        process.exit(1);
      }
      
      const context = loader.getSkillContext(skillName);
      if (!context) {
        console.log(`❌ Skill not found: ${skillName}`);
        process.exit(1);
      }
      
      // Output raw context for agent consumption
      console.log(context);
      break;
    }

    case 'help':
    default:
      console.log(`
🔧 Skill Loader CLI

Commands:
  npm run skills:list              List all skills with metadata
  npm run skills:find <query>      Find skills by keywords/tags
  npm run skills:show <name>       Show detailed skill info
  npm run skills:context <name>    Load skill context (for agents)

Examples:
  npm run skills:list
  npm run skills:find git
  npm run skills:find "api design"
  npm run skills:show git-expert
  npm run skills:context git-expert

Notes:
  - Skills can be in skill.json, SKILL.md, or README.md format
  - [kein Inhalt] means the skill has no content yet (sync needed)
  - Use 'skills:context' to inject skill documentation into your session
      `);
  }
}

main().catch(error => {
  console.error('\n❌ Skill loader failed:', error.message);
  process.exit(1);
});
