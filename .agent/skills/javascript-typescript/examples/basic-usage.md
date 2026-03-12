# JavaScript TypeScript Examples

## TypeScript Setup

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## Common Patterns

### Interface Definition
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json());
}
```

---

## Using with Skill Loader

```bash
# Find TypeScript skills
node .agent/core/scripts/skill-loader.js find typescript
```

---

## Best Practices

- Use `strict: true` in tsconfig
- Define interfaces for all API responses
- Use `const` instead of `let` when possible
- Enable ESLint with TypeScript parser
