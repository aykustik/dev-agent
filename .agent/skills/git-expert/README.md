# Git Expert Skill

## Overview
The Git Expert Skill provides comprehensive Git operations for development workflows, enabling AI agents to perform version control tasks autonomously. This skill wraps common Git operations with error handling and structured responses.

## Skill Metadata
```json
{
  "name": "git-expert",
  "version": "1.0.0",
  "description": "Advanced Git operations for automated development workflows",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-11",
  "tags": ["git", "version-control", "devops", "automation"],
  "dependencies": ["simple-git"],
  "tools": [ /* see skill.json */ ]
}
```

## Installation

```bash
npm install simple-git
```

## Tool Descriptions

### create_branch
Creates and optionally checks out a new branch.

**Parameters:**
- `branch_name` (required): Name of the branch to create
- `start_point` (optional): Commit, branch, or tag to start from

**Example:**
```javascript
const result = await git.create_branch({
  branch_name: "feature/t-17-github-projects",
  start_point: "main"
});
// Returns: { success: true, branch: "feature/t-17-github-projects" }
```

### commit_changes
Stages and commits changes with optional conventional commit format.

**Parameters:**
- `message` (required): Commit message
- `type` (optional): Commit type (feat, fix, docs, style, refactor, perf, test, chore)
- `files` (optional): Specific files to commit

**Example:**
```javascript
const result = await git.commit_changes({
  type: "feat",
  message: "Add GitHub Projects skill foundation",
  files: [".agent/AGENT.md", ".agent/tasks.md"]
});
// Returns: { success: true, commit: "a1b2c3d..." }
```

### create_pull_request
Creates a pull request using GitHub CLI (`gh`).

**Parameters:**
- `title` (required): PR title
- `body` (optional): PR description
- `head` (required): Source branch
- `base` (optional, default: main): Target branch
- `draft` (optional, default: false): Create as draft

**Example:**
```javascript
const result = await git.create_pull_request({
  title: "feat: GitHub Projects Expert Skill",
  body: "## Summary\n- Implements GitHub Projects skill",
  head: "feature/t-17-github-projects",
  base: "main",
  draft: false
});
// Returns: { success: true, pr_number: 42, url: "..." }
```

### get_status
Returns the current repository status.

**Parameters:**
- `verbose` (optional, default: false): Include detailed information

**Example:**
```javascript
const result = await git.get_status({ verbose: true });
// Returns: { 
//   success: true,
//   data: {
//     current: "main",
//     tracking: "origin/main",
//     staged: ["file1.js"],
//     modified: ["file2.js"],
//     not_added: ["file3.js"]
//   }
// }
```

### get_branches
Lists local and/or remote branches.

**Parameters:**
- `remote` (optional, default: false): Include remote branches

### delete_branch
Deletes a local or remote branch.

**Parameters:**
- `branch_name` (required): Branch to delete
- `remote` (optional, default: false): Delete remote branch
- `force` (optional, default: false): Force delete

### stash_changes
Stashes current changes.

**Parameters:**
- `message` (optional): Stash message
- `include_untracked` (optional, default: true): Include untracked files

### apply_stash
Applies and removes a stash.

**Parameters:**
- `stash_index` (optional, default: 0): Stash index to apply

### get_log
Returns commit history.

**Parameters:**
- `max_count` (optional, default: 10): Number of commits
- `format` (optional, default: short): Format (short, medium, full)

## Error Handling

All tools return a standardized response format:
```json
{
  "success": boolean,
  "data": { ... },
  "error": null | { "code": "ERROR_CODE", "message": "..." }
}
```

## Common Error Codes

| Code | Description |
|------|-------------|
| NOT_A_REPOSITORY | Not in a Git repository |
| BRANCH_EXISTS | Branch already exists |
| BRANCH_NOT_FOUND | Branch does not exist |
| COMMIT_FAILED | Commit operation failed |
| GH_NOT_INSTALLED | GitHub CLI not installed |
| AUTH_FAILED | GitHub authentication failed |

## Best Practices

1. Always check status before making changes
2. Use conventional commits for automated changes
3. Create descriptive branch names using standard patterns
4. Include comprehensive PR descriptions
5. Delete feature branches after merge

## Conventional Commits

The skill supports conventional commit format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

---

*Last Updated: 2026-03-11*