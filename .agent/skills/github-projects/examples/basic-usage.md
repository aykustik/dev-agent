# GitHub Projects Examples

## Using GitHub CLI

### Create Issue
```bash
gh issue create --title "New Feature" --body "Description"
```

### List Issues
```bash
gh issue list
```

---

## Project Management

### Add to Project
```bash
gh project item-add 1 --owner username --url "https://github.com/user/repo/issues/1"
```

---

## Automations

### Close Stale Issues
```bash
gh issue list --state all | grep "stale" | awk '{print $1}' | xargs -I {} gh issue close {}
```

---

## Using with Task Runner

```bash
node .agent/core/scripts/task-runner.js start github-task
node .agent/core/scripts/task-runner.js done github-task
```
