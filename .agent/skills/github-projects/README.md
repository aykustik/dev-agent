# GitHub Projects Skill

## Kurzbeschreibung

Skill zur Verwaltung von GitHub Projects (v2) via CLI:

- **gh-pm Extension** - Empfohlen für beste UX
- **Offizielle gh project Commands** - Für volle Kontrolle
- **PowerShell Scripts** - Optional für Windows

## Schnellstart

### 1. GitHub CLI installieren
```bash
# macOS
brew install gh

# Windows
winget install GitHub.cli
```

### 2. Authentifizieren
```bash
gh auth login
gh auth refresh -s project
```

### 3. gh-pm installieren (empfohlen)
```bash
gh extension install yahsan2/gh-pm
gh pm init
```

## Nutzung

```bash
# Issues auflisten
gh pm list

# Issue erstellen
gh pm create --title "Neues Feature" --priority p1

# Issue verschieben
gh pm move 123 --status done

# Bulk Triage
gh pm triage tracked
```

## Dokumentation

Siehe [SKILL.md](./SKILL.md) für vollständige Dokumentation.
