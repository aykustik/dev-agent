#!/usr/bin/env node

/**
 * Skill Loader - Loads and manages skills from .agent/skills/
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
      console.warn('⚠️ Skills directory not found:', SKILLS_DIR);
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
    
    if (!fs.existsSync(skillJsonPath)) {
      console.warn(`⚠️ No skill.json for: ${name}`);
      return null;
    }

    try {
      const skillData = JSON.parse(fs.readFileSync(skillJsonPath, 'utf-8'));
      
      const files = {};
      const dirEntries = fs.readdirSync(skillPath, { withFileTypes: true });
      
      for (const file of dirEntries) {
        if (file.isFile() && file.name !== 'skill.json') {
          const filePath = path.join(skillPath, file.name);
          files[file.name] = fs.readFileSync(filePath, 'utf-8');
        }
      }

      return {
        name: skillData.name || name,
        description: skillData.description || '',
        keywords: skillData.keywords || [],
        tools: skillData.tools || [],
        files,
        path: skillPath
      };
    } catch (error) {
      console.error(`❌ Failed to load skill ${name}:`, error.message);
      return null;
    }
  }

  findSkills(query) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const [name, skill] of this.skills) {
      let score = 0;

      if (name.toLowerCase().includes(queryLower)) score += 10;
      if (skill.description.toLowerCase().includes(queryLower)) score += 5;
      
      for (const keyword of skill.keywords) {
        if (keyword.toLowerCase().includes(queryLower)) score += 3;
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
        description: skill.description,
        keywords: skill.keywords,
        tools: skill.tools
      });
    }
    return list;
  }

  getSkillFile(name, filename) {
    const skill = this.skills.get(name);
    if (!skill || !skill.files[filename]) {
      return null;
    }
    return skill.files[filename];
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
      for (const skill of skills) {
        console.log(`  ${skill.name}`);
        console.log(`    ${skill.description}`);
        console.log(`    Keywords: ${skill.keywords.join(', ')}\n`);
      }
      break;
    }
    case 'find': {
      const query = args[1];
      if (!query) {
        console.log('Usage: skill-loader.js find <query>');
        process.exit(1);
      }
      const results = loader.findSkills(query);
      console.log(`\n🔍 Results for "${query}":\n`);
      for (const result of results) {
        console.log(`  ${result.name} (score: ${result.score})`);
        console.log(`    ${result.skill.description}\n`);
      }
      break;
    }
    case 'show': {
      const skillName = args[1];
      if (!skillName) {
        console.log('Usage: skill-loader.js show <skill-name>');
        process.exit(1);
      }
      const skill = loader.getSkill(skillName);
      if (!skill) {
        console.log(`❌ Skill not found: ${skillName}`);
        process.exit(1);
      }
      console.log(`\n📦 ${skill.name}\n`);
      console.log(`Description: ${skill.description}`);
      console.log(`Keywords: ${skill.keywords.join(', ')}`);
      console.log(`Tools: ${skill.tools.join(', ')}`);
      console.log(`Files: ${Object.keys(skill.files).join(', ')}`);
      break;
    }
    default:
      console.log(`
🔧 Skill Loader CLI

Commands:
  skill-loader.js list               List all skills
  skill-loader.js find <query>       Find skills by query
  skill-loader.js show <name>        Show skill details

Examples:
  skill-loader.js list
  skill-loader.js find git
  skill-loader.js show git-expert
      `);
  }
}

main().catch(console.error);
