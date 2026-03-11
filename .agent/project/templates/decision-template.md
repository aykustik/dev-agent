# Decision Template

> ⚠️ **PLATZHALTER / TEMPLATE** - Dieses Dokument enthält Beispiele und Vorlagen.
> Anpassen für Ihr spezifisches Projekt basierend auf Ihren Anforderungen.

---

## Architecture Decision Record (ADR)

Ein ADR dokumentiert eine wichtige Architektur-Entscheidung.

---

## ADR Template

```markdown
# ADR-{NNN}: {Kurztitel}

## Status
- [ ] Proposed (Vorgeschlagen)
- [x] Accepted (Akzeptiert)
- [ ] Deprecated (Veraltet)
- [ ] Superseded (Ersetzt durch ADR-{NNN})

## Datum
{YYYY-MM-DD}

## Context
## Problem

Beschreibung des Problems oder der Situation, die diese Entscheidung erfordert.

## Decision

Beschreibung der getroffenen Entscheidung.

## Consequences

### Positiv
- Vorteil 1
- Vorteil 2

### Negativ
- Nachteil 1
- Nachteil 2

## Alternatives

### Verworfene Option A
Warum diese Option verworfen wurde

### Verworfene Option B
Warum diese Option verworfen wurde

## Notes
Zusätzliche Notizen oder Kommentare

## Related
- ADR-XXX (verwandte Entscheidung)
- Issue #123
```

---

## ADR Beispiele

### ADR-001: TypeScript als primäre Sprache

```markdown
# ADR-001: TypeScript als primäre Sprache

## Status
- [x] Accepted

## Datum
2026-03-11

## Context
Wir brauchen eine typsichere Sprache für bessere Developer Experience und weniger Runtime-Fehler.

## Decision
Wir verwenden TypeScript für alle neuen Projekte und migrieren schrittweise bestehenden JavaScript-Code.

## Consequences
### Positiv
- Type-Safety zur Compile-Zeit
- Bessere IDE-Unterstützung
- Einfachere Refactorings

### Negativ
- Lernkurve für JS-Entwickler
- Längere Build-Zeiten
```

---

## Wann ADRs erstellen

| Situation | Erforderlich? |
|-----------|---------------|
| Neue Technologie/Framework | ✅ |
| Änderung an Architektur | ✅ |
| Neue Datenbank | ✅ |
| Security-Änderung | ✅ |
| Code-Style Änderung | ❌ (in standards.md) |
| Kleine Bug-Fixes | ❌ |

---

## ADR Liste führen

Erstellen Sie eine `ADR-README.md` im Projekt:

```markdown
# Architecture Decision Records

| ID | Titel | Status | Datum |
|----|-------|--------|--------|
| ADR-001 | TypeScript als primäre Sprache | Accepted | 2026-03-11 |
| ADR-002 | PostgreSQL als Datenbank | Accepted | 2026-03-11 |
```

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
