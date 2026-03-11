# Project Repository Rules

> ⚠️ **PLATZHALTER / TEMPLATE** - Dieses Dokument enthält Beispiele und Vorlagen.
> Anpassen für Ihr spezifisches Projekt basierend auf Ihren Anforderungen.

---

## Projekt-Beschreibung

> **Anpassen:** Kurze Beschreibung was dieses Projekt macht

Beispiel: *Dieses Projekt ist ein KI-gestütztes Entwickler-Framework für die Automatisierung von Software-Entwicklungsaufgaben.*

---

## Branch-Naming-Konvention

> **Anpassen:** Branch-Pattern für dieses Projekt

### Feature Branches

```
<prefix>/<ticket-id>-<kurze-beschreibung>
```

| Token | Erlaubte Werte | Beispiel |
|-------|---------------|---------|
| `<prefix>` | `feature`, `fix`, `hotfix`, `refactor` | `feature` |
| `<ticket-id>` | Ticket-Nummer oder Issue-ID | `123`, `TASK-42` |
| `<kurze-beschreibung>` | kebab-case | `add-user-auth` |

**Beispiel:**
```
feature/123-add-user-authentication
fix/456-login-redirect-issue
hotfix/789-security-patch
```

> **Anpassen:** Eigenes Pattern definieren, z.B.:
> - `{prefix}/{ticket-id}`
> - `{prefix}/{ticket-id}/{description}`
> - `sprint-{number}/{ticket-id}`

---

## Commit-Messages

> **Anpassen:** Commit-Style für dieses Projekt

### Conventional Commits (empfohlen)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

| Type | Beschreibung |
|------|--------------|
| `feat` | Neue Feature |
| `fix` | Bug-Fix |
| `docs` | Dokumentation |
| `style` | Code-Style (keine Funktionsänderung) |
| `refactor` | Code-Refactoring |
| `perf` | Performance-Verbesserung |
| `test` | Tests hinzugefügt/geändert |
| `chore` | Maintenance (keine Code-Änderung) |

**Beispiel:**
```
feat(auth): add JWT token refresh mechanism

- Implements token refresh endpoint
- Adds refresh token to cookie
- Updates auth middleware

Closes #123
```

> **Anpassen:** Alternativen:
> - Free-form mit Emoji
> - Nur Type: Description
> - Mit oder ohne Scope

---

## Pull Request Workflow

> **Anpassen:** PR-Prozess für dieses Projekt

### Standard流程

1. **Branch erstellen** vom `main`
2. **Änderungen machen** mit atomaren Commits
3. **PR erstellen** mit Template
4. **Code Review** abwarten
5. **CI/CD Tests bestehen**
6. **Merge** (Squash oder Rebase)

### PR Template

```markdown
## Beschreibung

<!-- Was macht diese Änderung? -->

## Änderungstyp

- [ ] Feature
- [ ] Bug-Fix
- [ ] Refactoring
- [ ] Dokumentation
- [ ] Sonstiges

## Checkliste

- [ ] Tests hinzugefügt/aktualisiert
- [ ] Dokumentation aktualisiert
- [ ] CI/CD bestanden
- [ ] Code Review durchgeführt
```

---

## Wann welche Skills verwenden

> **Anpassen:** Für dieses Projekt relevante Skills

| Task-Typ | Empfohlene Skills |
|----------|------------------|
| Git-Operationen | `git`, `git-workflows` |
| Frontend-Entwicklung | `javascript-typescript`, `html-css`, `frontend-design` |
| Backend-Entwicklung | `advanced-nodejs`, `api-design`, `database-expertise` |
| Tests | `testing-qa` |
| Security | `security-coding` |
| DevOps | `devops-deployment`, `docker-essentials` |
| Dokumentation | `documentation-automation`, `markdown-converter` |
| WordPress | `wordpress-router`, `wp-*` |

> **Anpassen:** Skill-Matrix für Ihr Projekt erstellen

---

## Repository-Struktur

> **Anpassen:** Projekt-spezifische Struktur

```
projekt-name/
├── src/                  # Hauptquelle
├── tests/                # Tests
├── docs/                 # Dokumentation
├── scripts/              # Build/Deploy Scripts
├── .github/              # GitHub Actions
└── ...
```

> **Anpassen:** Anpassbare Verzeichnisstruktur definieren

---

## Issue/Ticket-Verknüpfung

> **Anpassen:** Wie Issues mit Code verknüpft werden

- Issues in Commits referenzieren: `Closes #123`, `Fixes #456`
- Issues in PRs verlinken: `Related to #789`

---

## CI/CD Pipeline

> **Anpassen:** Pipeline für dieses Projekt

**Empfohlene Stages:**

1. **Lint** - Code-Qualität prüfen
2. **Test** - Unit/Integration Tests
3. **Build** - Projekt bauen
4. **Deploy** - Deployen (optional)

> **Anpassen:** Pipeline-Stages definieren

---

## Checkliste für dieses Projekt anpassen

- [ ] Branch-Pattern definieren
- [ ] Commit-Style festlegen
- [ ] PR-Template erstellen
- [ ] Skills-Matrix erstellen
- [ ] Verzeichnisstruktur definieren
- [ ] CI/CD Pipeline konfigurieren
- [ ] Issue-Template erstellen

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
