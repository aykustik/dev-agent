# Project Patterns

> ⚠️ **PLATZHALTER / TEMPLATE** - Dieses Dokument enthält Beispiele und Vorlagen.
> Anpassen für Ihr spezifisches Projekt basierend auf Ihren Anforderungen.

---

## Git Patterns

> **Anpassen:** Git-Workflow-spezifische Patterns für dieses Projekt

### Branch Lifecycle

```
main ───────────────────────────────
   │
   ├── feature/123-new-feature
   │      │
   │      ├── develop & test
   │      │
   │      └── merge back to main
   │
   └── hotfix/456-urgent-fix
          │
          ├── fix & test
          │
          └── merge & tag
```

### Commit Anatomy

```bash
# Gut
feat(auth): add JWT token refresh
fix(api): resolve timeout issue  
docs(readme): update installation steps
refactor(utils): simplify parsing logic

# Vermeiden
fix stuff
update
WIP
asdf
```

### Merging Strategy

> **Anpassen:** Merge-Strategie wählen

| Strategie | Wann | Pros |
|-----------|------|------|
| Squash & Merge | Feature Branches | Saubere History |
| Rebase | Private Branches | Lineare History |
| Merge Commit | Release Branches | Vollständige History |

---

## Code Patterns

> **Anpassen:** Code-spezifische Patterns

### Feature Toggle Pattern

```javascript
// Feature-Flag
const FEATURES = {
  newDashboard: process.env.FEATURE_NEW_DASHBOARD === 'true',
};

// Usage
if (FEATURES.newDashboard) {
  return <NewDashboard />;
} else {
  return <OldDashboard />;
}
```

### Error Handling Pattern

```javascript
// Standardisierte Fehlerbehandlung
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

// Usage
throw new AppError('Benutzer nicht gefunden', 404, 'USER_NOT_FOUND');
```

### Repository Pattern

```javascript
// Datenbank-Zugriff kapseln
class UserRepository {
  async findById(id) {
    return db.users.findOne({ where: { id } });
  }
  
  async create(data) {
    return db.users.create(data);
  }
}
```

---

## API Patterns

> **Anpassen:** API-Design Patterns

### RESTful Endpoints

```
GET    /api/users          # Alle Benutzer
GET    /api/users/:id      # Ein Benutzer
POST   /api/users          # Benutzer erstellen
PUT    /api/users/:id      # Benutzer aktualisieren
DELETE /api/users/:id      # Benutzer löschen
```

### Request/Response Pattern

```javascript
// Request Validation
const createUserSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  }
};

// Response Format
{
  success: true,
  data: { /* response data */ },
  meta: { /* pagination, etc. */ }
}
```

---

## Testing Patterns

> **Anpassen:** Test-Patterns

### AAA Pattern

```javascript
describe('Calculator', () => {
  it('should add two numbers', () => {
    // Arrange
    const calc = new Calculator();
    
    // Act
    const result = calc.add(2, 3);
    
    // Assert
    expect(result).toBe(5);
  });
});
```

### Mock Pattern

```javascript
// External API mocks
jest.mock('./api/client', () => ({
  fetchUser: jest.fn()
}));

// Usage in test
apiClient.fetchUser.mockResolvedValue({ id: 1, name: 'Test' });
```

---

## CI/CD Patterns

> **Anpassen:** CI/CD Patterns

### GitHub Actions Workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

---

## Decision Log Pattern

> **Anpassen:** Architektur-Entscheidungen dokumentieren

### Template

```markdown
## ADR-001: [Titel]

### Status
Proposed | Accepted | Deprecated | Superseded

### Context
[Beschreibung des Problems/der Situation]

### Decision
[Beschreibung der getroffenen Entscheidung]

### Consequences
- **Positiv:** [Positive Effekte]
- **Negativ:** [Negative Effekte]

### Related
- [Verweise auf andere ADRs]
```

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
