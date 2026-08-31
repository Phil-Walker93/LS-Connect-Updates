# LS Connect v0.9.1 – RC QA

Status: **Redesign Release Candidate QA**

## Ziel

v0.9.1 erweitert den Redesign-Release-Candidate um eine technische Freigabeprüfung, ohne Stable oder Backend anzufassen.

## QA-Prüfungen

- Runtime-Fehler werden bereits vor dem RC-Start gesammelt.
- 22 abhängige Script-Assets werden über `/api/script` auf HTTP-Erreichbarkeit, JavaScript-Content-Type, Mindestinhalt und Versionsmarker geprüft.
- Alle Redesign-Module von v0.8.0 bis v0.9.0 werden über ihre Runtime-Marker kontrolliert.
- Kritische Browser-APIs werden geprüft.
- Zentrale DOM-Strukturen wie App-Shell, Sidebar und Conversation-Panel werden geprüft, sobald sie sichtbar sein können.
- Login-/Charakterauswahl-Zustände werden als aufgeschobener UI-Test erkannt und nicht fälschlich als technischer Blocker bewertet.
- Ergebnis: `pass`, `warn` oder `fail`.
- Vollständiger Bericht: `window.__LS_CONNECT_RC_QA_REPORT__`.
- Manueller Re-Run: `window.__LS_CONNECT_RUN_RC_QA__()`.

## Freigabekriterien

Ein technischer RC-PASS erfordert:

1. alle erwarteten Script-Assets erreichbar,
2. vollständige Redesign-Modulkette geladen,
3. keine erfassten Runtime-/Promise-Fehler,
4. kritische Browser-Runtime verfügbar.

UI-Bereiche hinter Login/Charakterauswahl müssen danach zusätzlich funktional durchgeklickt werden, bevor Stable umgeschaltet wird.

## Sicherheitsgrenze

Keine Änderungen an:

- Supabase, RPC oder RLS
- Authentifizierung oder Session-Backend
- Rollen-/Berechtigungslogik
- LMH-Handoff
- PCAD
- Banking
- Stable-Kanal
- produktivem Vercel-Hauptloader
