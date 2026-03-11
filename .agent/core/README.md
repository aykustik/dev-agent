# Core System

> **WICHTIG:** Siehe auch `/project/` für projekt-spezifische Anpassungen.

Das `core/` Verzeichnis enthält universell wiederverwendbare Komponenten für das KI-Dev-Agent System.

---

## Verzeichnis-Struktur

```
core/
├── templates/              # Skill-Templates
│   └── skill-template.md
├── examples/              # Referenz-Implementierungen
│   └── git-expert-skill.md
├── scripts/              # Agent-Core Scripts (Platzhalter)
│   └── README.md
└── config/               # System-Konfiguration
    ├── defaults.json
    └── prompts/          # Default Prompts (Platzhalter)
        └── README.md
```

---

## /core/ vs /project/ Beziehung

```
/core/                                    /project/
┌──────────────────────────────┐           ┌──────────────────────────────┐
│ Universelle Standards        │           │ Projekt-spezifisch          │
│ - Templates                │ ← Ergänzt │ - repo_rules.md            │
│ - Beispiele               │           │ - standards.md              │
│ - Default-Konfiguration   │           │ - guides/                   │
│ - Skill-Templates         │           │ - patterns/                 │
└──────────────────────────────┘           └──────────────────────────────┘
         ↓                                          ↓
   Nicht verändern                            ANPASSEN
```

### Regel: /project/ überschreibt /core/

Wenn `/project/` Dateien enthält, haben diese Vorrang vor `/core/`.

**Beispiel:**
- `/core/config/defaults.json` hat Standard-Werte
- `/project/config/overrides.json` kann diese überschreiben

---

## Komponenten

### templates/
Wiederverwendbare Skill-Vorlagen.

**Verwendung:** 
```bash
cp .agent/core/templates/skill-template.md .agent/skills/neuer-skill/
```

### examples/
Referenz-Implementierungen als Beispiele.

**Enthalten:**
- git-expert-skill.md - Vollständiges Skill-Beispiel

### scripts/
Platzhalter für Agent-Core Scripts.

**Geplant:**
- skill-loader.js
- task-runner.js
- handoff-gen.js

### config/
System-Konfiguration und Default-Prompts.

**Enthalten:**
- defaults.json - Standard-Konfiguration
- prompts/ - Default Prompts (Platzhalter)

---

## Für /project/ Überschreibungen

Um /core/ Einstellungen in Ihrem Projekt zu überschreiben:

1. Erstelle `/project/config/overrides.json`
2. Definiere überschriebene Werte
3. Diese haben Vorrang vor `/core/config/defaults.json`

---

## Mehr Informationen

- [architecture.md](../project/architecture.md) - Vollständige Architektur
- [repo_rules.md](../project/repo_rules.md) - Projekt-Regeln
- [standards.md](../project/standards.md) - Coding-Standards
- [guides/](../project/guides/) - Anleitungen

---

*Das /core/ Verzeichnis sollte nicht direkt geändert werden. Alle Anpassungen gehören in /project/.*
