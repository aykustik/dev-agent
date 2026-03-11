#!/usr/bin/env node

/**
 * Skill Checker - CLI Tool
 * Validates skills in the KI-Dev-Agent ecosystem
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = '.agent/skills';
const REQUIRED_FIELDS = ['name', 'version', 'description', 'author', 'created', 'tags', 'tools'];

class SkillValidator {
  constructor() {
    this.results = [];
  }

  async validateAll(verbose = false) {
    console.log('🔍 Validating all skills...\n');
    
    if (!fs.existsSync(SKILLS_DIR)) {
      console.error('❌ Skills directory not found:', SKILLS_DIR);
      return { success: false, error: 'SKILLS_DIR_NOT_FOUND' };
    }

    const skills = fs.readdirSync(SKILLS_DIR).filter(f => {
      return fs.statSync(path.join(SKILLS_DIR, f)).isDirectory();
    });

    if (skills.length === 0) {
      console.log('⚠️  No skills found in', SKILLS_DIR);
      return { success: true, data: { total: 0, valid: 0, invalid: 0, results: [] } };
    }

    let valid = 0;
    let invalid = 0;

    for (const skill of skills) {
      const result = await this.validateSkill(skill, verbose);
      if (result.valid) {
        valid++;
      } else {
        invalid++;
      }
      this.results.push(result);
    }

    console.log('\n📊 Summary:');
    console.log(`   Total: ${skills.length}`);
    console.log(`   ✅ Valid: ${valid}`);
    console.log(`   ❌ Invalid: ${invalid}`);

    return {
      success: invalid === 0,
      data: { total: skills.length, valid, invalid, results: this.results }
    };
  }

  async validateSkill(skillName, verbose = false) {
    const skillPath = path.join(SKILLS_DIR, skillName);
    const errors = [];
    const warnings = [];

    if (verbose) {
      console.log(`\n📁 Checking: ${skillName}`);
    }

    // Check if skill.json exists
    const skillJsonPath = path.join(skillPath, 'skill.json');
    if (!fs.existsSync(skillJsonPath)) {
      errors.push({ field: 'skill.json', message: 'Missing skill.json file' });
      return { skill: skillName, valid: false, errors, warnings };
    }

    // Parse and validate skill.json
    let skillJson;
    try {
      const content = fs.readFileSync(skillJsonPath, 'utf-8');
      skillJson = JSON.parse(content);
    } catch (e) {
      errors.push({ field: 'skill.json', message: 'Invalid JSON: ' + e.message });
      return { skill: skillName, valid: false, errors, warnings };
    }

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!skillJson[field]) {
        errors.push({ field, message: `Missing required field: ${field}` });
      }
    }

    // Validate version format (basic semver)
    if (skillJson.version && !/^\d+\.\d+\.\d+/.test(skillJson.version)) {
      warnings.push({ field: 'version', message: 'Version should follow semver format (x.y.z)' });
    }

    // Validate tools array
    if (!skillJson.tools || !Array.isArray(skillJson.tools) || skillJson.tools.length === 0) {
      errors.push({ field: 'tools', message: 'At least one tool must be defined' });
    } else {
      // Validate each tool
      skillJson.tools.forEach((tool, index) => {
        if (!tool.name) {
          errors.push({ field: `tools[${index}]`, message: 'Tool missing name' });
        }
        if (!tool.description) {
          warnings.push({ field: `tools[${index}]`, message: 'Tool missing description' });
        }
        if (!tool.parameters) {
          warnings.push({ field: `tools[${index}]`, message: 'Tool missing parameters definition' });
        }
      });
    }

    // Check for README.md
    const readmePath = path.join(skillPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      warnings.push({ field: 'README.md', message: 'Missing documentation file' });
    } else {
      // Basic content check
      const content = fs.readFileSync(readmePath, 'utf-8');
      if (content.length < 200) {
        warnings.push({ field: 'README.md', message: 'Documentation seems minimal (< 200 chars)' });
      }
    }

    const valid = errors.length === 0;

    if (verbose) {
      if (valid) {
        console.log(`   ✅ Valid`);
      } else {
        console.log(`   ❌ Invalid - ${errors.length} error(s)`);
      }
      errors.forEach(e => console.log(`      ❌ ${e.field}: ${e.message}`));
      warnings.forEach(w => console.log(`      ⚠️  ${w.field}: ${w.message}`));
    }

    return { skill: skillName, valid, errors, warnings };
  }

  generateMarkdownReport() {
    let report = '# Skill Validation Report\n\n';
    report += '## Summary\n\n';
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Total Skills | ${this.results.length} |\n`;
    report += `| Valid | ${this.results.filter(r => r.valid).length} |\n`;
    report += `| Invalid | ${this.results.filter(r => !r.valid).length} |\n\n`;
    
    report += '## Results\n\n';
    for (const result of this.results) {
      const status = result.valid ? '✅' : '❌';
      report += `### ${status} ${result.skill}\n\n`;
      
      if (result.errors.length > 0) {
        report += '#### Errors\n\n';
        for (const error of result.errors) {
          report += `- **${error.field}**: ${error.message}\n`;
        }
        report += '\n';
      }
      
      if (result.warnings.length > 0) {
        report += '#### Warnings\n\n';
        for (const warning of result.warnings) {
          report += `- **${warning.field}**: ${warning.message}\n`;
        }
        report += '\n';
      }
    }

    return report;
  }
}

// CLI handling
const args = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');

const validator = new SkillValidator();

if (args.includes('validate-all') || args.includes('all')) {
  validator.validateAll(verbose).then(result => {
    if (args.includes('--report')) {
      console.log('\n' + validator.generateMarkdownReport());
    }
    process.exit(result.success ? 0 : 1);
  });
} else if (args[0]) {
  validator.validateSkill(args[0], true).then(result => {
    console.log('\n' + JSON.stringify(result, null, 2));
    process.exit(result.valid ? 0 : 1);
  });
} else {
  console.log(`
🔍 Skill Checker CLI

Usage:
  node skill-checker.js <skill-name>          Validate a specific skill
  node skill-checker.js validate-all          Validate all skills
  node skill-checker.js validate-all --verbose  Verbose output
  node skill-checker.js validate-all --report   Generate markdown report

Examples:
  node skill-checker.js skill-finder
  node skill-checker.js all -v
  `);
}
