# Versioning Guidelines

> Universelle Versionierungsrichtlinien für das KI-Dev-Agent Framework.
> Überschreibbar durch `/project/versioning.md`.

---

## Semantic Versioning (SemVer)

| Version | Wann erhöhen | Beispiel |
|---------|--------------|----------|
| **PATCH** (1.0.x) | Bug-Fixes, die nichts brechen | 1.0.0 → 1.0.1 |
| **MINOR** (1.x.0) | Neue Features, rückwärts-kompatibel | 1.0.0 → 1.1.0 |
| **MAJOR** (x.0.0) | Breaking Changes | 1.0.0 → 2.0.0 |

---

## Wann welche Version?

### PATCH (1.0.0 → 1.0.1)

- Bug-Fixes
- Dokumentations-Änderungen
- Interne Refactorings ohne API-Änderung
- Performance-Verbesserungen ohne API-Änderung

### MINOR (1.0.0 → 1.1.0)

- Neue Features
- Rückwärts-kompatible API-Erweiterungen
- Substantielle neue Funktionalität
- Neue Skills oder Module
- Neue CLI-Commands

### MAJOR (1.0.0 → 2.0.0)

- Breaking Changes in APIs
- Entfernung veralteter Features
- Architektur-Änderungen
- Umstellung von CommonJS auf ESM
- Komplette Neuausrichtung des Projekts

---

## Release Workflow

### Manueller Release

```bash
# 1. Version in package.json erhöhen

# 2. Commit mit Versions-Bump
git add -A
git commit -m "chore: bump version to 1.1.0"

# 3. Tag erstellen
git tag v1.1.0

# 4. Pushen mit Tags
git push origin main --tags
```

### Automatischer Release (GitHub Actions)

```bash
# Tag im Format v* pushen
git tag v1.1.0
git push origin v1.1.0
```

Der `release.yml` Workflow wird automatisch getriggert.

---

## NPM Scripts

```bash
# Release starten (manuell)
npm run release

# Version anzeigen
npm run version
```

---

## GitHub Releases

### Was passiert beim Release?

1. CI validiert alle Tests
2. GitHub Release wird erstellt
3. Release Notes werden generiert
4. Version-Tag wird gesetzt

### Release Notes Format

```markdown
## What's Changed

- feat: add new feature by @contributor
- fix: resolve bug in module X

**Full Changelog**: https://github.com/user/repo/compare/v1.0.0...v1.1.0
```

---

## Version in diesem Projekt prüfen

```bash
# Aktuelle Version anzeigen
npm run agent:version
# oder
node -p "require('./package.json').version"
```

---

## Best Practices

1. **Keine Commits direkt auf main für Releases**
   - Feature-Branches verwenden
   - PRs für alles

2. **Changelog führen**
   - Änderungen dokumentieren
   - Conventional Commits verwenden

3. **Version vor Veröffentlichung erhöhen**
   - Nie rückgängig machen
   - Konsistent sein

4. **Tags signieren (optional)**
   ```bash
   git tag -s v1.0.0 -m "Release v1.0.0"
   ```

---

## Verwandte Dokumente

- [repo_rules.md](../project/repo_rules.md) - Commit-Regeln
- [GitHub Actions](../.github/workflows/) - CI/CD Pipeline

---

*Zuletzt aktualisiert: 2026-03-12*
