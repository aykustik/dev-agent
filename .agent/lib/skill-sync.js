#!/usr/bin/env node

/**
 * Skill Sync - GitHub Repo Skill Installer
 * Fetches skills from https://github.com/aykustik/opencode and installs missing ones
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'aykustik';
const REPO_NAME = 'opencode';
const SKILLS_REMOTE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/skills`;
const LOCAL_SKILLS_DIR = '.agent/skills';

class SkillSync {
  constructor() {
    this.localSkills = new Set();
    this.remoteSkills = new Set();
    this.missingSkills = [];
  }

  async run(options = {}) {
    const { force = false, dryRun = false } = options;
    
    console.log('🔄 Skill Sync starting...\n');
    
    // Load local skills
    this.loadLocalSkills();
    console.log(`📁 Local skills: ${Array.from(this.localSkills).join(', ')}`);
    
    // Fetch remote skills
    await this.fetchRemoteSkills();
    console.log(`🌐 Remote skills: ${this.remoteSkills.size} available`);
    
    // Find missing skills
    this.findMissingSkills();
    
    if (this.missingSkills.length === 0) {
      console.log('\n✅ All skills from repo are already installed!');
      return { success: true, installed: 0 };
    }
    
    console.log(`\n📦 Missing skills: ${this.missingSkills.join(', ')}`);
    
    if (dryRun) {
      console.log('\n🔍 Dry run - no changes made');
      return { success: true, missing: this.missingSkills, dryRun: true };
    }
    
    // Install missing skills
    const installed = await this.installMissingSkills(force);
    
    console.log(`\n✅ Successfully installed ${installed} skill(s)!`);
    
    return { success: true, installed };
  }

  loadLocalSkills() {
    if (!fs.existsSync(LOCAL_SKILLS_DIR)) {
      return;
    }
    
    const entries = fs.readdirSync(LOCAL_SKILLS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        this.localSkills.add(entry.name);
      }
    }
  }

  async fetchRemoteSkills() {
    try {
      const result = execSync(`gh api "${SKILLS_REMOTE_URL}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const items = JSON.parse(result);
      for (const item of items) {
        // Skip hidden directories and non-skill folders
        if (!item.name.startsWith('.') && item.type === 'dir') {
          this.remoteSkills.add(item.name);
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch remote skills:', error.message);
      console.log('Make sure GitHub CLI is authenticated: gh auth login');
      process.exit(1);
    }
  }

  findMissingSkills() {
    for (const skill of this.remoteSkills) {
      if (!this.localSkills.has(skill)) {
        this.missingSkills.push(skill);
      }
    }
  }

  async installMissingSkills(force = false) {
    let installed = 0;
    
    for (const skillName of this.missingSkills) {
      console.log(`\n📥 Installing: ${skillName}...`);
      
      const success = await this.installSkill(skillName, force);
      if (success) {
        installed++;
        console.log(`   ✅ Installed: ${skillName}`);
      } else {
        console.log(`   ❌ Failed: ${skillName}`);
      }
    }
    
    return installed;
  }

  async installSkill(skillName, force = false) {
    const localPath = path.join(LOCAL_SKILLS_DIR, skillName);
    
    if (fs.existsSync(localPath) && !force) {
      console.log(`   ⚠️  Skill already exists (use --force to overwrite)`);
      return false;
    }
    
    try {
      // Create directory
      if (!fs.existsSync(LOCAL_SKILLS_DIR)) {
        fs.mkdirSync(LOCAL_SKILLS_DIR, { recursive: true });
      }
      
      // Download skill from repo using gh
      const skillUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/skills/${skillName}`;
      
      // Try to get the skill.json to verify it exists
      const checkResult = execSync(`gh api "repos/${REPO_OWNER}/${REPO_NAME}/contents/skills/${skillName}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const items = JSON.parse(checkResult);
      
      // Create skill directory
      fs.mkdirSync(localPath, { recursive: true });
      
      // Download each file
      for (const item of items) {
        if (item.type === 'file') {
          const content = execSync(`gh api "repos/${REPO_OWNER}/${REPO_NAME}/contents/skills/${skillName}/${item.name}" --jq '.content' | base64 -d`, {
            encoding: 'utf-8'
          });
          
          fs.writeFileSync(path.join(localPath, item.name), content);
          console.log(`   📄 ${item.name}`);
        }
      }
      
      return true;
    } catch (error) {
      console.error(`   Error: ${error.message}`);
      // Cleanup on failure
      if (fs.existsSync(localPath)) {
        fs.rmSync(localPath, { recursive: true, force: true });
      }
      return false;
    }
  }

  async listAvailable() {
    this.loadLocalSkills();
    await this.fetchRemoteSkills();
    
    console.log('\n📊 Skill Status:\n');
    console.log('Installed:', Array.from(this.localSkills).join(', ') || 'None');
    console.log('\nAvailable in repo:', Array.from(this.remoteSkills).join(', '));
    
    const available = Array.from(this.remoteSkills).filter(s => !this.localSkills.has(s));
    console.log('\nNot installed:', available.join(', ') || 'All installed');
    
    return { local: Array.from(this.localSkills), remote: Array.from(this.remoteSkills), available };
  }
}

// CLI handling
const args = process.argv.slice(2);
const sync = new SkillSync();

async function main() {
  const command = args[0];
  
  switch (command) {
    case 'sync': {
      const force = args.includes('--force');
      const dryRun = args.includes('--dry-run');
      const result = await sync.run({ force, dryRun });
      console.log('\n' + JSON.stringify(result, null, 2));
      break;
    }
    case 'list': {
      await sync.listAvailable();
      break;
    }
    case 'install': {
      const skillName = args[1];
      if (!skillName) {
        console.log('Usage: skill-sync.js install <skill-name>');
        process.exit(1);
      }
      const result = await sync.installSkill(skillName, true);
      console.log(result ? '✅ Installed' : '❌ Failed');
      break;
    }
    default:
      console.log(`
🔧 Skill Sync CLI

Commands:
  skill-sync.js list                List all available skills
  skill-sync.js sync               Sync missing skills from repo
  skill-sync.js sync --dry-run     Show what would be installed
  skill-sync.js sync --force       Overwrite existing skills
  skill-sync.js install <name>     Install specific skill

Examples:
  skill-sync.js list
  skill-sync.js sync
  skill-sync.js sync --dry-run
      `);
  }
}

main().catch(console.error);
