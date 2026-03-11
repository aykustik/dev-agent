# Task Template

> ⚠️ **PLATZHALTER / TEMPLATE** - Dieses Dokument enthält Beispiele und Vorlagen.
> Anpassen für Ihr spezifisches Projekt basierend auf Ihren Anforderungen.

---

## Task erstellen

Verwenden Sie dieses Template um neue Tasks zu erstellen:

```markdown
<!-- TASKS-START -->
- GitHub Issue: https://github.com/<owner>/<repo>/issues/<nummer>
- Branch: <branch-pattern>
- Status: todo | in-progress | done
- Priority: low | medium | high
- Notes: <kurze-beschreibung>
<!-- TASKS-END -->
```

---

## Task-Vorlage (Ausführlich)

```
# Task: <Titel>

## Beschreibung
<Klare Beschreibung was zu tun ist>

## Akzeptanzkriterien
- [ ] Kriterium 1
- [ ] Kriterium 2
- [ ] Kriterium 3

## Abhängigkeiten
- Issue #123
- Task #456

## Geschätzter Aufwand
- [ ] Small (< 1 Tag)
- [ ] Medium (1-3 Tage)
- [ ] Large (> 3 Tage)

## Technische Notizen
<Technische Details falls relevant>

## Ressourcen
- Link zur Dokumentation
- Link zum Design
- Link zu ähnlichen Implementierungen
```

---

## Priorisierung

| Priority | Wann | Farbe |
|----------|------|-------|
| **High** | Kritisch für Release, Blockiert andere | 🔴 |
| **Medium** | Wichtig, aber nicht kritisch | 🟡 |
| **Low** | Nice-to-have, keine Eile | 🟢 |

---

## Workflow

```
todo → in-progress → review → done
         ↓
      blocked
```

### Status-Übergänge

| Von | Nach | Wann |
|-----|------|------|
| todo | in-progress | Task wird gestartet |
| in-progress | review | Arbeit fertig, Review nötig |
| review | done | Review bestanden |
| review | in-progress | Review-Feedback |
| * | blocked | Auf externen Input warten |
| blocked | in-progress | Blockierung aufgelöst |

---

## Task-Beispiele

### Gut formuliert

```
- GitHub Issue: https://github.com/org/repo/issues/123
- Branch: feature/123-user-login
- Status: todo
- Priority: high
- Notes: Implementiere JWT-Authentifizierung mit Refresh Tokens
```

### Vermeiden

```
- Branch: my-branch
- Status: todo
- Notes: irgendwas machen
```

---

## Integration mit Skills

> **Anpassen:** Welche Skills für welche Task-Typen

| Task-Typ | Empfohlene Skills |
|----------|-------------------|
| Backend API | `api-design`, `database-expertise` |
| Frontend | `javascript-typescript`, `html-css` |
| DevOps | `docker-essentials`, `devops-deployment` |
| Security | `security-coding` |
| Dokumentation | `documentation-automation` |

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
