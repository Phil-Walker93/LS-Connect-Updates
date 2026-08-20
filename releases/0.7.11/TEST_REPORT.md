# LS Connect v0.7.11 – Repair Candidate Test Report

Status: **Candidate / nicht für Stable freigegeben**

## Sicherheits- und Regressionstests

- `v0711.js`: Node-Syntaxprüfung bestanden.
- `v0711-init.js`: Node-Syntaxprüfung bestanden.
- `v0775.js`: Node-Syntaxprüfung bestanden.
- `sw.js`: Node-Syntaxprüfung bestanden.
- Designmodul enthält **keine** `location.reload`-, Service-Worker-, Runtime-Versions- oder Updater-Manipulation.
- Designmodul enthält **keine** `setInterval`- oder `setTimeout`-Schleifen.
- Doppelte Initialisierung: Style und delegierter Design-Handler werden nur einmal registriert.
- 1.000 direkte Theme-Wechsel im VM-Test ohne Rekursion, Hänger oder Timer-Abhängigkeit.
- Ein bereits serverseitig gespeichertes `lsclassic` wird über `v0711-init.js` genau einmal erneut eingelesen; der Refresh selbst nutzt keine Timer.
- Ein nativer Chromium-E2E-Lauf wurde **nicht** als bestanden gewertet, weil der Chromium-Prozess der Testumgebung bereits bei einer leeren Minimal-Seite wegen DBus/Zygote-Problemen nicht terminierte. Das ist von der Patchlogik unabhängig. Vor Stable bleibt deshalb ein echter Preview-/Geräte-Smoke-Test Pflicht.

## Design-Matrix

Alle sieben Presets werden registriert und im Design-Modal genau einmal angeboten:

1. LS Classic (`lsclassic`)
2. Discord Classic (`classic`)
3. Blurple Night (`violet`)
4. Night Slate (`midnight`)
5. Graphite (`graphite`)
6. Deep Forest (`emerald`)
7. Rose Night (`sunset`)

CSS wurde mit `tinycss2` geparst: **49 Regeln, 0 Parserfehler**. Großflächige `backdrop-filter`-/Blur-Effekte wurden entfernt.

### Kontrastprüfung

| Design | Haupttext / Layer 2 | Sekundärtext / Layer 2 | Text / Akzent |
|---|---:|---:|---:|
| LS Classic | 16.96 | 6.92 | 8.38 |
| Discord Classic | 12.42 | 7.07 | 4.61 |
| Blurple Night | 14.68 | 7.63 | 4.61 |
| Night Slate | 15.03 | 7.00 | 5.76 |
| Graphite | 15.52 | 6.79 | 7.37 |
| Deep Forest | 14.98 | 7.63 | 8.38 |
| Rose Night | 15.11 | 7.85 | 7.80 |

Alle geprüften Text-/Hintergrundkombinationen liegen mindestens bei WCAG-AA-Niveau für normalen Text; die Haupttexte liegen durchgehend deutlich höher.

## Interaktionstests

- Design-Modal öffnet über eine einzelne Capture-Delegation, ohne bestehende globale Theme-Funktionen umzuschreiben.
- Jeder der sieben Design-Buttons aktiviert exakt das erwartete Preset.
- Online-Modus: jeder Designwechsel erzeugt exakt einen Aufruf von `set_design_preset_v071012`.
- Simulierter RPC-Fehler: lokales Design bleibt aktiv und die UI wirft keinen unbehandelten Fehler.
- Backend-Constraint akzeptiert exakt: `lsclassic`, `classic`, `midnight`, `emerald`, `violet`, `graphite`, `sunset`.
- `my_design_preset_v071012` und `set_design_preset_v071012(p_preset text)` sind weiterhin vorhanden.
- Startreihenfolge geprüft: v0.7.10.12 kann die Serverpräferenz bereits nach 50 ms laden; `v0711-init.js` setzt den Lade-Guard einmal zurück und liest die nun vollständige 7-Preset-Registry erneut ein.

## Loader- und Service-Worker-Tests

- Loader lädt **22 Module** strikt nacheinander.
- `v0711.js` und danach `v0711-init.js` werden als letzte Module geladen.
- Alle Modul-URLs verwenden `v=0.7.11-r1` als Cache-Buster.
- Keine doppelten Modulpfade.
- Service Worker registriert nur: `install`, `activate`, `fetch`, `message`, `notificationclick`.
- Service-Worker-Shell enthält `v0711.js` und `v0711-init.js` jeweils genau einmal.
- Kein automatischer Reload und keine Timer-Schleife im Service Worker.

## Release-Schutz

- Reparatur liegt ausschließlich auf `v0.7.11-repair-candidate-final`.
- Draft-PR #1 bleibt offen und ungemerged.
- `main/latest.json` bleibt auf **v0.7.10.13 stable**.
- Vor einem erneuten globalen Rollout ist ein echter Browser-/Geräte-Smoke-Test auf einer Preview-/Testinstanz erforderlich.
