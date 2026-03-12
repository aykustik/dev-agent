# Security Coding Examples

## Input Validation

### Validate Email
```javascript
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

---

## Password Handling

### Hash Password
```javascript
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
```

---

## Environment Variables

### Using dotenv
```javascript
require('dotenv').config();

// Access variables
const API_KEY = process.env.API_KEY;
const DB_URL = process.env.DATABASE_URL;
```

---

## Common Vulnerabilities

| Vulnerability | Prevention |
|---------------|------------|
| XSS | Escape output, use CSP |
| CSRF | Use anti-csrf tokens |
| SQL Injection | Use parameterized queries |
| Secrets in code | Use environment variables |

---

## Using with Skill Loader

```bash
node .agent/core/scripts/skill-loader.js find security
```
