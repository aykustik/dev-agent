# GitHub Projects Skill

## Überblick

Der **GitHub Projects Skill** ermöglicht die Verwaltung von GitHub Projects (v2) über die **GitHub CLI** (`gh`).

Dieser Skill basiert auf:
- Offizieller GitHub CLI `project` Command (GA seit Juli 2023)
- `gh-pm` Extension (https://github.com/yahsan2/gh-pm) für erweiterte Features

---

## Voraussetzungen

- **GitHub CLI ≥ 2.0** (`gh`)
- **PowerShell ≥ 7.0** oder Bash (für PowerShell Scripts)
- GitHub Token mit `repo` und `project` Berechtigungen

### Auth prüfen
```bash
gh auth status
```

Falls `project` Scope fehlt:
```bash
gh auth refresh -s project
```

---

## Installation & Setup

### 1. GitHub CLI installieren

```powershell
# Windows (winget)
winget install GitHub.cli

# macOS
brew install gh

# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh
```

### 2. Authentifizieren
```bash
gh auth login
```

### 3. gh-pm Extension (empfohlen)
```bash
gh extension install yahsan2/gh-pm
```

---

## Option A: gh-pm Extension (Empfohlen)

Die **gh-pm** Extension bietet die beste UX für Project Management.

### Init - Projekt einrichten
```bash
gh pm init
# → Erstellt .gh-pm.yml mit Field-Mapping
# → Detektiert automatisch Repository und Projects
# → Mappt Status/Priority Werte
```

### Commands

```bash
# Issues auflisten (wie gh issue list + Project-Filter)
gh pm list
gh pm list --status "in_progress"
gh pm list --priority "p0,p1"
gh pm list --label bug --assignee @me

# Issue erstellen
gh pm create --title "Neues Feature" --priority p1 --label enhancement

# Issue anzeigen
gh pm view 123

# Issue verschieben (Status/Priority)
gh pm move 123 --status in_progress
gh pm move 123 --status done --priority p0

# Issue Intake (Issues hinzufügen die noch nicht im Project sind)
gh pm intake --label bug
gh pm intake --apply "status:backlog,priority:p2"

# Triage (Bulk-Update)
gh pm triage tracked
gh pm triage estimate --list  # Dry-run

# Issue Splitting (Sub-Issues erstellen)
gh pm split 123 --from=body
gh pm split 123 "Task 1" "Task 2" "Task 3"

# Konfiguration anzeigen
gh pm config
```

### Konfiguration (.gh-pm.yml)

```yaml
project:
  name: "My Project"
  number: 1
  
defaults:
  priority: medium
  status: "Todo"
  
fields:
  priority:
    field: "Priority"
    values:
      p0: "Critical"
      p1: "High"
      p2: "Medium"
      
  status:
    field: "Status"
    values:
      backlog: "Backlog"
      ready: "Ready"
      in_progress: "In Progress"
      done: "Done"
```

---

## Option B: Offizielle GitHub CLI

### Projects

```bash
# Alle Projects auflisten
gh project list
gh project list --owner myorg

# Project erstellen
gh project create --owner myuser --title "Mein Project"

# Project anzeigen
gh project view --owner myorg 1

# Project kopieren
gh project copy 1 --source-owner myorg --target-owner myuser --title "Meine Kopie"
```

### Fields

```bash
# Fields auflisten
gh project field-list 1 --owner myuser

# Field erstellen
gh project field-create --owner myuser 1 --name "Priority" --single-select "P0,P1,P2,P3"
```

### Items (Issues/PRs)

```bash
# Items auflisten
gh project item-list 1 --owner myuser
gh project item-list 1 --owner myorg --format json | jq '.items[]'

# Issue zu Project hinzufügen
gh project item-add 1 --owner myuser --issue-id <issue-id>

# Item bearbeiten (Status, Priority, etc.)
gh project item-edit <item-id> --field "Status=In Progress" --field "Priority=P0"

# Item archivieren
gh project item-archive <item-id>
```

### JSON Output + jq

```bash
# JSON Output für Scripting
gh project view 1 --owner myuser --format json

# Issues mit Status "Todo" filtern
gh project item-list 1 --owner myorg --format json | jq '.items[] | select(.status=="Todo")'

# URLs aller Issues mit Priority "High"
gh project item-list 1 --owner myorg --format json | jq '.items[] | select(.priority=="High") | .content.url'
```

---

## Option C: PowerShell Scripts

Für Windows-Nutzer gibt es optionale PowerShell-Scripts im `scripts/` Ordner.

### Nutzung

```powershell
# Projekt-ID finden
gh project list --owner myuser

# Scripts ausführen
pwsh ./scripts/list_items.ps1 -ProjectID 1
pwsh ./scripts/create_tasks.ps1 -ProjectID 1
pwsh ./scripts/update_tasks.ps1 -ItemID <id> -Status "Done"
pwsh ./scripts/list_views.ps1 -ProjectID 1
```

---

## Wichtige Hinweise

### Feldnamen

Die Feldnamen (**Status**, **Priority**, **Category**) **müssen exakt so** in deinem GitHub Project definiert sein!

### Feldnamen prüfen
```bash
gh project field-list <PROJECT_ID> --owner myuser
```

### Project-ID finden

Die Project-ID findest du in der URL:
```
https://github.com/users/USERNAME/projects/NUMBER
                           --------------------
                           Das ist die ID!
```

---

## Tipps & Best Practices

- **gh-pm verwenden** - Bietet die beste UX mit Auto-Completion und Field-Mapping
- **JSON Output + jq** - Für Automatisierung in Scripts
- **Dry-run Mode** - Immer zuerst testen bevor Änderungen angewendet werden
- **Field-Mapping konfigurieren** - In `.gh-pm.yml` um Kurzformen zu nutzen (`p0` statt `P0`)

---

## Abhängigkeiten

- **GitHub CLI (`gh`) ≥ 2.0** – Required
- **jq** – Für JSON-Verarbeitung (optional)
- **PowerShell ≥ 7.0** – Für PowerShell Scripts (optional)

---

## Quick Reference

| Task | Befehl |
|------|--------|
| Project auflisten | `gh project list --owner user` |
| Issues auflisten | `gh pm list` |
| Issue erstellen | `gh pm create --title "Titel" --priority p1` |
| Issue verschieben | `gh pm move 123 --status done` |
| Issue hinzufügen | `gh pm intake --label bug` |
| Bulk Triage | `gh pm triage tracked` |
| Sub-Issues erstellen | `gh pm split 123 --from=body` |
| Fields prüfen | `gh project field-list 1` |

---

## Externe Links

- GitHub CLI Documentation: https://cli.github.com/manual/gh_project
- gh-pm Extension: https://github.com/yahsan2/gh-pm
- GitHub Projects Blog: https://github.blog/developer-skills/github/github-cli-project-command-is-now-generally-available/

---

## Autor & Version

- **Autor:** Aykut
- **Version:** 2.0.0
