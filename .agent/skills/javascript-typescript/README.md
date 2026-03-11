# JavaScript/TypeScript Expertise

## Overview
The JavaScript/TypeScript Expertise skill provides comprehensive development tools for modern JavaScript and TypeScript development. It includes code generation, refactoring, optimization, and best practices guidance.

## Skill Metadata
```json
{
  "name": "javascript-typescript",
  "version": "1.0.0",
  "description": "JavaScript and TypeScript expertise",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-11",
  "tags": ["javascript", "typescript", "frontend", "development", "es6", "nodejs"]
}
```

## Tool Descriptions

### generate_code
Generate JavaScript/TypeScript code from specification.

**Parameters:**
- `type` (required): Code type (class, function, component, hook, service, utility)
- `name` (required): Name of the code to generate
- `language` (optional): javascript or typescript - default: typescript

**Example:**
```javascript
const result = await jsTS.generate_code({
  type: "class",
  name: "UserService",
  language: "typescript"
});
```

### refactor_code
Refactor JavaScript/TypeScript code to modern patterns.

**Parameters:**
- `code` (required): Code to refactor
- `target` (optional): Target pattern (functional, oop, hooks, classes) - default: functional

### add_types
Add TypeScript types to JavaScript code.

**Parameters:**
- `code` (required): JavaScript code to add types to
- `strict` (optional): Use strict typing - default: true

### optimize_code
Optimize JavaScript code for performance.

**Parameters:**
- `code` (required): Code to optimize
- `target` (optional): Optimization target (size, speed, memory) - default: speed

### generate_test
Generate unit tests for JavaScript/TypeScript code.

**Parameters:**
- `code` (required): Code to generate tests for
- `framework` (optional): jest, mocha, vitest - default: jest

### validate_syntax
Validate JavaScript/TypeScript syntax.

**Parameters:**
- `code` (required): Code to validate
- `language` (optional): javascript or typescript - default: javascript

### convert_to_esm
Convert CommonJS to ES Modules.

**Parameters:**
- `code` (required): CommonJS code to convert

### get_best_practices
Get best practices for JavaScript/TypeScript.

**Parameters:**
- `topic` (optional): async, types, classes, modules, testing

## Code Generation Templates

### Class (TypeScript)
```typescript
class UserService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  async getUser(id: string): Promise<User> {
    return this.apiClient.get(`/users/${id}`);
  }
  
  async createUser(data: CreateUserDto): Promise<User> {
    return this.apiClient.post('/users', data);
  }
  
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return this.apiClient.put(`/users/${id}`, data);
  }
  
  async deleteUser(id: string): Promise<void> {
    return this.apiClient.delete(`/users/${id}`);
  }
}
```

### React Hook
```typescript
import { useState, useEffect, useCallback } from 'react';

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.get(userId);
      setUser(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  return { user, loading, error, refetch: fetchUser };
}
```

## Best Practices

### Async/Await
```typescript
// ✅ Good
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// ❌ Bad
function fetchData() {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error(error));
}
```

### TypeScript Interfaces
```typescript
// ✅ Good - Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Use type for unions/intersections
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = User & { role: UserRole };
```

### Functional Programming
```typescript
// ✅ Good - Immutable, pure functions
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];

const names = users
  .filter(u => u.age >= 26)
  .map(u => u.name);

// ❌ Bad - Mutating arrays
const names = [];
for (const user of users) {
  if (user.age >= 26) {
    names.push(user.name);
  }
}
```

## Error Handling

```typescript
// ✅ Good - Try-catch with specific errors
async function safeAsync<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as Error];
  }
}

// Usage
const [user, error] = await safeAsync(fetchUser(id));
if (error) {
  // Handle error
}
```

## Performance Tips

1. **Use `useMemo` and `useCallback`** - Memoize expensive computations
2. **Lazy loading** - Load code only when needed
3. **Debounce/Throttle** - Limit function execution frequency
4. **Virtual DOM** - Let frameworks handle DOM updates efficiently
5. **Web Workers** - Offload heavy computations

---

*Last Updated: 2026-03-11*