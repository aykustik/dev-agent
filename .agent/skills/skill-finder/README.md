# Skill Finder

## Overview
The Skill Finder is a discovery system for the KI-Dev-Agent ecosystem that enables agents to locate and understand available skills.

## Skill Metadata
```json
{
  "name": "skill-finder",
  "version": "1.0.0",
  "description": "System for discovering and cataloging available skills in the KI-Dev-Agent ecosystem",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-11",
  "tags": ["discovery", "metadata", "registry"],
  "dependencies": [],
  "tools": [
    {
      "name": "list_skills",
      "description": "List all available skills in the system",
      "parameters": {
        "include_details": {
          "type": "boolean",
          "description": "Include detailed skill information",
          "required": false,
          "default": false
        },
        "tags": {
          "type": "array",
          "description": "Filter skills by tags",
          "items": {"type": "string"},
          "required": false
        }
      }
    },
    {
      "name": "find_skill_by_name",
      "description": "Find a skill by its name",
      "parameters": {
        "skill_name": {
          "type": "string",
          "description": "Name of the skill to find",
          "required": true
        }
      }
    },
    {
      "name": "find_skills_by_tag",
      "description": "Find skills that match specific tags",
      "parameters": {
        "tags": {
          "type": "array",
          "description": "Tags to search for",
          "items": {"type": "string"},
          "required": true
        },
        "match_all": {
          "type": "boolean",
          "description": "Whether skill must match all tags (true) or any tag (false)",
          "required": false,
          "default": false
        }
      }
    },
    {
      "name": "get_skill_metadata",
      "description": "Get detailed metadata for a specific skill",
      "parameters": {
        "skill_name": {
          "type": "string",
          "description": "Name of the skill",
          "required": true
        }
      }
    }
  ]
}
```

## Usage Examples

### Listing All Skills
```javascript
// Get a list of all available skills
const result = await skillFinder.list_skills();
// Returns: {
//   success: true,
//   data: [
//     { name: "git-expert", version: "1.0.0", tags: ["git", "version-control"] },
//     { name: "testing-qa", version: "1.0.0", tags: ["testing", "quality"] },
//     // ... more skills
//   ]
// }
```

### Finding Skills by Tag
```javascript
// Find all skills related to testing
const result = await skillFinder.find_skills_by_tag({
  tags: ["testing"],
  match_all: false
});
// Returns: {
//   success: true,
//   data: [
//     { name: "testing-qa", version: "1.0.0", tags: ["testing", "quality"] },
//     { name: "devops-deployment", version: "1.0.0", tags: ["devops", "testing"] }
//   ]
// }
```

### Getting Detailed Skill Information
```javascript
// Get detailed information about the git-expert skill
const result = await skillFinder.get_skill_metadata({
  skill_name: "git-expert"
});
// Returns: {
//   success: true,
//   data: {
//     name: "git-expert",
//     version: "1.0.0",
//     description: "Advanced Git operations for automated development workflows",
//     author: "KI-Dev-Agent Team",
//     created: "2026-03-10",
//     tags: ["git", "version-control", "devops"],
//     dependencies: [],
//     tools: [ /* tool definitions */ ]
//   }
// }
```

## Implementation Details

### Skill Discovery Mechanism
The Skill Finder works by scanning the `.agent/skills/` directory for valid skill installations. Each skill must have:
1. A `skill.json` file with valid metadata
2. Proper directory structure following the skill template
3. Readable permissions for the agent system

### Data Sources
- Primary: `.agent/skills/` directory scan
- Cache: Optional in-memory cache for performance
- Fallback: Hardcoded list of core skills (for bootstrap scenarios)

### Performance Considerations
- Skills are indexed on first load for faster subsequent queries
- Tag-based searches use efficient lookup structures
- Results are cached for configurable time periods
- Large skill libraries benefit from lazy loading of detailed metadata

## Integration with KI-Dev-Agent System

### Task Assignment
When a task requires specific expertise:
1. Task analysis identifies needed capabilities
2. Skill Finder searches for matching skills
3. Agent system selects the most appropriate skill
4. Task is assigned to use that skill's tools

### Skill Recommendation
The Skill Finder can suggest complementary skills:
- Based on commonly used skill combinations
- From historical task success patterns
- Through tag co-occurrence analysis

## Best Practices

### For Skill Developers
1. Use descriptive, unique skill names
2. Include relevant tags for discoverability
3. Keep skill metadata up-to-date
4. Follow semantic versioning
5. Provide clear, concise descriptions

### For Skill Users
1. Use specific tag combinations for precise results
2. Check skill versions for compatibility
3. Review skill dependencies before use
4. Test skills in isolation before production use

## Troubleshooting

### No Skills Found
- Verify `.agent/skills/` directory exists and is accessible
- Check that skill directories contain valid `skill.json` files
- Ensure file permissions allow reading by the agent process
- Verify JSON syntax in all skill.json files

### Incorrect Search Results
- Confirm tag spelling and case sensitivity
- Verify `match_all` parameter is set correctly
- Check for duplicate skill installations
- Review skill metadata for accuracy

### Performance Issues
- Consider enabling caching for frequently accessed skills
- Limit detailed information requests when not needed
- Use specific tag filters to reduce result sets
- Monitor skill directory size for extremely large collections

## Future Enhancements
1. Skill popularity ranking based on usage statistics
2. Skill compatibility matrix for identifying conflicts
3. Automated skill updates from remote repositories
4. User ratings and reviews for skills
5. Skill bundles or profiles for common use cases