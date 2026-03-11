# Documentation & Markdown Automation

## Overview
Documentation Automation skill generates README files, API docs, and changelogs automatically from code.

## Tools
- `generate_readme` - Generate README.md
- `generate_api_docs` - Generate API documentation
- `extract_jsdocs` - Extract JSDoc to markdown
- `generate_changelog` - Generate changelog

## README Template Sections
- Project title and description
- Badges (build, coverage, version)
- Installation
- Usage examples
- API documentation
- Contributing guidelines
- License

## JSDoc Example
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

## Conventional Changelog
```
## [1.0.0] (2026-03-11)

### Features
- Add new API endpoint

### Bug Fixes
- Fix authentication issue

### Breaking Changes
- Remove deprecated endpoint
```
