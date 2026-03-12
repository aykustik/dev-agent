# Git Expert Examples

## Branch Management

### Create Feature Branch
```bash
git checkout -b feature/my-feature
```

### List All Branches
```bash
git branch -a
```

### Delete Local Branch
```bash
git branch -d feature/my-feature
```

---

## Commit Workflow

### Stage and Commit
```bash
git add .
git commit -m "feat: add new feature"
```

### Amend Last Commit
```bash
git commit --amend -m "new message"
```

---

## Pull Requests

### Create PR from Command Line
```bash
gh pr create --title "Feature X" --body "Description"
```

### List PRs
```bash
gh pr list
```

---

## Using with Task Runner

```bash
# Start new task
node .agent/core/scripts/task-runner.js start ai-task-18

# After completing task
node .agent/core/scripts/task-runner.js done ai-task-18
```
