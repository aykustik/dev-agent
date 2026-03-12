# AI-Agent Instructions

Dies ist die zentrale Anleitung für AI-Agenten, die dieses Projekt autonom bearbeiten. 
Ziel: Tasks abarbeiten, README.md aktualisieren, Git-Operationen durchführen und Tasks dokumentieren.

## Konfiguration

### config.json Pflichtfelder

Prüfe `.agent/config.json` auf Vollständigkeit:

```json
{
  "githubTokenEnv": "GH_TOKEN",
  "defaultBranchPrefix": "ai-",
  "projectID": null,
  "workspaceStartupScript": "npm install",
  "autoUpdateTasks": true,
  "branchPattern": "feature/t-{number}-{slug}",
  "worktreePath": "./worktrees",
  "commitStyle": "conventional"
}
```

**Branch-Pattern Optionen:**
| Pattern | Beispiel |
|---------|----------|
| `ai-{number}` | ai-17 |
| `feature/t-{number}` | feature/t-17 |
| `feature/t-{number}-{slug}` | feature/t-17-github-projects |
| `tasks/{number}` | tasks/17 |

**Variablen:** `{number}` = Issue-Nummer, `{slug}` = URL-kodierter Titel

### Startup Script

Vor jeder Task-Ausführung: `workspaceStartupScript` ausführen (z.B. `npm install`)

---

## Tasks

- Lies `.agent/tasks.md` als Single Source of Truth.
- Tasks enthalten:
  - GitHub Issue: URL zum Issue
  - Branch: Worktree / Feature-Branch (aus Pattern generiert)
  - Status: todo | in-progress | done
  - Priority: low | medium | high
  - Notes: zusätzliche Informationen
- Statusänderungen:
  - Nach erfolgreichem Merge oder PR → Status auf done setzen
  - Verschiebe erledigte Tasks optional in `completed.md`

### Task-Erstellung filtern

- Ein Task wird nur erstellt, wenn:
  1. Es sich um eine konkrete, umsetzbare Arbeit handelt.
  2. Die Aufgabe im Code, in Config, Branch oder Dokumentation resultiert.
  3. Es eine klar definierte Ausgabe gibt (Code, Pull Request, README-Update, Issue-Update).
- Keine Tasks erstellen für:
  - Diskussionen im Chat
  - Fragen, Ideen, Mein Tests oder Experimente ohne festen Outcome
- Bei Unsicherheit:
  - Task zunächst in `Notes` markieren, Status `pending review`

### GitHub Issues synchronisieren

Falls `gh auth` verfügbar:
```bash
gh issue list --repo <owner>/<repo> --state open
```

Neue Issues nur hinzufügen wenn nicht bereits als Task vorhanden (vergleiche Issue-URL).

---

## Notes (optional)

- Temporäre Ideen, Fragen oder Diskussionen, die noch keine echte Task sind.
- Können später manuell oder automatisch in Tasks konvertiert werden.
- Beispielstruktur:
  - Issue / Branch optional
  - Status: pending review
  - Beschreibung / Gedanken

---

## README.md Aktualisierung

- README.md ist Dokumentation für Menschen.
- Folgende Abschnitte werden gepflegt:
  - Projektbeschreibung
  - Übersicht aller Tasks mit Status (gruppiert nach Priority: high → medium → low)
  - Branches / Worktrees
  - Letzte Pull Requests
  - Notes aus tasks.md
  - Timestamp: `Last Updated: <DATUM>`
- Tasks in README.md werden aus `.agent/tasks.md` übernommen.
- Änderungen im Code / Tasks → README.md automatisch aktualisieren.

---

## Git-Operationen

### 1. Branch erstellen

```bash
# Aus Branch-Pattern generieren
# feature/t-{number}-{slug} → feature/t-17-github-projects
git checkout -b feature/t-17-github-projects
```

### 2. Worktree erstellen (optional)

```bash
# Worktree für parallele Entwicklung
git worktree add ./worktrees/feature-t-17-github-projects -b feature/t-17-github-projects
```

### 3. Commit

**Standard:**
```bash
git add .
git commit -m "AI-Agent: Update Task #17 / README"
```

