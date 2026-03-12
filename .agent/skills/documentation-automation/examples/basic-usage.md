# Documentation Automation Examples

## Auto-generate README

### Using JSDoc
```javascript
/**
 * Adds two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}
```

Generate docs:
```bash
npx jsdoc ./src -d ./docs
```

---

## API Documentation

### OpenAPI to Markdown
```bash
npx @redocly/cli build-docs openapi.yaml --output
```

---

## Using with Task Runner

```bash
node .agent/core/scripts/task-runner.js start docs-update
node .agent/core/scripts/task-runner.js done docs-update
```

---

## Best Practices

- Write docs as you code (docstrings)
- Keep README.md in sync with features
- Use automated tools for API docs
- Add badges for CI/CD status
