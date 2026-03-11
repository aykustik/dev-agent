# Getting Started Guide

> ⚠️ **PLATZHALTER / TEMPLATE** - Dieses Dokument enthält Beispiele und Vorlagen.
> Anpassen für Ihr spezifisches Projekt basierend auf Ihren Anforderungen.

---

## Willkommen

> **Anpassen:** Kurze Willkommensnachricht für das Projekt

Dies ist ein Template für neue Projekt-Entwickler. Passen Sie die Inhalte an Ihr spezifisches Projekt an.

---

## Voraussetzungen

> **Anpassen:** Erforderliche Tools und Software

### Benötigte Software

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 18+ | nodejs.org |
| npm | 9+ | (kommt mit Node.js) |
| Git | 2.30+ | git-scm.com |
| Docker | 20+ | docker.com |

### Optionale Tools

- **VS Code** - Empfohlener Editor
- **GitHub CLI** - `gh auth login`
- **Docker Desktop** - Für Container

---

## Installation

> **Anpassen:** Projekt-spezifische Installationsschritte

```bash
# Repository klonen
git clone <REPO_URL>
cd <PROJEKT_NAME>

# Dependencies installieren
npm install

# Environment-Variablen einrichten
cp .env.example .env
# .env Datei anpassen

# Anwendung starten
npm run dev
```

---

## Projekt-Struktur

> **Anpassen:** Projekt-spezifische Struktur erklären

```
projekt-name/
├── src/                 # Hauptquelle
├── tests/               # Tests
├── docs/                # Dokumentation
├── scripts/             # Build-Scripts
├── .agent/              # KI-Agent Konfiguration
│   ├── skills/          # Verfügbare Skills
│   ├── handoffs/       # Session-Übergaben
│   └── project/        # Projekt-spezifische Regeln
└── ...
```

---

## Erste Schritte

### 1. Entwicklungsumgebung einrichten

> **Anpassen:** Entwicklungsumgebung Setup

```bash
# Installieren Sie alle Abhängigkeiten
npm install

# Starten Sie den Entwicklungsserver
npm run dev
```

### 2. Ersten Task bearbeiten

1. Aktuelle Tasks ansehen: `cat .agent/tasks.md`
2. Branch erstellen: `git checkout -b feature/1-mein-task`
3. Änderungen machen
4. Commit: `git commit -m "feat: describe change"`
5. Push: `git push -u origin feature/1-mein-task`

### 3. KI-Agent nutzen

> **Anpassen:** Wie der KI-Agent in diesem Projekt genutzt wird

```bash
# KI-Agent starten
npm run agent

# Oder spezifischen Skill nutzen
node .agent/skills/<skill-name>/scripts/<script>.js <command>
```

---

## Verfügbare Scripts

> **Anpassen:** Verfügbare npm scripts

| Script | Beschreibung |
|--------|--------------|
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | Projekt bauen |
| `npm run test` | Tests ausführen |
| `npm run lint` | Code-Qualität prüfen |
| `npm run agent` | KI-Agent starten |

---

## Nächste Schritte

> **Anpassen:** Was neue Entwickler als nächstes tun sollten

1. ✅ Projekt-Setup abschließen (diese Seite)
2. ✅ Coding-Standards lesen (`.agent/project/standards.md`)
3. ✅ Repo-Regeln lesen (`.agent/project/repo_rules.md`)
4. ✅ Ersten Task auswählen (`.agent/tasks.md`)
5. ✅ Mit der Entwicklung beginnen

---

## Hilfe

### Wo finde ich was?

| Dokument | Beschreibung |
|----------|---------------|
| `.agent/tasks.md` | Zu bearbeitende Tasks |
| `.agent/project/repo_rules.md` | Repository-Regeln |
| `.agent/project/standards.md` | Coding-Standards |
| `.agent/handoffs/README.md` | Handoff-System |

### Wer hilft bei Fragen?

> **Anpassen:** Kontaktpersonen/Resources

- Issue erstellen: GitHub Issues
- Dokumentation: Projekt-Wiki
- Notfälle: [Kontakt]

---

## Checkliste für neue Entwickler

- [ ] Repository geklont
- [ ] Dependencies installiert
- [ ] .env eingerichtet
- [ ] Entwicklungsumgebung getestet
- [ ] Ersten Task zugewiesen
- [ ] Projekt-Regeln gelesen

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
