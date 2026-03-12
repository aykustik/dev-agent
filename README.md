# KI-Dev-Agent

[![CI](https://github.com/aykustik/dev-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/aykustik/dev-agent/actions/workflows/ci.yml)
[![Sync Skills](https://github.com/aykustik/dev-agent/actions/workflows/sync.yml/badge.svg)](https://github.com/aykustik/dev-agent/actions/workflows/sync.yml)

## Beschreibung

KI-Dev-Agent ist ein Framework für KI-gestützte Entwicklungsassistenten, die eigenständig Software-Engineering-Aufgaben durch standardisierte Workflows, Task-Management und Git-Operationen erledigen können.

## Aufgaben (Tasks)

Alle 17 Tasks abgeschlossen ✅

| # | Task | Status |
|---|------|--------|
| 1 | OpenCode Skill Basis | ✅ |
| 2 | Skill-Finder | ✅ |
| 3 | Skill-Creator | ✅ |
| 4 | Skill-Checker | ✅ |
| 5 | JavaScript/TypeScript | ✅ |
| 6 | HTML/CSS | ✅ |
| 7 | UX/UI Design | ✅ |
| 8 | SSH Expertise | ✅ |
| 9 | Git-Expert | ✅ |
| 10 | Testing & QA | ✅ |
| 11 | Database Expertise | ✅ |
| 12 | API Design & Integration | ✅ |
| 13 | Security / Secure Coding | ✅ |
| 14 | DevOps / Deployment | ✅ |
| 15 | Advanced Node.js | ✅ |
| 16 | Documentation / Markdown | ✅ |
| 17 | GitHub Projects | ✅ |

## Verfügbare Skills

Das Projekt enthält **78 Skills** aus dem KI-Dev-Agent System:

### Core Skills
- skill-creator, skill-checker, find-skills

### Development Skills
- javascript-typescript, html-css, sql-toolkit, clean-code
- nextjs-expert, react-best-practices, react-native-skills

### DevOps & Tools
- git, git-workflows, docker-essentials, devops-deployment
- vercel, openguardrails

### Design & UX
- ux-ui-design, frontend-design, bencium-*-ux-designer
- ui-audit, design-audit, figma, typography

### Specialized Skills
- clerk (multiple variants), wordpress-*, sql-toolkit
- markdown-converter, pdf, recraft, fal-ai

## Notes / Ideen

- Idee: API Refactoring prüfen (Status: ✅ erledigt)
- Idee: CI/CD Pipeline einrichten (Status: ✅ erledigt)
- Idee: Mehr Beispiele für Skills (Status: ✅ erledigt)

## Branches / Worktrees

- main → Standard-Branch
- ai-task-* → Feature-Branches für einzelne Tasks

## Letzte Pull Requests

Automatisches Update durch den Agenten.

## Handoff-System

Dieses Repository nutzt ein strukturiertes Handoff-System, um Context Rot zu vermeiden und Sessions zwischen KI-Agenten sauber zu übergeben.

- **System-README:** [`.agent/handoffs/README.md`](.agent/handoffs/README.md)
- **Template:** [`.agent/handoffs/template.md`](.agent/handoffs/template.md)
- **Aktuelles Handoff:** [`.agent/handoffs/projects/LATEST.md`](.agent/handoffs/projects/LATEST.md)

### Wann Handoff erstellen?
- Session länger als 30 Minuten
- Mehr als 5 Dateien geändert
- Offene TODOs oder Blockierer am Session-Ende

## Nutzung / Setup

### Neues Projekt anlegen

```bash
# 1. Repo klonen
gh repo clone aykustik/dev-agent .

# 2. Agent starten (NICHT agent:init!)
npm run agent
```

**Wichtig:** Immer `npm run agent` verwenden - NICHT `npm run agent:init`!

### Vollständiges Setup mit Projekt-Infos

```bash
# Mit allen Projekt-Details
npm run agent:init -- \
  --description "Automatic changelog generator from Git commits" \
  --tech "Node.js,GitHub API,TypeScript" \
  --features "Parse commits,Generate Markdown,CLI interface" \
  --link
```

### GitHub Repo Optionen (wenn Repo existiert)

| Option | Beschreibung |
|--------|--------------|
| `--force` | Neue GitHub Repo erstellen (überschreiben) |
| `--link` | Mit bestehender GitHub Repo verknüpfen |
| `--no-github` | GitHub Repo überspringen |

### Alle verfügbaren Optionen

```bash
# Projekt-Infos
--description "Projektbeschreibung"
--tech "Node.js,React,TypeScript"
--features "Feature 1,Feature 2,Feature 3"
--audience "Zielgruppe"

# GitHub
--force          # Neue Repo erstellen (überschreiben)
--link           # Mit bestehender Repo verknüpfen
--no-github      # GitHub überspringen

# Sonstiges
--no-git         # Git überspringen
--no-skills      # Skills-Sync überspringen
```

### Was passiert beim Start?

Beim Ausführen von `npm run agent` passiert folgendes automatisch:

1. **Prüfe Dependencies** → `npm install` falls `node_modules/` fehlt
2. **Prüfe Skills** → sync falls veraltet oder fehlend
3. **Prüfe Projekt-Init** → initialisiere falls nicht vorhanden
4. **Prüfe Git** → altes .git entfernen, neu initialisieren
5. **GitHub Repo** → erstelle neu oder frage nach Optionen
6. **Projekt-Infos** → zeige Optionen für Beschreibung, Tech-Stack, Features

---

### Einzelne Commands

```bash
# Dependencies installieren
npm install

# Skills synchronisieren
npm run sync-skills

# Skills validieren
npm run validate-skills

# Agent Status anzeigen
npm run agent:status

# Projekt manuell initialisieren
npm run agent:init
```

---

**Version:** 1.0.0 | **Letzte Aktualisierung:** 12.03.2026