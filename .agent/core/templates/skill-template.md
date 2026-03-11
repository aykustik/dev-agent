# Skill Template

## Overview
This template provides the standard structure for creating new skills in the KI-Dev-Agent system.

## Skill Structure
```
.skill/
├── skill.json          # Skill metadata and configuration
├── README.md           # Skill documentation
├── tools/              # Available tools for this skill
│   ├── tool1.py       # Example tool implementation
│   └── tool2.js       # Example tool implementation
├── templates/          # Skill-specific templates
├── examples/           # Usage examples
└── tests/              # Test cases
```

## skill.json Configuration
```json
{
  "name": "skill-name",
  "version": "1.0.0",
  "description": "Brief description of what this skill does",
  "author": "Developer Name",
  "created": "YYYY-MM-DD",
  "tags": ["tag1", "tag2"],
  "dependencies": [],
  "tools": [
    {
      "name": "tool-name",
      "description": "What this tool does",
      "parameters": {
        "param1": {
          "type": "string",
          "description": "Parameter description",
          "required": true
        }
      }
    }
  ]
}
```

## Development Guidelines

### 1. Skill Creation Process
1. Create a new directory under `.agent/skills/skill-name/`
2. Copy this template as starting point
3. Update skill.json with your skill details
4. Implement tools in the tools/ directory
5. Add documentation in README.md
6. Create usage examples in examples/
7. Add test cases in tests/

### 2. Tool Implementation Standards
- Tools should be stateless when possible
- All tools must handle errors gracefully
- Tools should return structured data (JSON preferred)
- Include parameter validation
- Document all parameters and return values

### 3. Documentation Requirements
- Clear skill purpose and use cases
- Installation and setup instructions
- Usage examples with expected outputs
- Parameter documentation for all tools
- Known limitations and troubleshooting

### 4. Testing Standards
- Unit tests for each tool
- Integration tests for skill workflows
- Test both success and error cases
- Maintain >80% code coverage

## Example Skill: Basic File Operations

Let's look at a simplified example of a file operations skill:

```json
{
  "name": "file-operations",
  "version": "1.0.0",
  "description": "Basic file system operations for development tasks",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-10",
  "tags": ["filesystem", "utility"],
  "dependencies": [],
  "tools": [
    {
      "name": "read_file",
      "description": "Read contents of a file",
      "parameters": {
        "file_path": {
          "type": "string",
          "description": "Path to the file to read",
          "required": true
        }
      }
    },
    {
      "name": "write_file",
      "description": "Write content to a file",
      "parameters": {
        "file_path": {
          "type": "string",
          "description": "Path to the file to write",
          "required": true
        },
        "content": {
          "type": "string",
          "description": "Content to write to the file",
          "required": true
        }
      }
    }
  ]
}
```

## Naming Conventions
- Use kebab-case for skill names (e.g., `git-operations`)
- Use descriptive names that clearly indicate purpose
- Version using semantic versioning (MAJOR.MINOR.PATCH)
- Tag skills with relevant keywords for discovery

## Deployment
Skills are automatically discovered when placed in the `.agent/skills/` directory.
To use a skill:
1. Place skill folder in `.agent/skills/`
2. Ensure skill.json is valid
3. Restart or refresh the agent system
4. Skill will be available for task assignment

## Troubleshooting
- Validate skill.json format if skill not loading
- Check tool implementations for syntax errors
- Review agent logs for loading errors
- Ensure all dependencies are available