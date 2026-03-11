# KI-Dev-Agent

## Beschreibung

KI-Dev-Agent ist ein Framework für KI-gestützte Entwicklungsassistenten, die eigenständig Software-Engineering-Aufgaben durch standardisierte Workflows, Task-Management und Git-Operationen erledigen können.

## Aufgaben (Tasks)

Diese Liste wird automatisch vom KI-Dev-Agenten aktualisiert.
Tasks spiegeln die Inhalte aus `.agent/tasks.md` wider.

### High Priority
- [ ] #17 GitHub Projects Expert Skill (Branch: ai-task-17, Status: todo)
- [ ] #16 Documentation / Markdown Automation (Branch: ai-task-16, Status: todo)
- [ ] #3 Skill-Creator entwickeln (Branch: ai-task-3, Status: todo)
- [ ] #2 Skill-Finder entwickeln (Branch: ai-task-2, Status: todo)
- [ ] #1 OpenCode Skill Basis entwickeln (Branch: ai-task-1, Status: todo)

### Medium Priority
- [ ] #15 Advanced Node.js Expertise (Branch: ai-task-15, Status: todo)
- [ ] #14 DevOps / Deployment (Branch: ai-task-14, Status: todo)
- [ ] #13 Security / Secure Coding (Branch: ai-task-13, Status: todo)
- [ ] #12 API Design & Integration (Branch: ai-task-12, Status: todo)
- [ ] #10 Testing & QA (Branch: ai-task-10, Status: todo)
- [ ] #9 Git Expert Skill (Branch: ai-task-9, Status: todo)
- [ ] #4 Skill-Checker entwickeln (Branch: ai-task-4, Status: todo)

### Low Priority
- [ ] #11 Database Expertise (Branch: ai-task-11, Status: todo)
- [ ] #8 SSH Expertise (Branch: ai-task-8, Status: todo)
- [ ] #7 UX & UI Design (Branch: ai-task-7, Status: todo)
- [ ] #6 HTML / CSS Expertise (Branch: ai-task-6, Status: todo)
- [ ] #5 JavaScript / TypeScript Expertise (Branch: ai-task-5, Status: todo)

> Hinweis: Neue Tasks werden automatisch hinzugefügt, bestehende Tasks aktualisiert, erledigte Tasks verschoben.

## Notes / Ideen

Temporäre Ideen, Fragen oder Diskussionen, die noch keine Tasks sind.

- Idee: API Refactoring prüfen (Status: pending review)
- Idee: CI/CD Pipeline einrichten (Status: pending)
- Idee: Mehr Beispiele für Skills (Status: pending)

## Branches / Worktrees

Diese Übersicht wird vom Agenten gepflegt.

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

- Dependencies installieren:
  ```bash
  npm install
  ```

- KI-Dev-Agent starten:
  ```bash
  npm run agent
  ```

- Tasks aktualisieren:
  Der Agent liest GitHub Issues und aktualisiert tasks.md automatisch.

---

**Version:** 0.1.0 | **Letzte Aktualisierung:** 11.03.2026