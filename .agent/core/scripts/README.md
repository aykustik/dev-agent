# Core Scripts

> Diese Scripts sind Teil des KI-Dev-Agent Frameworks und können für Projekte angepasst werden.

---

## Scripts

| Script | Beschreibung |
|--------|--------------|
| `skill-loader.js` | Lädt und verwaltet Skills aus `.agent/skills/` |
| `task-runner.js` | Führt Tasks aus `.agent/tasks.md` aus |
| `handoff-gen.js` | Generiert Handoff-Dokumente für Session-Übergaben |
| `init-agent.js` | Initialisiert Agent für neue Projekte |

---

## Verwendung

### skill-loader.js
```bash
node .agent/core/scripts/skill-loader.js list               # Alle Skills auflisten
node .agent/core/scripts/skill-loader.js find <query>        # Skills suchen
node .agent/core/scripts/skill-loader.js show <name>         # Skill-Details anzeigen
```

### task-runner.js
```bash
node .agent/core/scripts/task-runner.js list [all|open|done]  # Tasks auflisten
node .agent/core/scripts/task-runner.js next                 # Nächsten Task zeigen
node .agent/core/scripts/task-runner.js start <branch>       # Task starten
node .agent/core/scripts/task-runner.js done <branch>        # Task als erledigt markieren
node .agent/core/scripts/task-runner.js switch <branch>      # Zu Branch wechseln
```

### handoff-gen.js
```bash
node .agent/core/scripts/handoff-gen.js generate <title> <branch> <issue>  # Neues Handoff erstellen
node .agent/core/scripts/handoff-gen.js latest                # Letztes Handoff anzeigen
node .agent/core/scripts/handoff-gen.js list                  # Alle Handoffs auflisten
node .agent/core/scripts/handoff-gen.js extract-todos         # TODOs aus latest extrahieren
```

### init-agent.js
```bash
node .agent/core/scripts/init-agent.js init <project-name>    # Neues Projekt initialisieren
node .agent/core/scripts/init-agent.js validate                # Struktur validieren
```

---

## NPM Scripts (package.json)

Die Scripts können auch über npm ausgeführt werden:

```bash
npm run skills:list       # skill-loader.js list
npm run skills:find       # skill-loader.js find
npm run tasks:list        # task-runner.js list
npm run tasks:next        # task-runner.js next
npm run handoff:generate  # handoff-gen.js generate
npm run handoff:latest    # handoff-gen.js latest
npm run agent:init        # init-agent.js init
```

---

## Status

| Script | Status |
|--------|--------|
| skill-loader.js | ✅ Implementiert |
| task-runner.js | ✅ Implementiert |
| handoff-gen.js | ✅ Implementiert |
| init-agent.js | ✅ Implementiert |
| skill-sync.js | ✅ Implementiert (in `/lib/`) |
| Integration mit GitHub Actions | ⏳ Offen |

---

*Anpassen für projektspezifische Anforderungen bei Bedarf.*
