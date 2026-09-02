# LS Connect v0.9.1.2 – Recovery & Stabilization Candidate

## Ziel

Dieser Candidate repariert Regressionen, die durch die v0.8.x/v0.9.x-Generalüberholung in die Live-Ladekette gelangt sind, ohne den aktuellen Stable-Stand direkt zu verändern.

## Bekannte Ursachen

- `v07112-r3.js` installiert einen selbsttriggernden MutationObserver und darf nicht mehr ausgeführt werden.
- `v07112-r4.js` überschreibt bei DOM-Änderungen weiterhin die sichtbare Runtime-Version mit `0.7.11.2` und wird im Recovery-Candidate ebenfalls blockiert.
- `v0801-navigation.js` kann Sidebar-Aktionen klassifizieren und ausblenden. Im Recovery-Candidate wird der Filter deaktiviert, damit alle ursprünglichen Sidebar-Aktionen erreichbar bleiben.
- `v0911-live-layout.js` kaschiert die Navigation mit `display:none!important`. Dieser Hotfix wird im Recovery-Candidate nicht geladen.

## Candidate-Verhalten

`v0912.js` setzt die Recovery-Guards vor dem Laden der bestehenden v0.9.1-Kette. Danach bereinigt `v0912-stabilize.js` bekannte Regression-Artefakte und hält die Runtime-Version konsistent auf `0.9.1.2`. `v0912-qa.js` prüft Asset-Integrität, die benötigte Modul-Kette, Runtime-Fehler, Kern-DOM, Sidebar-Erreichbarkeit, Versionsdrift und das erneute Auftreten der bekannten Regression-Artefakte.

## Sicherheitsgrenze

Dieser Candidate ändert keine Supabase-Tabellen, keine Auth-Struktur, keine RPCs/RLS-Regeln, keine PCAD-/Banking-Strukturen und keinen LMH-Handoff. Stable wird erst nach bestandener Candidate-QA angepasst.
