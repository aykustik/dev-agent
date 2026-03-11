#!/usr/bin/env node

/**
 * Init Agent - Initializes Agent for new project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENT_DIR = '.agent';
const CORE_DIR = `${AGENT_DIR}/core`;
const PROJECT_DIR = `${AGENT_DIR}/project`;
const SKILLS_DIR = `${AGENT_DIR}/skills`;

class InitAgent {
  constructor() {
    this.projectName = '';
    this.options = {};
  }

  async init(projectName, options = {}) {
    this.projectName = projectName;
    this.options = {
      git: true,
      syncSkills: true,
      template: 'default',
      ...options
    };

    console.log(`\n🚀 Initializing agent for: ${projectName}\n`);

    await this.createDirectoryStructure();
    await this.copyCoreFiles();
    
    if (this.options.git) {
      await this.setupGit();
    }

    if (this.options.syncSkills) {
      await this.installSkills();
    }

    await this.createConfig();

    console.log(`\n✅ Agent initialized for ${projectName}!\n`);
    console.log('Next steps:');
    console.log(`  cd ${projectName}`);
    console.log('  Review .agent/project/ files');
    console.log('  Customize as needed');
  }

  async createDirectoryStructure() {
    const dirs = [
      AGENT_DIR,
      `${AGENT_DIR}/skills`,
      `${AGENT_DIR}/handoffs/projects`,
      `${AGENT_DIR}/handoffs/sessions`,
      `${AGENT_DIR}/lib`,
      `${AGENT_DIR}/core/config/prompts`,
      `${AGENT_DIR}/core/scripts`,
      `${AGENT_DIR}/core/templates`,
      `${AGENT_DIR}/core/examples`,
      PROJECT_DIR,
      `${PROJECT_DIR}/guides`,
      `${PROJECT_DIR}/patterns`,
      `${PROJECT_DIR}/templates`
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created: ${dir}`);
      }
    }
  }

  async copyCoreFiles() {
    const coreFiles = [
      { src: `${CORE_DIR}/README.md`, dest: `${PROJECT_DIR}/README.md` },
      { src: `${CORE_DIR}/scripts/README.md`, dest: `${PROJECT_DIR}/scripts.md` }
    ];

    for (const file of coreFiles) {
      if (fs.existsSync(file.src)) {
        let content = fs.readFileSync(file.src, 'utf-8');
        content = content.replace(/KI-Dev-Agent/g, this.projectName);
        content = content.replace(/PLATZHALTER/g, 'Project-specific');
        
        fs.writeFileSync(file.dest, content);
        console.log(`📄 Copied: ${file.src} -> ${file.dest}`);
      }
    }

    if (!fs.existsSync(`${PROJECT_DIR}/architecture.md`)) {
      const archContent = `# Architecture: ${this.projectName}

## Overview
Project-specific architecture rules for ${this.projectName}.

## /core/ vs /project/
- \`/core/\` - Universal standards (do not modify)
- \`/project/\` - Project-specific customizations (this folder)

## Getting Started
See \`guides/getting-started.md\`
`;
      fs.writeFileSync(`${PROJECT_DIR}/architecture.md`, archContent);
      console.log(`📄 Created: ${PROJECT_DIR}/architecture.md`);
    }

    if (!fs.existsSync(`${PROJECT_DIR}/guides/getting-started.md`)) {
      const guideContent = `# Getting Started: ${this.projectName}

## Prerequisites
- Node.js
- Git

## Setup
1. Review \`../core/\` for universal standards
2. Customize files in this \`/project/\` folder
3. Start developing!

## Project Structure
\`\`\`
.agent/
├── core/       # Universal standards
├── project/   # This folder - project-specific
├── skills/    # Skills for AI agents
└── handoffs/ # Session handoffs
\`\`\`
`;
      fs.writeFileSync(`${PROJECT_DIR}/guides/getting-started.md`, guideContent);
      console.log(`📄 Created: ${PROJECT_DIR}/guides/getting-started.md`);
    }
  }

  async setupGit() {
    try {
      execSync('git status', { stdio: 'pipe' });
      console.log('📂 Git repository already exists');
    } catch {
      try {
        execSync('git init', { stdio: 'pipe' });
        execSync('git add .', { stdio: 'pipe' });
        execSync('git commit -m "Initial commit: AI Agent structure"', { stdio: 'pipe' });
        console.log('✅ Git initialized with initial commit');
      } catch (error) {
        console.warn('⚠️ Git init failed:', error.message);
      }
    }
  }

  async installSkills() {
    const skillSyncPath = path.join(__dirname, '..', 'lib', 'skill-sync.js');
    
    if (fs.existsSync(skillSyncPath)) {
      console.log('🔄 Running skill-sync...');
      try {
        execSync(`node ${skillSyncPath} sync`, { stdio: 'inherit' });
      } catch {
        console.warn('⚠️ Skill sync failed or no remote skills');
      }
    } else {
      console.log('⚠️ skill-sync.js not found, skipping skill sync');
    }
  }

  async createConfig() {
    const configPath = `${AGENT_DIR}/config.json`;
    
    const config = {
      project: this.projectName,
      version: '1.0.0',
      initialized: new Date().toISOString(),
      structure: {
        core: `${CORE_DIR}`,
        project: `${PROJECT_DIR}`,
        skills: `${SKILLS_DIR}`,
        handoffs: `${AGENT_DIR}/handoffs`
      },
      scripts: {
        'skill-loader': `${CORE_DIR}/scripts/skill-loader.js`,
        'task-runner': `${CORE_DIR}/scripts/task-runner.js`,
        'handoff-gen': `${CORE_DIR}/scripts/handoff-gen.js`
      }
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`📄 Created: ${configPath}`);
  }

  validate() {
    const required = [
      AGENT_DIR,
      `${AGENT_DIR}/config.json`,
      `${AGENT_DIR}/tasks.md`,
      `${PROJECT_DIR}/architecture.md`
    ];

    console.log('\n🔍 Validating structure...\n');
    
    let valid = true;
    for (const item of required) {
      if (fs.existsSync(item)) {
        console.log(`  ✅ ${item}`);
      } else {
        console.log(`  ❌ Missing: ${item}`);
        valid = false;
      }
    }

    return valid;
  }
}

const init = new InitAgent();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init': {
      const projectName = args[1] || 'my-project';
      const options = {
        git: !args.includes('--no-git'),
        syncSkills: !args.includes('--no-skills')
      };
      await init.init(projectName, options);
      break;
    }
    case 'validate': {
      init.validate();
      break;
    }
    default:
      console.log(`
🔧 Init Agent CLI

Commands:
  init-agent.js init <project-name>    Initialize new agent
  init-agent.js validate               Validate structure

Options:
  --no-git                             Skip git initialization
  --no-skills                          Skip skill synchronization

Examples:
  init-agent.js init my-project
  init-agent.js init my-app --no-git
  init-agent.js validate
      `);
  }
}

main().catch(console.error);