**Conventional (falls commitStyle=conventional):**
```bash
git commit -m "feat: (#17) GitHub Projects Skill hinzugefügt"
```

### 4. Push & PR

```bash
git push -u origin feature/t-17-github-projects
gh pr create --title "Task Updates" --body "## Änderungen ..."
```

### 5. Nach PR Merge

- Task Status → done
- README.md aktualisieren
- Worktree optional löschen

---

## Multi-Agent / Multi-Session

- Diese Anweisungen gelten für alle AI-Agenten, die Zugriff auf das Repo haben
  (OpenCode, Claude, CodeX, …)
- Alle Tasks bleiben in `tasks.md` Single Source of Truth
- README.md ist synchronisierte Dokumentation
- Branches / Worktrees werden nach Standardpräfix und Pattern organisiert
- config.json wird automatisch gepflegt

## Skills

Skills sind kontextuelle Wissensmodule unter `.agent/skills/`, die bei Bedarf geladen werden können.

### Skill-Discovery

```bash
# Alle verfügbaren Skills auflisten
npm run skills:list

# Skills nach Keywords durchsuchen
npm run skills:find git
npm run skills:find "api design"
```

### Skill-Details

```bash
# Metadata und Dateien eines Skills anzeigen
npm run skills:show git-expert

# Vollständigen Skill-Inhalt laden (für Kontext-Injection)
npm run skills:context git-expert
```

### Wann Skills nutzen

- **Vor komplexen Tasks**: Prüfe ob ein relevantes Skill existiert
- **Unsicherheit bei Best Practices**: Skills enthalten domain-spezifische Guidelines
- **Framework-spezifische Arbeit**: Clerk, WordPress, Vercel, etc. haben eigene Skills

### Skill-Formate

Skills können in verschiedenen Formaten vorliegen:
- `skill.json` + README.md (KI-Dev-Agent native, vollständig)
- `.claude-plugin/plugin.json` + SKILL.md (Claude Desktop Plugins)
- SKILL.md (opencode/community format)
- `[kein Inhalt]` Platzhalter (benötigt `npm run sync-skills`)

**Bekannte Edge-Cases:**
- `accesslint` – MCP Server mit Sub-Skills (.mcp.json Format) → aktuell nicht vom skill-loader unterstützt, bekannter Edge-Case. Falls MCP-Server-Skills später öfter vorkommen, lohnt sich ein eigener Loader-Handler

## Handoff-Pflichten

Um Context Rot zu vermeiden und die Zusammenarbeit zwischen Sessions zu gewährleisten:

### Automatische Handoff-Erstellung (Empfohlen)

Vor **jedem** Session-Ende automatisch ausführen:

```bash
npm run agent:handoff
```

Das Script prüft automatisch:
- **Files Changed** >= 5
- **Session Duration** >= 30 Minuten
- **Open TODOs** in tasks.md
- **In-Progress Tasks** in tasks.md

Wenn ein Kriterium zutrifft → Handoff wird automatisch erstellt und committed.

**Optionen:**
```bash
npm run agent:handoff --force    # Immer erstellen
npm run agent:handoff --dry      # Nur prüfen, nicht erstellen
```

### Manuelle Handoff-Kriterien

Ein Handoff ist **Pflicht** wenn:
1. Session dauert länger als 30 Minuten
2. Mehr als 5 Dateien wurden geändert/erstellt
3. Es gibt offene TODOs oder ungelöste Probleme am Session-Ende
4. Vor einem Branch-Wechsel oder bevor man an einem anderen Task weiterarbeitet

Siehe `.agent/handoffs/README.md` für detaillierte Richtlinien.

### Handoff-Workflow

1. **Vor Session-Ende**: `npm run agent:handoff` ausführen
2. **Ablageort**: Handoffs landen automatisch in `.agent/handoffs/projects/<projekt>/`
3. **LATEST.md**: Wird automatisch aktualisiert
4. **Commit**: Handoff wird automatisch committed
5. **Session-Start**: Zu Beginn jeder Session `LATEST.md` konsultieren

---

## Task Block Beispiel

- GitHub Issue: https://github.com/org/repo/issues/17
- Branch: feature/t-17-github-projects
- Status: todo
- Priority: high
- Notes: GitHub Projects Expert Skill entwickeln