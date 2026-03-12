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

## Handoff-Pflichten

Um Context Rot zu vermeiden und die Zusammenarbeit zwischen Sessions zu gewährleisten:

1. **Handoff-Erstellung**: Vor Session-Ende muss geprüft werden, ob ein Handoff erforderlich ist (siehe `.agent/handoffs/README.md` für Kriterien).
2. **Pflicht-Handoff bei**: 
   - Session länger als 30 Minuten
   - Mehr als 5 Dateien geändert
   - Offene TODOs oder Blockierer vorhanden
3. **Ablageort**: Handoffs gehören in `.agent/handoffs/projects/<projekt>/` oder `.agent/handoffs/sessions/` gemäß Struktur.
4. **Verweis auf Tasks**: Im Handoff müssen relevante Task-Referenzen (#<Issue>) angegeben werden.
5. **Nach Handoff-Erstellung**: Das Handoff-Dokument muss committet und idealerweise via PR zur Review eingefordert werden.
6. **Session-Start**: Zu Beginn jeder Session muss das aktuelle LATEST.Handoff des jeweiligen Projekts konsultiert werden.

---

## Task Block Beispiel

- GitHub Issue: https://github.com/org/repo/issues/17
- Branch: feature/t-17-github-projects
- Status: todo
- Priority: high
- Notes: GitHub Projects Expert Skill entwickeln