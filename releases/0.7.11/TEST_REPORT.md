# LS Connect v0.7.11 – Repair Candidate Test Report

Status: **Candidate / nicht für Stable freigegeben**

## Sicherheits- und Regressionstests

- `v0711.js`: Node-Syntaxprüfung bestanden.
- `v0775.js`: Node-Syntaxprüfung bestanden.
- `sw.js`: Node-Syntaxprüfung bestanden.
- Designmodul enthält **keine** `location.reload`-, Service-Worker-, Runtime-Versions- oder Updater-Manipulation.
- Designmodul enthält **keine** `setInterval`- oder `setTimeout`-Schleifen.
- Doppelte Initialisierung: Style und delegierter Design-Handler werden nur einmal registriert.
- 1.000 direkte Theme-Wechsel im VM-Test ohne Rekursion, Hänger oder Timer-Abhängigkeit.
- 2.000 Theme-Wechsel im Loader-/State-Stresstest vorgesehen; der native Chromium-Prozess der Testumgebung konnte jedoch bereits eine leere Minimal-Seite wegen DBus/Zygote-Problemen nicht beenden. Das ist ein Problem der Testumgebung und wurde **nicht** als Browser-E2E-Pass gewertet.

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

## Loader- und Service-Worker-Tests

- Loader lädt 21 Module strikt nacheinander.
- `v0711.js` wird als letztes Modul geladen.
- Alle Modul-URLs verwenden `v=0.7.11-r1` als Cache-Buster.
- Keine doppelten Modulpfade.
- Service Worker registriert nur: `install`, `activate`, `fetch`, `message`, `notificationclick`.
- Service-Worker-Shell enthält `v0711.js` genau einmal.
- Kein automatischer Reload und keine Timer-Schleife im Service Worker.

## Release-Schutz

- Reparatur liegt ausschließlich auf `v0.7.11-repair-candidate-final`.
- `main/latest.json` bleibt auf **v0.7.10.13 stable**.
- Vor einem erneuten globalen Rollout ist ein echter Browser-/Geräte-Smoke-Test auf einer Preview-/Testinstanz erforderlich.
