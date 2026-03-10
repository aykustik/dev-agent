# dev-agent Project

## Description

This project provides a framework for AI agent development and management. The system is designed to help developers create, manage, and deploy AI agents with consistent practices and tooling.

## Main Features

- Standardized AI agent configurations
- Task and note management system  
- Git workflow automation
- Multi-agent compatibility layer
- Project-specific rule enforcement

## Setup & Usage

### Prerequisites
- Node.js (v16 or higher)
- npm (latest version)

### Installation
```bash
npm install
```

### Development Workflow
1. Create new feature branches from `main`
2. Use conventional commit messages
3. All changes must go through pull requests
4. Follow the task management system in `.agent/tasks.md`

## Architecture

### Project Structure

```text
.agent/
  core/              # Core agent components and workflows
    prompts/         # Standard prompts for agents
    workflows/       # Standard workflows
  project/           # Project-specific configurations
    architecture.md  # Technical architecture diagram
    repo_rules.md    # Repository rules and conventions
```

## Contributing

All contributions should follow the standard GitHub workflow:
1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit pull request

## Version History

This project follows semantic versioning. Current version: 0.1.0

## License

MIT License

## Contact

For questions about this project, contact the maintainers.