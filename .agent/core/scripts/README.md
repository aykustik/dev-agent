# Core Scripts

> ⚠️ **PLATZHALTER** - Dieses Verzeichnis enthält Agent-Core Scripts.
> Anpassen für Ihr spezifisches Projekt basierend auf Ihren Anforderungen.

---

## Geplante Scripts

Diese Scripts sollten hier implementiert werden:

### skill-loader.js
Lädt Skills aus `.agent/skills/` Verzeichnis.

```javascript
// Geplante Funktionalität:
- Alle Skills im Verzeichnis scannen
- skill.json parsen
- Skills indexieren
- Tool-Liste bereitstellen
```

### task-runner.js
Führt Tasks aus `.agent/tasks.md` aus.

```javascript
// Geplante Funktionalität:
- Tasks parsen
- Skills basierend auf Task-Typ auswählen
- Task ausführen
- Status aktualisieren
```

### handoff-gen.js
Generiert Handoff-Dokumente.

```javascript
// Geplante Funktionalität:
- Session-Status erfassen
- Template anwenden
- Handoff-Datei erstellen
- Verknüpfungen setzen
```

### init-agent.js
Initialisiert Agent für neues Projekt.

```javascript
// Geplante Funktionalität:
- Projekt-Struktur erstellen
- Standard-Dateien kopieren
- Konfiguration initialisieren
- Git-Repo einrichten (optional)
```

---

## Aktuelle Implementierung

| Script | Status | Verwendet in |
|--------|--------|--------------|
| skill-sync.js | ✅ Fertig | `/lib/skill-sync.js` |
| validate.js | ✅ Fertig | `/skills/skill-checker/` |

---

## Für dieses Projekt anpassen

- [ ] skill-loader.js implementieren
- [ ] task-runner.js implementieren
- [ ] handoff-gen.js implementieren
- [ ] init-agent.js implementieren
- [ ] Integration mit GitHub Actions

---

*Dieses Dokument ist ein Template. Anpassen für Ihr spezifisches Projekt.*
