# Handoff Document System

## Was ist ein Handoff?

Ein Handoff-Dokument ist eine strukturierte Markdown-Datei, die den aktuellen Stand einer ArbeitsSession zusammenfasst. Es dient dazu, Context Rot zu vermeiden – das schrittweise Vergessen von Entscheidungen, Annahmen und technischen Details durch wiederholtes Komprimieren des Kontextes in langen KI-Agenten-Sessions.

## Warum Handoffs?

- **Transparenz**: Entscheidungen werden mit Begründung festgehalten
- **Fortsetzbarkeit**: Neue Sessions können nahtlos ansetzen
- **Vermeidung von Wiederarbeit**: Offene Fragen und TODOs werden sichtbar
- **Qualitätssicherung**: Technische Schulden und Risiken werden dokumentiert

## Wann muss ein Handoff erstellt werden?

### Pflicht (Muss)
- Session dauert länger als 30 Minuten
- Mehr als 5 Dateien wurden geändert/erstellt
- Es gibt offene TODOs oder ungelöste Probleme am Session-Ende
- Vor einem Branch-Wechsel oder bevor man an einem anderen Task weiterarbeitet

### Empfohlen (Soll)
- Nach Abschluss eines signifikanten Arbeitspakets
- Bei komplexen Entscheidungen mit mehreren Alternativen
- Wenn die Session architektonische Änderungen beinhaltet

### Optional (Kann)
- Sehr kurze Sessions (<15 Min) mit klar abgeschlossener Aufgabe
- Beim Reproduzieren von Bugs, wenn der Fix trivial ist

## Detailtiefe

### Mach
- **Fakten klar trennen von Vermutungen**: 
  - ✅ Fakt: "Datei X enthält Funktion Y die Z zurückgibt"
  - ❌ Vermutung: "Funktion Y funktioniert vermutlich korrekt"
- **Konkrete Verweise verwenden**:
  - ✅ "Siehe Datei `src/utils.js` Zeile 42"
  - ❌ "Die Utility-Funktion wurde geändert"
- **Entscheidungslog pflegen**: Warum wurde X gewählt und nicht Y?
- **Offene Punkte markieren**: Mit Klarem Status und Priorität

### Vermeiden
- Generische Aussagen wie "Fortschritt gemacht" oder "Einige Dateien aktualisiert"
- Vermutungen als Fakten darstellen
- Lange Fließtexte ohne Struktur

## Benennungskonvention

**Format**: `YYYY-MM-DD_handoff_<projekt>_<kurzbeschreibung>.md`

**Beispiele**:
- `2026-03-11_handoff_skill-finder_initial-setup.md`
- `2026-03-11_handoff_skill-creator_template-design.md`
- `2026-03-10_handoff_readme-update_v0.1.0.md`

**Begründung**:
- Chronologische Sortierung durch Datum am Anfang
- Projektname ermöglicht Themenbezogenes Gruppieren
- Kurzbeschreibung macht den Inhalt beim Schnellüberfliegen ersichtlich
- Keine Sonderzeichen, Leerzeichen oder Umlaute für Git-Kompatibilität

## Wo ablegen?

Gemäß der Struktur in `.agent/handoffs/`:

- **Task-spezifische Handoffs**: `.agent/handoffs/projects/<projekt>/`
  - Beispiel: `.agent/handoffs/projects/skill-finder/2026-03-11_handoff_skill-finder_initial-setup.md`
  
- **Session-übergreifende Handoffs**: `.agent/handoffs/sessions/`
  - Beispiel: `.agent/handoffs/sessions/2026-03-11_kickoff.md`

- **Schneller Zugriff**: Jedes Projekt-Ordner enthält eine `LATEST.md` (Symbolischer Link oder Kopie des neuesten Handoffs)

## Wie findet man das neueste Handoff?

1. **Direkter Link**: Jedes Projekt-Ordner enthält eine `LATEST.md` Datei, die auf das neueste Handoff zeigt
2. **Datumssortierung**: Dateien sind nach `YYYY-MM-DD` benannt → einfache sortierte Auflistung
3. **Git-History**: Alle Handoffs sind versioniert → `git log -- .agent/handoffs/projects/<projekt>/`

## Umgang mit veralteten Handoffs

### Nicht löschen!
Alte Handoffs bleiben im Repository als historischer Nachweis erhalten.

### Beim neuen Handoff referenzieren:
Im Abschnitt "Erledigte Arbeiten" oder "Validierung" kann man schreiben:
- "Siehe auch: `2026-03-10_handoff_skill-finder_base-structure.md` für die initialen Entscheidungen"

### Archivierung (optional):
Für sehr alte Projekte kann ein `archive/` Unterordner geschaffen werden, aber die Standardbehaltung im Hauptordner bevorzugen für leichte Auffindbarkeit.

## Best Practices für KI-Agenten

### Entscheidungslog
```markdown
### Getroffen
- **Entscheidung:** Verwende conventional commits statt frei formatierter Messages
- **Begründung:** Einheitlichkeit erleichtert Changelog-Generierung und automatisierte Releases
- **Alternative verworfen:** Freiformat mit Emojis
  - **Warum nicht:** Schwieriger zu parsen, weniger professionell in öffentlichen Repos
```

### Technische Details
- **Dateiänderungen immer mit Pfad angeben**: `src/components/Button.js` statt "Die Button-Komponente"
- **Zeilennummern bei relevanter Kritik**: Wenn ein Bug an einer bestimmten Stelle ist
- **Commit-Referenzen**: Wenn möglich, den Commit-Hash oder -kurzhash angeben

### TODOs
- **Ausführlich formulieren**: Nicht "Fix Bug" sondern "Fix NullPointerException in UserService.getUserById() bei ungültiger ID"
- **Priorität klar markieren**: Hoch/Mittel/Niedrig mit Begründung
- **Ausführbarkeit prüfen**: Kann ein neuer Entwickler dieses TODO ohne Kontextverständnis umsetzen?

## Integration mit bestehendem System

### Verbindung zu Tasks.md
- Handoffs ergänzen das Task-Management
- Im Handoff wird die Task-Referenz (#<Issue>) angegeben
- Erledigte TODOs aus dem Handoff können in tasks.md abgehakt werden

### Verbindung zu AGENT.md
- Vor Session-Ende muss geprüft werden, ob ein Handoff erforderlich ist
- Siehe Abschnitt "Handoff-Pflichten" in AGENT.md

### Verbindung zu Skills
- Beim Entwickeln eines neuen Skills sollte ein Handoff erstellt werden
- Skill-spezifische Handoffs landen in `.agent/handoffs/projects/<skill-name>/`

## Beispielhafter Workflow

1. **Session Start**
   - Prüfe `.agent/handoffs/projects/<projekt>/LATEST.md` für Kontext
   - Starte Arbeit an Task #X

2. **Während der Session**
   - Bei bedeutenden Entscheidungen: Notiere sie mental für das spätere Handoff
   - Bei Blockierern: Erstelle ein TODO im Handoff-Entwurf

3. **Session Ende (letzte 5-10 Minuten)**
   - Erstelle Handoff-Dokument basierend auf dem Template
   - Fülle alle Abschnitte aus
   - Committe das Handoff-Dokument
   - Optional: Erstelle Pull Request für Review

4. **Nächste Session Start**
   - Öffne das LATEST.md des Projekts
   - Folge dem "Copy-Paste Startblock" Abschnitt
   - Beginne mit den empfohlenen ersten Schritten

---

*Letzte Aktualisierung: $(date +%Y-%m-%d)*