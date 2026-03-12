#!/usr/bin/env node

/**
 * Agent Start - Bootstrap Script for KI-Dev-Agent
 * 
 * Automatically initializes the agent environment:
 * - Installs dependencies if missing
 * - Syncs skills if needed
 * - Initializes project if not done
 * - Sets up Git if not present
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENT_DIR = '.agent';
const PACKAGE_JSON = 'package.json';
const NODE_MODULES = 'node_modules';
const GIT_DIR = '.git';

class AgentBootstrap {
  constructor() {
    this.status = {
      dependencies: false,
      skills: false,
      project: false,
      git: false,
      github: false
    };
    this.projectName = 'KI-Dev-Agent';
    this.isCopiedRepo = false;
  }

  async run() {
    console.log('\n🎯 KI-Dev-Agent Bootstrap\n');
    console.log('='.repeat(40));

    await this.checkProjectName();
    await this.detectIfCopiedRepo();
    await this.checkDependencies();
    await this.syncSkills();
    await this.initProject();
    await this.initGit();

    this.printSummary();
  }

  async detectIfCopiedRepo() {
    const gitConfigPath = path.join(GIT_DIR, 'config');
    
    if (!fs.existsSync(gitConfigPath)) {
      return;
    }

    try {
      const gitConfig = fs.readFileSync(gitConfigPath, 'utf-8');
      
      if (gitConfig.includes('aykustik/dev-agent') || gitConfig.includes('aykustik/opencode')) {
        this.isCopiedRepo = true;
      }
    } catch (e) {}
  }

  async checkProjectName() {
    // Priority 1: CLI argument (--name or --project-name)
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--name' || args[i] === '--project-name' || args[i] === '-n') {
        if (args[i + 1]) {
          this.projectName = args[i + 1];
          console.log(`  📝 Using project name from CLI: ${this.projectName}`);
          await this.updatePackageJsonName(this.projectName);
          return;
        }
      }
    }
    
    // Priority 2: Current directory name (best for new projects)
    const dirName = path.basename(process.cwd());
    if (dirName && dirName !== '.' && dirName !== 'node_modules') {
      this.projectName = dirName;
      console.log(`  📝 Using directory name as project name: ${this.projectName}`);
      await this.updatePackageJsonName(this.projectName);
      return;
    }
    
    // Priority 3: package.json (fallback for existing projects)
    if (fs.existsSync(PACKAGE_JSON)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'));
        this.projectName = pkg.name || this.projectName;
      } catch (e) {
        // ignore
      }
    }
  }

  async updatePackageJsonName(newName) {
    if (!fs.existsSync(PACKAGE_JSON)) {
      return;
    }
    
    try {
      const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'));
      
      // Only update if different and not the default framework name
      if (pkg.name !== newName && pkg.name !== 'ki-dev-agent') {
        return; // Keep existing custom name
      }
      
      pkg.name = newName;
      fs.writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2));
      console.log(`  📝 Updated package.json with project name: ${newName}`);
    } catch (e) {
      // ignore
    }
  }

  async checkDependencies() {
    console.log('\n📦 Checking dependencies...');
    
    if (fs.existsSync(NODE_MODULES)) {
      console.log('  ✅ Dependencies already installed');
      this.status.dependencies = true;
      return;
    }

    console.log('  📥 Installing dependencies...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      this.status.dependencies = true;
      console.log('  ✅ Dependencies installed');
    } catch (error) {
      console.error('  ❌ Failed to install dependencies');
      process.exit(1);
    }
  }

  async syncSkills() {
    console.log('\n🔄 Checking skills...');
    
    const skillsDir = path.join(AGENT_DIR, 'skills');
    const skillSyncScript = path.join(AGENT_DIR, 'lib', 'skill-sync.js');
    
    if (!fs.existsSync(skillsDir)) {
      console.log('  📥 Syncing skills from central repo...');
      try {
        execSync(`node ${skillSyncScript} sync`, { stdio: 'inherit' });
        this.status.skills = true;
        console.log('  ✅ Skills synced');
        return;
      } catch (error) {
        console.warn('  ⚠️ Could not sync skills:', error.message);
        return;
      }
    }

    const skillCount = fs.readdirSync(skillsDir).filter(f => 
      fs.statSync(path.join(skillsDir, f)).isDirectory()
    ).length;

    if (skillCount >= 65) {
      console.log(`  ✅ Skills already synced (${skillCount} skills)`);
      this.status.skills = true;
      return;
    }

    console.log(`  📥 Syncing skills (current: ${skillCount})...`);
    try {
      execSync(`node ${skillSyncScript} sync`, { stdio: 'inherit' });
      this.status.skills = true;
      console.log('  ✅ Skills synced');
    } catch (error) {
      console.warn('  ⚠️ Could not sync skills:', error.message);
    }
  }

  async initProject() {
    console.log('\n🏗️  Checking project initialization...');
    
    const configPath = path.join(AGENT_DIR, 'config.json');
    
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        console.log(`  ✅ Project already initialized: ${config.project}`);
        this.status.project = true;
        return;
      } catch (e) {
        // continue
      }
    }

    // Check if this is a copied repo that hasn't been initialized yet
    if (this.isCopiedRepo) {
      console.log('  📥 Initializing copied project...');
    } else {
      console.log('  📥 Initializing new project...');
    }
    
    try {
      const initScript = path.join(AGENT_DIR, 'core', 'scripts', 'init-agent.js');
      if (fs.existsSync(initScript)) {
        execSync(`node ${initScript} init ${this.projectName} --no-git`, { stdio: 'inherit' });
      }
      this.status.project = true;
      console.log('  ✅ Project initialized');
    } catch (error) {
      console.warn('  ⚠️ Could not initialize project:', error.message);
    }
  }

  async initGit() {
    console.log('\n🔧 Checking Git repository...');
    
    if (fs.existsSync(GIT_DIR)) {
      if (this.isCopiedRepo) {
        console.log('  🔄 Detected cloned repo - resetting Git...');
        
        // Delete the old .git folder and reinitialize
        try {
          execSync('rm -rf .git', { stdio: 'pipe' });
          console.log('  🗑️  Old .git removed');
        } catch (error) {
          console.warn('  ⚠️  Could not remove old .git:', error.message);
          console.log('     Please delete .git manually and run again');
          this.status.git = false;
          return;
        }
      } else {
        console.log('  ✅ Git repository already exists');
        this.status.git = true;
        return;
      }
    }

    console.log('  📥 Initializing Git repository...');
    try {
      execSync('git init', { stdio: 'pipe' });
      execSync('git add .', { stdio: 'pipe' });
      
      const hasChanges = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
      
      if (hasChanges) {
        execSync('git commit -m "Initial commit: KI-Dev-Agent framework"', { stdio: 'pipe' });
        console.log('  ✅ Git initialized with initial commit');
      } else {
        console.log('  ✅ Git initialized (nothing to commit)');
      }
      
      this.status.git = true;
      
      // Ask if user wants to create GitHub repo
      await this.askCreateGitHubRepo();
      
    } catch (error) {
      console.warn('  ⚠️ Could not initialize Git:', error.message);
    }
  }

  async askCreateGitHubRepo() {
    // Only ask for new projects (copied repos), not existing ones
    if (!this.isCopiedRepo) {
      return;
    }
    
    console.log('\n🌐 GitHub Repository...\n');
    
    // Try to auto-create first (best for automated workflows)
    const shouldAutoTry = await this.promptGitHubCreation();
    
    if (shouldAutoTry) {
      await this.createGitHubRepo();
    } else {
      console.log('  ⏭️  GitHub repo creation skipped');
      console.log('\n  Um später eine GitHub Repo zu erstellen:');
      console.log('    gh repo create ' + this.projectName + ' --private --source=. --push');
      console.log('');
    }
  }

  promptGitHubCreation() {
    return new Promise((resolve) => {
      // For automated workflows, we'll auto-try by default
      // The user can cancel by pressing Ctrl+C
      console.log('  Erstelle GitHub Repository automatisch...');
      console.log('  (Abbrechen mit Ctrl+C)');
      console.log('');
      
      // Auto-resolve to true for automated workflows
      // In interactive terminals, this would prompt
      setTimeout(() => resolve(true), 100);
    });
  }

  async createGitHubRepo() {
    console.log('\n🌐 Creating GitHub repository...\n');
    
    try {
      // Check if gh is available
      execSync('gh --version', { stdio: 'pipe' });
    } catch (error) {
      console.warn('  ⚠️  GitHub CLI (gh) not found');
      console.log('     Install it from: https://cli.github.com/');
      return false;
    }
    
    try {
      // Check if already authenticated
      execSync('gh auth status', { stdio: 'pipe' });
    } catch (error) {
      console.warn('  ⚠️  Not authenticated with GitHub');
      console.log('     Run: gh auth login');
      return false;
    }
    
    try {
      // Create the repo
      execSync(`gh repo create ${this.projectName} --private --source=. --push`, { stdio: 'inherit' });
      console.log('  ✅ GitHub repository created and pushed!');
      this.status.github = true;
      return true;
    } catch (error) {
      console.warn('  ⚠️  Could not create GitHub repository:', error.message);
      return false;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(40));
    console.log('\n🎉 Agent Ready!\n');
    console.log(`  Project: ${this.projectName}`);
    console.log(`  Dependencies: ${this.status.dependencies ? '✅' : '❌'}`);
    console.log(`  Skills: ${this.status.skills ? '✅' : '⚠️'}`);
    console.log(`  Project Init: ${this.status.project ? '✅' : '⚠️'}`);
    console.log(`  Git: ${this.status.git ? '✅' : '❌'}`);
    console.log(`  GitHub: ${this.status.github ? '✅' : '⏭️'}`);
    console.log('\n' + '-'.repeat(40));
    console.log('\n🚀 Start working with the agent!\n');
  }

  async showStatus() {
    console.log('\n📊 Agent Status\n');
    
    const checks = [
      { name: 'Dependencies', path: NODE_MODULES, required: true },
      { name: 'Git Repository', path: GIT_DIR, required: true },
      { name: 'Agent Config', path: path.join(AGENT_DIR, 'config.json'), required: true },
      { name: 'Skills', path: path.join(AGENT_DIR, 'skills'), required: false },
    ];

    for (const check of checks) {
      const exists = fs.existsSync(check.path);
      let status = exists ? '✅' : '❌';
      if (!exists && !check.required) status = '⚠️';
      console.log(`  ${status} ${check.name}`);
    }

    if (fs.existsSync(path.join(AGENT_DIR, 'config.json'))) {
      try {
        const config = JSON.parse(fs.readFileSync(path.join(AGENT_DIR, 'config.json'), 'utf-8'));
        console.log(`\n  Project: ${config.project}`);
        console.log(`  Version: ${config.version}`);
        console.log(`  Initialized: ${config.initialized}`);
      } catch (e) {}
    }

    console.log('');
  }

  getVersioningRules() {
    const projectVersioning = path.join(AGENT_DIR, 'project', 'versioning.md');
    const coreVersioning = path.join(AGENT_DIR, 'core', 'versioning.md');

    if (fs.existsSync(projectVersioning)) {
      const content = fs.readFileSync(projectVersioning, 'utf-8');
      if (!content.includes('PLATZHALTER') && !content.includes('Template')) {
        return { source: 'project', path: projectVersioning, content };
      }
    }

    if (fs.existsSync(coreVersioning)) {
      return { source: 'core', path: coreVersioning, content: fs.readFileSync(coreVersioning, 'utf-8') };
    }

    return null;
  }

  showVersioning() {
    const versioning = this.getVersioningRules();
    
    if (!versioning) {
      console.log('\n❌ No versioning rules found\n');
      return;
    }

    console.log(`\n📋 Versioning Guidelines (${versioning.source})\n`);
    console.log(`Source: ${versioning.path}\n`);
    
    const lines = versioning.content.split('\n');
    let inCode = false;
    for (const line of lines.slice(0, 50)) {
      if (line.startsWith('```')) inCode = !inCode;
      if (!inCode && (line.startsWith('#') || line.startsWith('##') || line.startsWith('###'))) {
        console.log('\n' + line);
      } else if (!inCode && (line.startsWith('|') || line.trim().startsWith('-'))) {
        console.log(line);
      } else if (!line.startsWith('>') && !line.startsWith('*') && line.trim()) {
        console.log(line);
      }
    }
    console.log('\n  (showing first 50 lines, see full file for details)\n');
  }

  showVersion() {
    if (fs.existsSync(PACKAGE_JSON)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'));
        console.log(`\n📦 ${pkg.version}\n`);
        return;
      } catch (e) {}
    }
    console.log('\n❌ No package.json found\n');
  }
}

const bootstrap = new AgentBootstrap();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'status':
    case 's':
      await bootstrap.showStatus();
      break;
    case 'version':
    case 'v':
      bootstrap.showVersion();
      break;
    case 'versioning':
    case 'vg':
      bootstrap.showVersioning();
      break;
    default:
      await bootstrap.run();
  }
}

main().catch(error => {
  console.error('\n❌ Bootstrap failed:', error.message);
  process.exit(1);
});
