#!/usr/bin/env node

/**
 * Skill Checker - CLI Tool
 * Validates skills in the KI-Dev-Agent ecosystem
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = '.agent/skills';
const REQUIRED_FIELDS = ['name', 'version', 'description', 'author', 'created', 'tags', 'tools'];

// Known edge cases - skills that are placeholders or have special handling
const KNOWN_EDGE_CASES = ['accesslint'];

class SkillValidator {
  constructor() {
    this.results = [];
  }

  async validateAll(verbose = false, onlyWithJson = true, checkAll = false) {
    console.log('🔍 Validating all skills...\n');
    
    if (!fs.existsSync(SKILLS_DIR)) {
      console.error('❌ Skills directory not found:', SKILLS_DIR);
      return { success: false, error: 'SKILLS_DIR_NOT_FOUND' };
    }

    let skills = fs.readdirSync(SKILLS_DIR).filter(f => {
      return fs.statSync(path.join(SKILLS_DIR, f)).isDirectory();
    });

    // Filter to only valid skill formats unless --all flag is used
    // Valid formats: skill.json, SKILL.md, or _meta.json + SKILL.md
    // Use --all to validate ALL directories (including those without recognized format)
    if (!checkAll) {
      const validSkills = [];
      for (const skill of skills) {
        // Skip known edge cases (placeholders, special formats)
        if (KNOWN_EDGE_CASES.includes(skill)) {
          continue;
        }
        const skillPath = path.join(SKILLS_DIR, skill);
        const skillJsonPath = path.join(skillPath, 'skill.json');
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        const metaJsonPath = path.join(skillPath, '_meta.json');
        
        // Accept skill if it has skill.json, SKILL.md, or _meta.json
        if (fs.existsSync(skillJsonPath) || fs.existsSync(skillMdPath) || fs.existsSync(metaJsonPath)) {
          validSkills.push(skill);
        }
      }
      skills = validSkills;
      if (verbose) {
        console.log(`📝 Validating skills with recognized format: ${skills.length} skills\n`);
      }
    } else {
      if (verbose) {
        console.log(`📝 Validating ALL skills (including without recognized format): ${skills.length} skills\n`);
      }
    }

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

    const edgeCases = this.results.filter(r => r.warnings.some(w => w.field === 'edge-case')).length;
    
    console.log('\n📊 Summary:');
    console.log(`   Total: ${skills.length}`);
    console.log(`   ✅ Valid: ${valid}`);
    console.log(`   ❌ Invalid: ${invalid}`);
    if (edgeCases > 0) {
      console.log(`   ⚠️  Edge Cases: ${edgeCases}`);
    }

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

    // Handle known edge cases (placeholders, special formats)
    if (KNOWN_EDGE_CASES.includes(skillName)) {
      if (verbose) {
        console.log(`   ⚠️  Known edge case - skipping strict validation`);
      }
      return { skill: skillName, valid: true, errors: [], warnings: [{ field: 'edge-case', message: 'Known placeholder/special format' }] };
    }

    // Check for supported skill formats
    const skillJsonPath = path.join(skillPath, 'skill.json');
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    const metaJsonPath = path.join(skillPath, '_meta.json');
    
    // Determine skill format
    const hasSkillJson = fs.existsSync(skillJsonPath);
    const hasSkillMd = fs.existsSync(skillMdPath);
    const hasMetaJson = fs.existsSync(metaJsonPath);
    
    if (!hasSkillJson && !hasSkillMd && !hasMetaJson) {
      errors.push({ field: 'format', message: 'No recognized skill format found (skill.json, SKILL.md, or _meta.json)' });
      return { skill: skillName, valid: false, errors, warnings };
    }
    
    // For SKILL.md based skills, do basic validation
    if (hasSkillMd && !hasSkillJson) {
      // Validate SKILL.md exists and has content
      const skillMdContent = fs.readFileSync(skillMdPath, 'utf-8');
      if (skillMdContent.length < 100) {
        warnings.push({ field: 'SKILL.md', message: 'SKILL.md content seems minimal (< 100 chars)' });
      }
      
      // If has _meta.json, validate it
      if (hasMetaJson) {
        try {
          const metaContent = fs.readFileSync(metaJsonPath, 'utf-8');
          const meta = JSON.parse(metaContent);
          if (!meta.name) {
            warnings.push({ field: '_meta.json', message: 'Missing name field in metadata' });
          }
        } catch (e) {
          errors.push({ field: '_meta.json', message: 'Invalid JSON: ' + e.message });
        }
      }
      
      if (verbose) {
        console.log(`   ✅ Valid (SKILL.md format)`);
      }
      
      return { skill: skillName, valid: errors.length === 0, errors, warnings };
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
const checkAll = args.includes('--all') || args.includes('-a');

const validator = new SkillValidator();

if (args.includes('validate-all') || args.includes('all')) {
  validator.validateAll(verbose, true, checkAll).then(result => {
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
  node validate.js <skill-name>           Validate a specific skill
  node validate.js validate-all           Validate skills with skill.json (default)
  node validate.js validate-all --verbose  Verbose output
  node validate.js validate-all --all     Validate ALL skills (including without skill.json)
  node validate.js validate-all --report  Generate markdown report

Note:
  By default, only skills with skill.json are validated.
  This is because most skills come from remote sync and may not have metadata.
  Use --all to validate everything.

Examples:
  node validate.js skill-finder
  node validate.js all -v
  node validate.js all --all
  `);
}
