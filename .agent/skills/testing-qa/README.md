# Testing & QA Framework

## Overview
The Testing & QA Framework provides comprehensive quality assurance tools for the KI-Dev-Agent ecosystem. It integrates test execution, linting, type checking, security audits, and coverage reporting into a unified system.

## Skill Metadata
```json
{
  "name": "testing-qa",
  "version": "1.0.0",
  "description": "Testing and Quality Assurance framework",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-11",
  "tags": ["testing", "qa", "quality", "ci-cd", "linting"]
}
```

## Tool Descriptions

### run_tests
Run tests for the project using the appropriate test framework.

**Parameters:**
- `framework` (optional): Test framework (jest, mocha, vitest, auto) - default: "auto"
- `coverage` (optional): Generate coverage report - default: false
- `pattern` (optional): Test file pattern

**Example:**
```javascript
const result = await testingQA.run_tests({
  framework: "jest",
  coverage: true,
  pattern: "**/*.test.js"
});
// Returns: { success: true, data: { passed: 42, failed: 0, skipped: 2, coverage: 85 } }
```

### lint_code
Run linting on code files.

**Parameters:**
- `fix` (optional): Auto-fix issues - default: false
- `files` (optional): Specific files to lint

**Example:**
```javascript
const result = await testingQA.lint_code({
  fix: true,
  files: [".agent/skills/git-expert/scripts/git-expert.js"]
});
// Returns: { success: true, data: { errors: 0, warnings: 2, fixed: 2 } }
```

### check_quality
Run comprehensive quality checks.

**Parameters:**
- `include` (optional): Checks to include (lint, tests, security, types)

**Example:**
```javascript
const result = await testingQA.check_quality({
  include: ["lint", "tests", "security"]
});
// Returns: { 
//   success: true, 
//   data: { 
//     lint: { status: "pass", errors: 0 },
//     tests: { status: "pass", passed: 42 },
//     security: { status: "pass", vulnerabilities: 0 }
//   } 
// }
```

### generate_coverage_report
Generate and display coverage report.

**Parameters:**
- `format` (optional): Report format (text, html, json) - default: "text"
- `min_coverage` (optional): Minimum required coverage - default: 80

**Example:**
```javascript
const result = await testingQA.generate_coverage_report({
  format: "text",
  min_coverage: 80
});
// Returns: { success: true, data: { coverage: 85, status: "pass", lines: {...} } }
```

### validate_types
Run TypeScript type checking.

**Parameters:**
- `strict` (optional): Use strict mode - default: false

### check_dependencies
Check for outdated or vulnerable dependencies.

**Parameters:**
- `audit` (optional): Run security audit - default: true

### create_test_scaffold
Create test file scaffold for a given source file.

**Parameters:**
- `source_file` (required): Path to source file
- `framework` (optional): Test framework - default: "jest"

**Example:**
```javascript
const result = await testingQA.create_test_scaffold({
  source_file: "src/utils/helper.js",
  framework: "jest"
});
// Returns: { success: true, data: { file: "src/utils/helper.test.js", created: true } }
```

### get_test_status
Get current test and quality status.

## Quality Gates

The framework enforces the following quality gates:

| Gate | Threshold | Action on Failure |
|------|-----------|-------------------|
| Tests | All must pass | Block merge |
| Coverage | ≥ 80% | Warning |
| Lint | 0 errors | Block merge |
| Security | 0 vulnerabilities | Warning |

## CI/CD Integration

### GitHub Actions
```yaml
name: Quality Checks
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Run lint
        run: npm run lint
      - name: Check security
        run: npm audit
```

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
npm run lint
npm test
```

## Test Frameworks Supported

| Framework | Auto-Detection | Config File |
|-----------|---------------|-------------|
| Jest | ✅ | jest.config.js |
| Mocha | ✅ | .mocharc.json |
| Vitest | ✅ | vitest.config.js |
| AVA | ✅ | package.json |

## Best Practices

1. **Run tests before commit** - Always run `npm test` before committing
2. **Maintain coverage** - Keep coverage above 80%
3. **Fix lint errors** - Don't ignore lint warnings
4. **Regular audits** - Run security audits regularly
5. **Use type checking** - Enable TypeScript for better quality

## Configuration

The framework can be configured via `.agent/config.json`:

```json
{
  "qa": {
    "min_coverage": 80,
    "lint_on_save": true,
    "test_on_save": false,
    "security_audit_frequency": "weekly"
  }
}
```

## Error Response Format

All tools return standardized responses:

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
| NO_TESTS_FOUND | No test files found |
| TEST_FAILED | Tests failed |
| LINT_ERRORS | Linting found errors |
| COVERAGE_TOO_LOW | Coverage below threshold |
| NO_PACKAGE_JSON | package.json not found |
| FRAMEWORK_NOT_FOUND | Test framework not installed |

---

*Last Updated: 2026-03-11*