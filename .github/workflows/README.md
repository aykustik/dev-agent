# GitHub Actions Workflows

This directory contains CI/CD workflows for the KI-Dev-Agent project.

## Workflows

### ci.yml
Continuous Integration - runs on every push and PR to main.

**Jobs:**
- `validate` - Validates all skills using skill-checker
- `lint` - Checks JavaScript syntax and skill.json files

**Triggers:**
- Push to `main`
- Pull request to `main`

---

### sync.yml
Weekly skill synchronization from central repo.

**Features:**
- Runs every Sunday at 6 AM
- Can be triggered manually (`workflow_dispatch`)
- Creates automatic PR if new skills are available
- Dry-run before actual sync

**Triggers:**
- Schedule (weekly)
- Manual (`workflow_dispatch`)

---

### release.yml
Automated release creation.

**Features:**
- Creates GitHub Release when tag is pushed
- Runs validation before release
- Generates release summary

**Triggers:**
- Push of tags matching `v*`

---

## Setup

### Required Secrets
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

### Required Tools
- Node.js 20
- GitHub CLI (`gh`)

---

## Badge für README.md

```markdown
[![CI](https://github.com/aykustik/dev-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/aykustik/dev-agent/actions/workflows/ci.yml)
```

---

## Manual Execution

To run workflows manually:

1. Go to Actions tab in GitHub
2. Select workflow
3. Click "Run workflow"
