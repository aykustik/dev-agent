# OpenCode Skill Basis

## Overview
The OpenCode Skill Basis is the core framework that all skills in the KI-Dev-Agent ecosystem build upon. It provides the foundational infrastructure for skill loading, configuration management, tool execution, and inter-skill communication.

## Skill Metadata
```json
{
  "name": "opencode-skill-basis",
  "version": "1.0.0",
  "description": "Core framework and foundation for all skills",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-11",
  "tags": ["core", "framework", "foundation", "base"]
}
```

## Core Components

### 1. Skill Loader
Loads and initializes skills dynamically at runtime.

### 2. Configuration Manager
Manages global and skill-specific configuration with dot-notation support.

### 3. Tool Executor
Provides a unified interface for executing tools across all skills.

### 4. Event System
Enables communication between skills through events.

### 5. Project Context
Maintains information about the current project state.

## Tool Descriptions

### load_skill
Load and initialize a skill by name.

**Parameters:**
- `skill_name` (required): Name of the skill to load

**Example:**
```javascript
const result = await skillBasis.load_skill({ skill_name: "git-expert" });
// Returns: { success: true, data: { skill: "git-expert", loaded: true } }
```

### list_available_skills
List all available skills in the system.

**Example:**
```javascript
const result = await skillBasis.list_available_skills();
// Returns: { 
//   success: true, 
//   data: { 
//     skills: ["opencode-skill-basis", "skill-finder", "skill-checker", "git-expert"],
//     count: 4 
//   } 
// }
```

### get_skill_info
Get detailed information about a specific skill.

**Parameters:**
- `skill_name` (required): Name of the skill

**Example:**
```javascript
const result = await skillBasis.get_skill_info({ skill_name: "git-expert" });
// Returns: {
//   success: true,
//   data: {
//     name: "git-expert",
//     version: "1.0.0",
//     description: "Advanced Git operations",
//     tools: ["create_branch", "commit_changes", ...],
//     tags: ["git", "version-control"]
//   }
// }
```

### execute_tool
Execute a specific tool from any loaded skill.

**Parameters:**
- `skill_name` (required): Name of the skill
- `tool_name` (required): Name of the tool to execute
- `parameters` (optional): Tool parameters as key-value pairs

**Example:**
```javascript
const result = await skillBasis.execute_tool({
  skill_name: "git-expert",
  tool_name: "get_status",
  parameters: { verbose: true }
});
// Returns: { success: true, data: { current: "main", tracking: "origin/main", ... } }
```

### get_config
Get configuration value by key (supports dot notation).

**Parameters:**
- `key` (required): Configuration key (e.g., "github.token" or "defaults.branch")

**Example:**
```javascript
const result = await skillBasis.get_config({ key: "github.token" });
// Returns: { success: true, data: { key: "github.token", value: "***" } }
```

### set_config
Set a configuration value.

**Parameters:**
- `key` (required): Configuration key
- `value` (required): Configuration value

**Example:**
```javascript
const result = await skillBasis.set_config({
  key: "defaults.branch",
  value: "main"
});
// Returns: { success: true, data: { key: "defaults.branch", value: "main" } }
```

### get_project_info
Get information about the current project.

**Example:**
```javascript
const result = await skillBasis.get_project_info();
// Returns: {
//   success: true,
//   data: {
//     name: "ki-dev-agent",
//     version: "0.1.0",
//     root: "/path/to/project",
//     branch: "main",
//     skills_count: 4,
//     config: { ... }
//   }
// }
```

### register_handler
Register an event handler for inter-skill communication.

**Parameters:**
- `event` (required): Event name to listen for
- `handler` (required): Handler function name

**Example:**
```javascript
const result = await skillBasis.register_handler({
  event: "skill.loaded",
  handler: "onSkillLoaded"
});
// Returns: { success: true, data: { event: "skill.loaded", registered: true } }
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenCode Skill Basis                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Skill Loader │  │Config Manager│  │   Event System   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Tool Executor (unified interface)       │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Skills (pluggable)                       │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────────┐     │
│  │Git-Expert│ │Skill-Finder│ │Skill-Checker│ │Other Skills│    │
│  └─────────┘ └──────────┘ └─────────┘ └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Configuration Schema

```json
{
  "github": {
    "token_env": "GH_TOKEN",
    "default_repo": null,
    "api_url": "https://api.github.com"
  },
  "defaults": {
    "branch": "main",
    "branch_prefix": "ai-task",
    "commit_style": "conventional"
  },
  "workspace": {
    "startup_script": "npm install",
    "auto_update_tasks": true
  },
  "skills": {
    "enabled": [],
    "disabled": []
  }
}
```

## Events

The framework emits the following events:

| Event | Description | Data |
|-------|-------------|------|
| `skill.loaded` | A skill was loaded | `{ skill_name, version }` |
| `skill.unloaded` | A skill was unloaded | `{ skill_name }` |
| `tool.executed` | A tool was executed | `{ skill_name, tool_name, success }` |
| `config.changed` | Configuration changed | `{ key, old_value, new_value }` |
| `error` | An error occurred | `{ error, context }` |

## Error Codes

| Code | Description |
|------|-------------|
| SKILL_NOT_FOUND | Specified skill doesn't exist |
| SKILL_NOT_LOADED | Skill hasn't been loaded yet |
| TOOL_NOT_FOUND | Tool doesn't exist in skill |
| TOOL_EXECUTION_FAILED | Tool execution failed |
| CONFIG_NOT_FOUND | Configuration key doesn't exist |
| INVALID_PARAMETER | Parameter validation failed |

## Integration

### Loading a Skill
```javascript
// First, load the skill basis
const basis = await skillBasis.load_skill({ skill_name: "opencode-skill-basis" });

// Then load another skill through the basis
await basis.load_skill({ skill_name: "git-expert" });

// Execute tools through the unified interface
const status = await basis.execute_tool({
  skill_name: "git-expert",
  tool_name: "get_status"
});
```

### Configuration Management
```javascript
// Get config
const token = await basis.get_config({ key: "github.token_env" });

// Set config
await basis.set_config({ 
  key: "defaults.branch", 
  value: "main" 
});

// Nested config
await basis.set_config({ 
  key: "custom.my_setting", 
  value: "value" 
});
```

## Best Practices

1. **Always load skill basis first** - It's the foundation for all other skills
2. **Use unified tool execution** - Execute tools through the basis for consistent error handling
3. **Leverage configuration** - Store shared settings in config, not hardcoded
4. **Use events for communication** - Decouple skills through the event system
5. **Handle errors gracefully** - All tools return standardized error responses

## Extending the Framework

To add new functionality to the core:

1. Add the tool definition to `skill.json`
2. Implement the tool in the framework code
3. Update this documentation
4. Validate with Skill Checker

---

*Last Updated: 2026-03-11*