# Git Expert Skill

## Overview
This skill provides comprehensive Git operations for development workflows, enabling AI agents to perform version control tasks autonomously.

## Skill Metadata
```json
{
  "name": "git-expert",
  "version": "1.0.0",
  "description": "Advanced Git operations for automated development workflows",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-10",
  "tags": ["git", "version-control", "devops"],
  "dependencies": [],
  "tools": [
    {
      "name": "create_branch",
      "description": "Create and checkout a new branch",
      "parameters": {
        "branch_name": {
          "type": "string",
          "description": "Name of the branch to create",
          "required": true
        },
        "start_point": {
          "type": "string",
          "description": "Commit, branch, or tag to start from (default: current HEAD)",
          "required": false
        }
      }
    },
    {
      "name": "commit_changes",
      "description": "Stage and commit changes with conventional commit format",
      "parameters": {
        "message": {
          "type": "string",
          "description": "Commit message",
          "required": true
        },
        "type": {
          "type": "string",
          "description": "Commit type (feat, fix, docs, style, refactor, perf, test, chore)",
          "required": false,
          "default": "feat"
        },
        "scope": {
          "type": "string",
          "description": "Commit scope (optional)",
          "required": false
        },
        "files": {
          "type": "array",
          "description": "Specific files to commit (default: all changes)",
          "items": {"type": "string"},
          "required": false
        }
      }
    },
    {
      "name": "create_pull_request",
      "description": "Create a pull request",
      "parameters": {
        "title": {
          "type": "string",
          "description": "Pull request title",
          "required": true
        },
        "body": {
          "type": "string",
          "description": "Pull request description",
          "required": false
        },
        "head": {
          "type": "string",
          "description": "Source branch",
          "required": true
        },
        "base": {
          "type": "string",
          "description": "Target branch (default: main)",
          "required": false,
          "default": "main"
        },
        "draft": {
          "type": "boolean",
          "description": "Create as draft PR",
          "required": false,
          "default": false
        }
      }
    },
    {
      "name": "merge_pull_request",
      "description": "Merge a pull request",
      "parameters": {
        "pr_number": {
          "type": "integer",
          "description": "Pull request number to merge",
          "required": true
        },
        "method": {
          "type": "string",
          "description": "Merge method (merge, squash, rebase)",
          "required": false,
          "default": "merge"
        }
      }
    },
    {
      "name": "get_status",
      "description": "Get current repository status",
      "parameters": {
        "verbose": {
          "type": "boolean",
          "description": "Include detailed status information",
          "required": false,
          "default": false
        }
      }
    }
  ]
}
```

## Usage Examples

### Creating a Feature Branch
```javascript
// Create a new feature branch from main
const result = await git.create_branch({
  branch_name: "feature/t-17-github-projects",
  start_point: "main"
});
// Returns: { success: true, branch: "feature/t-17-github-projects" }
```

### Making a Conventional Commit
```javascript
// Commit changes with conventional format
const result = await git.commit_changes({
  type: "feat",
  scope: "github-projects",
  message: "Add GitHub Projects skill foundation",
  files: [".agent/AGENT.md", ".agent/tasks.md"]
});
// Returns: { success: true, commit_hash: "a1b2c3d..." }
```

### Creating a Pull Request
```javascript
// Create a pull request for the feature branch
const result = await git.create_pull_request({
  title: "feat: GitHub Projects Expert Skill",
  body: "## Summary\n- Implements GitHub Projects skill foundation\n- Updates task management system\n- Adds conventional commit support\n\n## Testing\n- All tests passing\n- Manual verification completed",
  head: "feature/t-17-github-projects",
  base: "main"
});
// Returns: { success: true, pr_number: 42, url: "https://github.com/owner/repo/pull/42" }
```

## Implementation Notes

### Error Handling
All tools return a standardized response format:
```json
{
  "success": boolean,
  "data": {...},      // Tool-specific return data
  "error": null|string // Error message if success is false
}
```

### Security Considerations
- This skill assumes proper GitHub authentication is configured
- Repository access is limited to the configured remote
- All operations respect repository permissions

### Integration Points
- Works with the standard agent task system
- Integrates with note-taking for tracking PR status
- Compatible with worktree functionality for parallel development

## Best Practices

1. Always use conventional commits for automated changes
2. Create descriptive branch names using the standard patterns
3. Include comprehensive descriptions in pull requests
4. Keep PRs focused on single concerns when possible
5. Respond promptly to code review comments
6. Delete feature branches after merge (when appropriate)

## Troubleshooting

### Authentication Issues
- Ensure GH_TOKEN environment variable is set correctly
- Verify token has repository access permissions
- Check that the token hasn't expired

### Branch Conflicts
- Use `git status` to check current state before operations
- Consider creating worktrees for complex parallel work
- Regularly fetch and rebase from main branch

### Performance Notes
- For large repositories, consider specifying specific files in commit operations
- Use shallow clones when appropriate for CI environments
- Cache frequently accessed repository data when possible