# DevOps & Deployment

## Overview
DevOps & Deployment skill provides CI/CD pipelines, Docker, Kubernetes, and cloud deployment configurations.

## Tools
- `generate_dockerfile` - Generate Dockerfile
- `generate_github_actions` - Generate GitHub Actions workflow
- `generate_k8s_manifest` - Generate Kubernetes manifest
- `setup_monitoring` - Generate monitoring config

## Docker Best Practices
- Use multi-stage builds
- Don't run as root
- Use .dockerignore
- Minimize layers
- Use specific tags not latest
- Cache dependencies

## CI/CD Pipeline
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
```

## Kubernetes Best Practices
- Use namespaces
- Set resource limits
- Use readiness/liveness probes
- Store secrets in secrets manager
- Use ConfigMaps for config
