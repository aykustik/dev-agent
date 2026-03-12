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
    this.projectInfo = {
      description: '',
      techStack: [],
      features: [],
      targetAudience: ''
    };
  }

  async init(projectName, options = {}) {
    // Priority 1: CLI argument provided
    // Priority 2: Current directory name
    // Priority 3: package.json
    
    let finalName = projectName;
    
    if (!finalName || finalName === 'my-project') {
      // Try directory name first
      const dirName = path.basename(process.cwd());
      if (dirName && dirName !== '.' && dirName !== 'node_modules') {
        finalName = dirName;
      }
    }
    
    if (!finalName || finalName === 'my-project') {
      // Fallback to package.json
      const pkgPath = 'package.json';
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
          if (pkg.name && pkg.name !== 'ki-dev-agent') {
            finalName = pkg.name;
          }
        } catch (e) {}
      }
    }

    this.projectName = finalName || 'new-project';
    this.options = {
      git: true,
      syncSkills: true,
      template: 'default',
      ...options
    };

    console.log(`\n🚀 Initializing agent for: ${this.projectName}\n`);

    await this.collectProjectInfo();
    await this.createDirectoryStructure();
    await this.copyCoreFiles();
    
    if (this.options.git) {
      await this.setupGit();
    }

    if (this.options.syncSkills) {
      await this.installSkills();
    }

    await this.createConfig();
    await this.generateProjectFiles();
    
    // Ask for project info if not provided
    await this.askForProjectInfo();

    console.log(`\n✅ Agent initialized for ${this.projectName}!\n`);
    console.log('Next steps:');
    console.log('  Review .agent/project/ files');
    console.log('  Customize as needed');
  }

  async askForProjectInfo() {
    const args = process.argv.slice(2);
    
    // Check if info was already provided via CLI
    let hasCliInfo = false;
    for (const arg of args) {
      if (arg.startsWith('--description') || arg.startsWith('--tech') || arg.startsWith('--features')) {
        hasCliInfo = true;
        break;
      }
    }
    
    if (hasCliInfo) {
      // CLI info was already processed in collectProjectInfo
      // Update README with new info
      await this.generateReadme();
      return;
    }
    
    console.log('\n📝 Projekt-Informationen:\n');
    console.log('Bitte beantworte folgende Fragen (oder überspringe mit Enter):\n');
    
    // For automated/interactive use, we'll show what info can be provided
    console.log('  --description "Beschreibung des Projekts"');
    console.log('  --tech "Node.js,React,TypeScript"');
    console.log('  --features "Feature 1,Feature 2,Feature 3"');
    console.log('  --audience "Zielgruppe"\n');
    
    console.log('  Beispiel:');
    console.log('    npm run agent:init -- --description "Mein Projekt" --tech "React,Node.js" --features "Todo-Liste,Auth,API"\n');
    
    console.log('Alternativ: Starte den Agent mit detaillierten Infos!\n');
  }

  async collectProjectInfo() {
    const args = process.argv.slice(2);
    
    // Try to parse from CLI arguments (e.g., --description "My project is...")
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--description' && args[i + 1]) {
        this.projectInfo.description = args[i + 1];
      }
      if (args[i] === '--tech' && args[i + 1]) {
        this.projectInfo.techStack = args[i + 1].split(',').map(t => t.trim());
      }
      if (args[i] === '--features' && args[i + 1]) {
        this.projectInfo.features = args[i + 1].split(',').map(f => f.trim());
      }
      if (args[i] === '--audience' && args[i + 1]) {
        this.projectInfo.targetAudience = args[i + 1];
      }
    }
    
    // If no info provided, set defaults
    if (!this.projectInfo.description) {
      this.projectInfo.description = `A project called ${this.projectName}`;
    }
    if (this.projectInfo.techStack.length === 0) {
      this.projectInfo.techStack = ['JavaScript'];
    }
  }

  async generateProjectFiles() {
    // Generate project-info.json
    const projectInfoPath = `${AGENT_DIR}/project-info.json`;
    fs.writeFileSync(projectInfoPath, JSON.stringify(this.projectInfo, null, 2));
    console.log(`📄 Created: ${projectInfoPath}`);
    
    // Generate README.md with project info
    await this.generateReadme();
  }

  async generateReadme() {
    const readmePath = 'README.md';
    
    const techStackStr = this.projectInfo.techStack.join(', ');
    const featuresStr = this.projectInfo.features.length > 0 
      ? this.projectInfo.features.map(f => `- ${f}`).join('\n')
      : '- Feature 1\n- Feature 2';
    
    const readmeContent = `# ${this.projectName}

## Description

${this.projectInfo.description}

## Tech Stack

- ${techStackStr}

## Features

${featuresStr}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development
npm run dev

# Build
npm run build
\`\`\`

## Project Structure

\`\`\`
${this.projectName}/
├── src/              # Source code
├── tests/            # Tests
├── .agent/           # Agent configuration
└── README.md
\`\`\`

---

*Generated with KI-Dev-Agent*
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log(`📄 Created: ${readmePath} (project-specific)`);
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
    // Check if this is a cloned repo
    const gitConfigPath = '.git/config';
    let isClonedRepo = false;
    
    if (fs.existsSync(gitConfigPath)) {
      try {
        const gitConfig = fs.readFileSync(gitConfigPath, 'utf-8');
        if (gitConfig.includes('aykustik/dev-agent') || gitConfig.includes('aykustik/opencode')) {
          isClonedRepo = true;
          
          // Delete old .git and reinitialize
          console.log('🔄 Detected cloned repo - resetting Git...');
          try {
            execSync('rm -rf .git', { stdio: 'pipe' });
            console.log('🗑️  Old .git removed');
          } catch (error) {
            console.warn('⚠️  Could not remove old .git:', error.message);
          }
        }
      } catch (e) {}
    }
    
    try {
      execSync('git status', { stdio: 'pipe' });
      console.log('📂 Git repository already exists');
    } catch {
      try {
        execSync('git init', { stdio: 'pipe' });
        execSync('git add .', { stdio: 'pipe' });
        execSync('git commit -m "Initial commit: AI Agent structure"', { stdio: 'pipe' });
        console.log('✅ Git initialized with initial commit');
        
        // If this was a cloned repo, ask about GitHub
        if (isClonedRepo) {
          await this.askCreateGitHubRepo();
        }
      } catch (error) {
        console.warn('⚠️ Git init failed:', error.message);
      }
    }
  }

  async askCreateGitHubRepo() {
    const args = process.argv.slice(2);
    
    // Check for CLI override
    const forceNew = args.includes('--force') || args.includes('-f');
    const skipGitHub = args.includes('--no-github') || args.includes('--skip-github');
    const linkOnly = args.includes('--link');
    
    if (skipGitHub) {
      console.log('\n🌐 GitHub Repository:');
      console.log('  ⏭️  Übersprungen (--no-github flag)');
      return;
    }
    
    console.log('\n🌐 GitHub Repository...\n');
    
    // Check if repo already exists
    let repoExists = false;
    try {
      execSync(`gh repo view aykustik/${this.projectName}`, { stdio: 'pipe' });
      repoExists = true;
    } catch (e) {
      // Repo doesn't exist
    }
    
    if (repoExists) {
      console.log(`  ⚠️  Repository existiert bereits: https://github.com/aykustik/${this.projectName}`);
      console.log('\n  Optionen:');
      console.log('    [1] Neue Repo erstellen (überschreiben)');
      console.log('    [2] Mit bestehender Repo verknüpfen');
      console.log('    [3] Überspringen');
      console.log('\n  CLI-Optionen:');
      console.log('    --force         → Neue Repo erstellen');
      console.log('    --link          → Mit bestehender verknüpfen');
      console.log('    --no-github     → Überspringen');
      console.log('');
      
      if (forceNew) {
        console.log('  → Erstelle neue Repo (--force)');
        await this.createGitHubRepo(true);
      } else if (linkOnly) {
        console.log('  → Verknüpfe mit bestehender Repo (--link)');
        await this.linkExistingGitHubRepo();
      } else {
        console.log('  ⏭️  Überspringe (standard)');
        console.log('  Um mit bestehender Repo zu arbeiten: gh repo clone aykustik/' + this.projectName + ' .');
        console.log('  Um neue zu erstellen: npm run agent:init -- --force');
      }
      console.log('');
      return;
    }
    
    // Repo doesn't exist - create new
    console.log('  Erstelle neue GitHub Repository...');
    console.log('  (Abbrechen mit Ctrl+C)');
    console.log('');
    
    // Auto-create for new repos
    await this.createGitHubRepo();
  }

  async linkExistingGitHubRepo() {
    console.log('\n🔗 Verknüpfe mit bestehender GitHub Repository...\n');
    
    try {
      // Add remote if not exists
      execSync('git remote add origin https://github.com/aykustik/' + this.projectName + '.git', { stdio: 'pipe' });
      console.log('  ✅ Remote "origin" hinzugefügt');
    } catch (e) {
      console.log('  ℹ️  Remote "origin" existiert bereits');
    }
    
    try {
      // Set upstream
      execSync('git push -u origin master', { stdio: 'inherit' });
      console.log('  ✅ Mit bestehender Repo verknüpft und gepusht!');
    } catch (error) {
      console.warn('  ⚠️  Push fehlgeschlagen:', error.message);
    }
  }

  async createGitHubRepo(force = false) {
    console.log('\n🌐 Creating GitHub repository...\n');
    
    try {
      execSync('gh --version', { stdio: 'pipe' });
    } catch (error) {
      console.warn('⚠️  GitHub CLI (gh) not found');
      console.log('     Install it from: https://cli.github.com/');
      return false;
    }
    
    try {
      execSync('gh auth status', { stdio: 'pipe' });
    } catch (error) {
      console.warn('⚠️  Not authenticated with GitHub');
      console.log('     Run: gh auth login');
      return false;
    }
    
    try {
      if (force) {
        console.log('  🗑️  Lösche existierende Repo...');
        try {
          execSync(`gh repo delete aykustik/${this.projectName} --yes`, { stdio: 'pipe' });
        } catch (e) {
          console.log('  ℹ️  Repo konnte nicht gelöscht werden, versuche neu zu erstellen...');
        }
      }
      
      execSync(`gh repo create ${this.projectName} --private --source=. --push`, { stdio: 'inherit' });
      console.log('✅ GitHub repository created and pushed!');
      return true;
    } catch (error) {
      console.warn('⚠️  Could not create GitHub repository:', error.message);
      return false;
    }
  }

  async installSkills() {
    // __dirname is .agent/core/scripts/
    // We need .agent/lib/skill-sync.js
    const skillSyncPath = path.join(__dirname, '..', '..', 'lib', 'skill-sync.js');
    
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
      const projectName = args[1] || null; // Will be read from package.json if null
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
  init-agent.js init [project-name]    Initialize new agent (reads name from package.json if not provided)
  init-agent.js validate               Validate structure

Options:
  --no-git                             Skip git initialization
  --no-skills                          Skip skill synchronization
  --force                              Force create new GitHub repo (overwrite existing)
  --link                               Link with existing GitHub repo
  --no-github                          Skip GitHub repo creation
  --description "text"                 Project description
  --tech "Node.js,React"              Tech stack (comma-separated)
  --features "f1,f2,f3"                Features (comma-separated)
  --audience "text"                    Target audience

Examples:
  init-agent.js init
  init-agent.js init my-project
  init-agent.js init my-app --force
  init-agent.js init --link
  init-agent.js init --description "My app" --tech "React,Node.js" --features "Auth,API,UI"
  init-agent.js validate
      `);
  }
}

main().catch(console.error);
