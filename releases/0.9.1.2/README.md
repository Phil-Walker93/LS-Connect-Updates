# LS Connect v0.9.1.2 – Recovery & Stabilization Candidate

## Ziel

Dieser Candidate repariert Regressionen aus der v0.8.x/v0.9.x-Generalüberholung, ohne den aktuellen Stable-Stand direkt umzuschalten. Für die Recovery-Version gilt bewusst: **Funktion vor Redesign-Politur**.

## Neutralisierte Regression-Schichten

- `v07112-r3.js`: selbsttriggernder MutationObserver.
- `v07112-r4.js`: wiederholte Versionsüberschreibung auf `0.7.11.2`.
- `v0801-navigation.js`: Sidebar-Klassifizierung und Ausblenden von Aktionen.
- `v0802-workspace.js`: Verstecken echter Header-Aktionen und Ersatz durch Proxy-Menüs.
- `v0804-settings-admin.js`: DOM-Filter, die komplette Settings-/Admin-Blöcke ausblenden können.
- `v0805-mobile.js`: sehr aggressives `100dvh`-/Overflow-/Fixed-Composer-Layout auf Mobilgeräten.
- `v0806-performance-a11y.js`: `contain`/`content-visibility` auf interaktiven Karten sowie Stoppen des v0.8.0-Struktur-Observers.
- `v0911-live-layout.js`: Hide-Hotfix mit `display:none!important` für die Redesign-Navigation.

Die v0.8.0 Theme-/Grundstruktur sowie die v0.8.3 Community-/Profil-Schicht bleiben im Candidate aktiv.

## Candidate-Verhalten

`v0912.js` setzt die Recovery-Guards **vor** dem Laden der bestehenden v0.9.1-Kette. `v0912-stabilize.js` entfernt bekannte Regression-Artefakte und stellt versteckte Sidebar-, Header- und Settings-Elemente wieder her. `v0912-qa.js` prüft Asset-Integrität, essentielle Modulmarker, Runtime-Fehler, Kern-DOM, Versionsdrift und das erneute Auftreten der blockierten Schichten.

## Sicherheitsgrenze

Keine Supabase-Schema-, Auth-, RPC- oder RLS-Änderungen. Keine PCAD-/Banking-Strukturänderungen. Kein LMH-Handoff-Umbau. Stable bleibt bis zur bestandenen Funktionsmatrix unverändert.
