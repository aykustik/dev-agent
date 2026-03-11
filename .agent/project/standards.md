# Project Standards

> ⚠️ **PLATZHALTER / TEMPLATE** - Dieses Dokument enthält Beispiele und Vorlagen.
> Anpassen für Ihr spezifisches Projekt basierend auf Ihren Anforderungen.

---

## Coding-Standards

> **Anpassen:** Programmiersprachen und Standards für dieses Projekt

### Programmiersprachen

| Sprache | Version | Hinweis |
|---------|---------|---------|
| JavaScript | ES2022+ | Modernes JS |
| TypeScript | 5.x | TypeScript verwenden |
| Python | 3.11+ | Falls relevant |

> **Anpassen:** Verwendete Sprachen und Versionen eintragen

---

### Code-Style

> **Anpassen:** Style-Guide für dieses Projekt

**Empfohlene Tools:**

- **JavaScript/TypeScript:** ESLint + Prettier
- **Python:** Black + Flake8
- **Allgemein:** EditorConfig

**Beispiel `.eslintrc.js`:**

```javascript
module.exports = {
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'prefer-const': 'error'
  }
};
```

> **Anpassen:** Eigene ESLint/Prettier Config erstellen

---

## Test-Anforderungen

> **Anpassen:** Test-Standards für dieses Projekt

### Test-Framework

> **Anpassen:** Gewünschtes Framework wählen

| Framework | Use Case |
|----------|----------|
| Jest | JavaScript/TypeScript |
| Vitest | Modernes Jest-Alternative |
| Mocha | Klassisch |
| pytest | Python |

### Test-Coverage

> **Anpassen:** Coverage-Anforderungen

**Minimum:**
- Unit Tests: **70%** Coverage
- Integration Tests: Für kritische Pfade
- E2E Tests: Für User Journeys

### Test-Dateien

```
src/
├── component.ts        # Source
├── component.test.ts  # Unit Test
├── component.e2e.ts   # E2E Test
└── component.mock.ts  # Mocks
```

---

## Dokumentations-Standards

> **Anpassen:** Dokumentations-Anforderungen

### README.md Struktur

```markdown
# Project Name

## Beschreibung

## Installation

## Usage

## API (falls relevant)

## Contributing

## License
```

### API-Dokumentation

- OpenAPI/Swagger für REST-APIs
- JSDoc für JavaScript/TypeScript
- Sphinx für Python

> **Anpassen:** Dokumentations-Tools festlegen

---

## Security-Standards

> **Anpassen:** Security-Anforderungen

### Secrets Management

- ❌ Keine Secrets in Code
- ✅ Environment Variables
- ✅ Secrets Manager (AWS Secrets Manager, HashiCorp Vault)
- ✅ .env Dateien in .gitignore

### Dependencies

- ✅ `npm audit` regelmäßig ausführen
- ✅ Dependabot/Renovate aktivieren
- ✅ Security Updates innerhalb von 7 Tagen

### Code Security

- Input Validation (nie User-Input vertrauen)
- SQL Parameterized Queries
- XSS Prevention
- CSRF Tokens

---

## Performance-Standards

> **Anpassen:** Performance-Anforderungen

### Frontend

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

### Backend

- Response Time: < 200ms (p95)
- Uptime: > 99.9%
- Error Rate: < 0.1%

---

## Naming-Konventionen

> **Anpassen:** Namenskonventionen

| Type | Convention | Beispiel |
|------|------------|----------|
| Dateien | kebab-case | `user-service.ts` |
| Klassen | PascalCase | `UserService` |
| Funktionen | camelCase | `getUserById()` |
| Konstanten | UPPER_SNAKE | `MAX_RETRIES` |
| Variablen | camelCase | `userName` |
| Branches | kebab-case | `feature/add-login` |
| Git Tags | v1.0.0 | `v1.2.3` |

---

## Git-Workflow

> **Anpassen:** Git-Workflow

### Optionen

| Workflow | Wann verwenden |
|----------|----------------|
| Git Flow | Release-basiert |
| GitHub Flow | Continuous Deployment |
| Trunk-Based | Agile Teams |

> **Anpassen:** Gewählten Workflow dokumentieren

---

## CI/CD Standards

> **Anpassen:** Pipeline-Anforderungen

### Must-Have Stages

```yaml
stages:
  - lint      # Code-Qualität
  - test      # Tests ausführen
  - build     # Bauen
  - security  # Security Scan
  - deploy    # Deploy (optional)
```

### Qualitäts-Gates

- Lint: 0 Errors
- Tests: 100% Pass
- Coverage: > 70%
- Security: 0 Critical/High Vulnerabilities

---

## Checkliste für dieses Projekt anpassen

- [ ] Programmiersprachen und Versionen definieren
- [ ] ESLint/Prettier Config erstellen
- [ ] Test-Framework einrichten
- [ ] Coverage-Anforderungen festlegen
- [ ] README-Template erstellen
- [ ] Security-Scanning einrichten
- [ ] CI/CD Pipeline definieren
- [ ] Naming-Konventionen dokumentieren

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
