# Skill Checker

## Overview
The Skill Checker is a validation and quality assurance system for skills in the KI-Dev-Agent ecosystem. It ensures that all skills meet minimum quality standards before being deployed or used in production.

## Skill Metadata
```json
{
  "name": "skill-checker",
  "version": "1.0.0",
  "description": "Validation and quality assurance system for skills in the KI-Dev-Agent ecosystem",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-11",
  "tags": ["validation", "quality", "qa", "linting"],
  "dependencies": [],
  "tools": [
    {
      "name": "validate_skill",
      "description": "Validate a skill's structure and metadata",
      "parameters": {
        "skill_path": {
          "type": "string",
          "description": "Path to the skill directory",
          "required": true
        }
      }
    },
    {
      "name": "validate_all_skills",
      "description": "Validate all skills in the skills directory",
      "parameters": {
        "verbose": {
          "type": "boolean",
          "description": "Include detailed validation output",
          "required": false,
          "default": false
        }
      }
    },
    {
      "name": "check_skill_json",
      "description": "Validate skill.json structure and required fields",
      "parameters": {
        "skill_path": {
          "type": "string",
          "description": "Path to the skill directory",
          "required": true
        }
      }
    },
    {
      "name": "check_documentation",
      "description": "Check if a skill has adequate documentation",
      "parameters": {
        "skill_path": {
          "type": "string",
          "description": "Path to the skill directory",
          "required": true
        }
      }
    },
    {
      "name": "generate_validation_report",
      "description": "Generate a comprehensive validation report for one or all skills",
      "parameters": {
        "skill_path": {
          "type": "string",
          "description": "Path to specific skill or 'all' for all skills",
          "required": true
        },
        "output_format": {
          "type": "string",
          "description": "Output format: markdown, json, or html",
          "required": false,
          "default": "markdown"
        }
      }
    }
  ]
}
```

## Validation Criteria

### Required Elements
Every skill must have:

1. **skill.json** - Valid JSON with required fields:
   - `name` (string, required)
   - `version` (string, required, semver format)
   - `description` (string, required)
   - `author` (string, required)
   - `created` (string, required, YYYY-MM-DD format)
   - `tags` (array, required, at least 1 tag)
   - `tools` (array, required, at least 1 tool)

2. **README.md** - Documentation with:
   - Skill overview/purpose
   - Tool descriptions with parameters
   - Usage examples
   - Installation/setup instructions (if applicable)

3. **Directory Structure** - Following the skill template:
   ```
   .agent/skills/<skill-name>/
   ├── skill.json
   ├── README.md
   ├── tools/ (optional)
   ├── templates/ (optional)
   ├── examples/ (optional)
   └── tests/ (optional)
   ```

### Tool Validation
Each tool in skill.json must have:
- `name` (string, required)
- `description` (string, required)
- `parameters` (object, required)
  - At least one parameter must be defined
  - Each parameter must have `type` and `description`

## Usage Examples

### Validating a Single Skill
```javascript
// Validate the skill-finder skill
const result = await skillChecker.validate_skill({
  skill_path: ".agent/skills/skill-finder"
});
// Returns: {
//   success: true,
//   data: {
//     skill_name: "skill-finder",
//     valid: true,
//     errors: [],
//     warnings: []
//   }
// }
```

### Validating All Skills
```javascript
// Validate all skills in the skills directory
const result = await skillChecker.validate_all_skills({
  verbose: true
});
// Returns: {
//   success: true,
//   data: {
//     total: 2,
//     valid: 2,
//     invalid: 0,
//     results: [
//       { skill: "skill-finder", valid: true, errors: [] },
//       { skill: "skill-checker", valid: true, errors: [] }
//     ]
//   }
// }
```

### Checking skill.json Structure
```javascript
// Check if skill.json has correct structure
const result = await skillChecker.check_skill_json({
  skill_path: ".agent/skills/skill-finder"
});
// Returns: {
//   success: true,
//   data: {
//     valid: true,
//     errors: [],
//     missing_fields: []
//   }
// }
```

### Checking Documentation Coverage
```javascript
// Check documentation completeness
const result = await skillChecker.check_documentation({
  skill_path: ".agent/skills/skill-finder"
});
// Returns: {
//   success: true,
//   data: {
//     has_readme: true,
//     sections: ["Overview", "Metadata", "Usage Examples", "Implementation"],
//     missing_sections: [],
//     word_count: 450,
//     score: 95
//   }
// }
```

### Generating a Validation Report
```javascript
// Generate comprehensive report for all skills
const result = await skillChecker.generate_validation_report({
  skill_path: "all",
  output_format: "markdown"
});
// Returns markdown report with:
// - Summary statistics
// - Per-skill validation results
// - Errors and warnings
// - Recommendations
```

## Validation Rules

### Critical Errors (Must Fix)
- Missing skill.json file
- Invalid JSON in skill.json
- Missing required fields in skill.json
- Duplicate skill names
- Invalid semantic version

### Warnings (Should Fix)
- Missing README.md
- Empty or minimal documentation
- Missing tool parameter descriptions
- No usage examples provided
- Missing tags

### Info (Nice to Have)
- No tests directory
- No examples directory
- Missing version in README
- No changelog

## Integration with CI/CD

### Pre-commit Hook
```bash
# Add to .git/hooks/pre-commit
npx skill-checker validate-all --verbose
```

### GitHub Actions
```yaml
name: Validate Skills
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate all skills
        run: npx skill-checker validate-all
```

## Error Response Format
All tools return a standardized response:
```json
{
  "success": boolean,
  "data": {
    // Tool-specific response data
  },
  "error": null | {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Common Error Codes

| Code | Description |
|------|-------------|
| SKILL_NOT_FOUND | The specified skill directory doesn't exist |
| INVALID_JSON | skill.json contains invalid JSON |
| MISSING_REQUIRED_FIELD | A required field is missing |
| INVALID_VERSION | Version string is not valid semver |
| NO_TOOLS_DEFINED | skill.json must define at least one tool |
| INVALID_PARAMETER | Tool parameter definition is invalid |

## Best Practices

1. **Run validation before deploying skills** - Always validate new skills before adding them to the ecosystem

2. **Fix critical errors immediately** - Don't deploy skills with validation errors

3. **Address warnings** - They indicate potential issues that should be resolved

4. **Maintain documentation quality** - Aim for 80%+ documentation coverage

5. **Use consistent naming** - Follow kebab-case for skill names

6. **Keep skill.json updated** - Update metadata when adding new tools or changing functionality

## Troubleshooting

### Validation Fails with "SKILL_NOT_FOUND"
- Check that the path starts from project root
- Verify the skill directory exists
- Ensure correct path separators (use `/` not `\`)

### Validation Shows "INVALID_JSON"
- Run JSON validator on skill.json
- Check for trailing commas
- Verify all quotes are matched
- Ensure proper bracket closure

### Warnings About Missing Documentation
- Create README.md in the skill directory
- Include all required sections
- Add usage examples for each tool
- Document all parameters

---

*Last Updated: 2026-03-11*