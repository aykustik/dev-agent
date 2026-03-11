# Architecture Overview

> ⚠️ **PLATZHALTER / TEMPLATE** - Dieses Dokument enthält Beispiele und Vorlagen.
> Anpassen für Ihr spezifisches Projekt basierend auf Ihren Anforderungen.

---

## System-Architektur

### Ordner-Struktur

```
.agent/                           # KI-Agent Konfiguration ( dieses Repo )
├── core/                        # 🔧 Universelle System-Komponenten
│   ├── templates/               # Wiederverwendbare Skill-Templates
│   ├── examples/                # Referenz-Implementierungen
│   ├── scripts/                 # Agent-Core Scripts
│   └── config/                  # System-Konfiguration
│
├── skills/                      # 📦 Verfügbare Skills (78+)
│   ├── skill-checker/           # Skill-Qualitätsprüfung
│   ├── git-expert/              # Git-Operationen
│   └── ...                      # (viele mehr)
│
├── handoff-system/              # 📝 Session-Übergaben
│   ├── README.md               # System-Doku
│   ├── template.md             # Handoff-Template
│   ├── projects/                # Projekt-Handoffs
│   └── sessions/                # Session-Übergaben
│
└── project/                     # 📋 Projekt-spezifisch (ANPASSEN)
    ├── architecture.md         # Dieses Dokument
    ├── repo_rules.md           # Projekt-Regeln
    ├── standards.md            # Coding-Standards
    ├── guides/                 # Anleitungen
    ├── patterns/               # Code-Muster
    └── templates/               # Projekt-Vorlagen
```

---

## Core vs Project

### `/core/` - Universelle Standards

Enthält universell wiederverwendbare Komponenten:

| Verzeichnis | Inhalt | Veränderbar? |
|------------|--------|--------------|
| `core/templates/` | Skill-Templates | ❌ Nein |
| `core/examples/` | Referenz-Implementierungen | ❌ Nein |
| `core/scripts/` | Agent-Core Scripts | ⚠️ Mit Vorsicht |
| `core/config/` | System-Konfiguration | ⚠️ Mit Vorsicht |

### `/project/` - Projekt-spezifisch

Enthält projekt-spezifische Anpassungen:

| Verzeichnis | Inhalt | Veränderbar? |
|------------|--------|--------------|
| `project/repo_rules.md` | Branch/Commit-Regeln | ✅ Ja |
| `project/standards.md` | Coding-Standards | ✅ Ja |
| `project/guides/` | Projekt-Anleitungen | ✅ Ja |
| `project/patterns/` | Code-Muster | ✅ Ja |
| `project/templates/` | Vorlagen | ✅ Ja |

---

## Beziehung: /core/ ↔ /project/

```
┌─────────────────────────────────────────────────────────────┐
│                        /core/                              │
│  Universelle Standards, Templates, Tools                  │
│  → Für ALLE Projekte gültig                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    optional überschreiben
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      /project/                            │
│  Projekt-spezifische Anpassungen                         │
│  → Überschreibt /core/ nur wenn nötig                  │
└─────────────────────────────────────────────────────────────┘
```

### Regelwerk

1. **/core/ hat Vorrang** für universelle Standards
2. **/project/ ergänzt** /core/ mit Projekt-spezifischen Regeln
3. **/project/ überschreibt** /core/ nur explizit (mit Begründung)
4. **/project/ ist optional** - wenn leer, wird /core/ verwendet

### Konflikt-Regel

> **Wichtig:** Bei Konflikten zwischen /core/ und /project/ gilt:
> - **/project/ gewinnt** (weil projekt-spezifisch)
> - **Aber:** Dokumentiere warum die Abweichung nötig ist
> - **Im Zweifelsfall:** /core/ beibehalten

---

## Daten-Flow

```
User Input
    ↓
KI-Agent (mit Skills)
    ↓
Task Analysis (.agent/tasks.md)
    ↓
Skill Selection (basierend auf Task-Typ)
    ↓
Execution (.agent/skills/<skill>/)
    ↓
Handoff Creation (.agent/handoffs/) ← Wenn Session endet
    ↓
Repository Commit
```

---

## Komponenten

### Skills System

Skills sind eigenständige Module die spezifische Fähigkeiten bereitstellen:

- **Skill-Checker** - Validiert neue Skills
- **Git-Expert** - Git-Operationen
- **Testing-QA** - Qualitätssicherung
- **+ 75 weitere** - Siehe `.agent/skills/`

### Task Management

Tasks werden in `.agent/tasks.md` verwaltet:

```
<!-- TASKS-START -->
- GitHub Issue: https://...
- Branch: feature/...
- Status: todo | in-progress | done
- Priority: low | medium | high
- Notes: ...
<!-- TASKS-END -->
```

### Handoff System

Bei Session-Ende wird ein Handoff erstellt:

- Speichert Fortschritt
- Dokumentiert offene TODOs
- Primed nächste Session

---

## Integration Points

| Service | Integration |
|---------|-------------|
| GitHub | `gh` CLI, API |
| OpenCode | Skill-System |
| Skills | `.agent/skills/` |

---

## Checkliste für dieses Projekt

- [ ] `/project/repo_rules.md` anpassen
- [ ] `/project/standards.md` anpassen
- [ ] `/project/guides/getting-started.md` anpassen
- [ ] Projekt-spezifische Patterns hinzufügen
- [ ] Architecture-Entscheidungen dokumentieren

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
