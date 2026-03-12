# Project Versioning Rules

> ⚠️ **PLATZHALTER / TEMPLATE** - Dieses Dokument überschreibt `/core/versioning.md`.
> Anpassen für Ihr spezifisches Projekt.

---

## Überschreiben

> **Anpassen:** Diese Datei überschreibt die Regeln aus `/core/versioning.md`.
> Wenn Sie die Core-Regeln verwenden wollen, löschen Sie diese Datei oder verweisen Sie auf `/core/versioning.md`.

---

## Eigene Versionierungsregeln definieren

### Semantic Versioning anpassen

> **Anpassen:** Möchten Sie SemVer verwenden?

- [ ] Ja, wie in `/core/versioning.md` beschrieben
- [ ] Nein, eigene Regeln verwenden

### Alternative Versionierung

> **Anpassen:** Falls Sie SemVer nicht verwenden wollen:

| Schema | Beschreibung | Beispiel |
|--------|--------------|----------|
| Kalenderbasiert | JJJJ.MM.TAG | 2026.03.12 |
| Build-Nummern | Fortlaufende Nummer | 1.2.3.4 |
| Codename | Codename + Nummer | Apollo-7 |

---

## Wann Version erhöhen?

> **Anpassen:** Spezifische Regeln für dieses Projekt

### PATCH

> **Anpassen:** Wann PATCH erhöhen

Beispiel:
- Bug-Fixes
- Kleine Dokumentations-Änderungen

### MINOR

> **Anpassen:** Wann MINOR erhöhen

Beispiel:
- Neue Features
- API-Erweiterungen

### MAJOR

> **Anpassen:** Wann MAJOR erhöhen

Beispiel:
- Breaking Changes
- Architektur-Änderungen

---

## Release-Prozess

> **Anpassen:** Eigene Release-Schritte

1. **Version erhöhen** in `package.json`
2. **Commit** mit Standard-Nachricht
3. **Tag erstellen**
4. **Pushen**

Oder eigene Schritte definieren:

```bash
# Beispiel: Eigener Release-Prozess
npm version patch -m "Release %s"
git push && git push --tags
npm publish
```

---

## Checkliste für dieses Projekt

- [ ] SemVer oder eigenes Schema wählen
- [ ] PATCH/MINOR/MAJOR Regeln definieren
- [ ] Release-Prozess dokumentieren
- [ ] Testing vor Release festlegen

---

## Referenz

Falls Sie die Core-Versioning-Regeln verwenden wollen:

```markdown
Siehe: [/core/versioning.md](../core/versioning.md)
```

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
