# Testing QA Examples

## Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=my-test
```

---

## Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## CI Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
```

---

## Using with Task Runner

```bash
node .agent/core/scripts/task-runner.js start testing-task
# ... do work ...
node .agent/core/scripts/task-runner.js done testing-task
```
