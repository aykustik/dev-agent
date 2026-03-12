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
      git: false
    };
    this.projectName = 'KI-Dev-Agent';
  }

  async run() {
    console.log('\n🎯 KI-Dev-Agent Bootstrap\n');
    console.log('='.repeat(40));

    await this.checkProjectName();
    await this.checkDependencies();
    await this.syncSkills();
    await this.initProject();
    await this.initGit();

    this.printSummary();
  }

  async checkProjectName() {
    if (fs.existsSync(PACKAGE_JSON)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'));
        this.projectName = pkg.name || this.projectName;
      } catch (e) {
        // ignore
      }
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

    console.log('  📥 Initializing project...');
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
      console.log('  ✅ Git repository already exists');
      this.status.git = true;
      return;
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
    } catch (error) {
      console.warn('  ⚠️ Could not initialize Git:', error.message);
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(40));
    console.log('\n🎉 Agent Ready!\n');
    console.log(`  Project: ${this.projectName}`);
    console.log(`  Dependencies: ${this.status.dependencies ? '✅' : '❌'}`);
    console.log(`  Skills: ${this.status.skills ? '✅' : '⚠️'}`);
    console.log(`  Project Init: ${this.status.project ? '✅' : '⚠️'}`);
    console.log(`  Git: ${this.status.git ? '✅' : '⚠️'}`);
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
    default:
      await bootstrap.run();
  }
}

main().catch(error => {
  console.error('\n❌ Bootstrap failed:', error.message);
  process.exit(1);
});
