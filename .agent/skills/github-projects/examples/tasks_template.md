# GitHub Projects Task Vorlage (deutsche Felder)

## Zweck
Diese Vorlage dient als **Master-Template** für die Erstellung von Tasks in GitHub Projects über den "GitHub Projects Skill".  
Platzhalter werden automatisch durch Skripte ersetzt.  
Dies gewährleistet eine **konsistente Struktur**, auch wenn mehrere Tasks automatisch erstellt werden.

---

## Platzhalter Erklärung
| Platzhalter        | Beschreibung | Standardwerte / Beispiele |
|-------------------|-------------|--------------------------|
| `{{TITLE}}`        | Titel des Tasks, kurz und aussagekräftig | `Implement Login Feature` |
| `{{DESCRIPTION}}`  | Detaillierte Beschreibung, z. B. Ziele, Anforderungen | `CI/CD Pipeline konfigurieren` |
| `{{PRIORITY}}`     | Priorität des Tasks | Hoch, Mittel, Niedrig |
| `{{CATEGORY}}`     | Kategorie des Tasks | Skill-Erweiterung, Neues Feature, Feature-Erweiterung, Backend, Frontend, DevOps, QA |
| `{{STATUS}}`       | Aktueller Status | Offen, In Bearbeitung, Erledigt |
| `{{NOTES}}`       | Zusätzliche Hinweise, Kommentare oder Links (Markdown unterstützt) | `Initial setup` |

---

## Template-Struktur
```markdown
## Titel
{{TITLE}}

## Beschreibung
{{DESCRIPTION}}

## Priorität
{{PRIORITY}}

## Kategorie
{{CATEGORY}}

## Status
{{STATUS}}

## Notizen
{{NOTES}}
````

---

## Beispiel-Task

## Titel
Setup Continuous Integration

## Beschreibung
Eine CI/CD-Pipeline einrichten, die automatisch Builds ausführt und Unit-Tests prüft.  
- GitHub Actions verwenden  
- Branch-Protection einrichten  
- Testberichte generieren

## Priorität
Hoch

## Kategorie
DevOps

## Status
Offen

## Notizen
- Initial setup für alle Microservices  
- Dokumentation im Repo unter `/docs/ci.md`
```

---

## Hinweise für Entwickler / Skripte

1. **Platzhalter beibehalten:** Skripte wie `create_tasks.ps1` ersetzen nur die Platzhalter. Fehlt ein Feld, kann die Erstellung fehlschlagen.
2. **Markdown in Notizen:** Tasks unterstützen Markdown, z. B. Checklisten, Links, Code-Blöcke.
3. **Mehrere Tasks:** Vorlage kann mehrfach kopiert oder aus JSON/CSV generiert werden.
4. **Standardwerte:** Felder wie Priorität, Kategorie oder Status können aus `config.json` übernommen werden, wenn Platzhalter leer bleiben.

---

## Erweiterungsmöglichkeiten

* **Zuständiger Mitarbeiter:** Feld `{{ASSIGNEE}}` für automatische Zuweisung.
* **Fälligkeitsdatum:** Feld `{{FAELLIGKEITSDATUM}}` für Deadlines.
* **Mehrere Views:** Mit `{{VIEW}}` Task direkt einer View zuweisen.
* **Automatische Generierung:** Tasks aus CSV/JSON-Daten importieren.

---

## Best Practices

* Titel kurz und prägnant (max. 50 Zeichen)
* Beschreibung klar strukturiert, Ziele und Anforderungen getrennt
* Priorität immer setzen: Hoch, Mittel, Niedrig
* Kategorie konsistent halten: erleichtert Filterung und Reporting
* Notizen für interne Hinweise, Referenzen, Links oder Checklisten verwenden

```