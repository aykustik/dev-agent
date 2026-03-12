# Skill Checker Examples

## Validate All Skills

```bash
npm run validate-skills
```

---

## Validate Specific Skill

```bash
node .agent/skills/skill-checker/scripts/validate.js validate git-expert
```

---

## Verbose Output

```bash
npm run validate-skills:verbose
```

---

## Skill Structure

A valid skill must have:
```
skills/
└── my-skill/
    ├── skill.json      # Required metadata
    ├── README.md       # Documentation
    └── examples/       # Optional examples
```

---

## skill.json Schema

```json
{
  "name": "My Skill",
  "description": "What this skill does",
  "keywords": ["keyword1", "keyword2"],
  "tools": [
    {
      "name": "tool-name",
      "description": "What it does",
      "parameters": {}
    }
  ]
}
```

---

## Using with Skill Loader

```bash
node .agent/core/scripts/skill-loader.js find validation
```
