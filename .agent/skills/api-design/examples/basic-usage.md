# API Design Examples

## REST API

### Endpoint Design
```
GET    /api/users          # List users
POST   /api/users          # Create user
GET    /api/users/:id      # Get user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

---

## OpenAPI Specification

```yaml
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: List of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```

---

## Authentication

### JWT Token
```javascript
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}
```

---

## Using with Skill Loader

```bash
node .agent/core/scripts/skill-loader.js find api
```
