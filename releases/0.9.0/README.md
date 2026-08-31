# LS Connect v0.9.0 – Redesign Release Candidate

Status: **Release Candidate · nicht produktiv aktiviert**

## Ziel

Die vollständige Redesign-Kette v0.8.0 bis v0.8.6 wird als kontrollierter Release Candidate gebündelt und technisch auf Vollständigkeit geprüft, ohne den produktiven Stable-Loader umzuschalten.

## Enthalten

- v0.8.0 Hub UI Foundation
- v0.8.1 Navigation Cleanup
- v0.8.2 Messenger Workspace
- v0.8.3 Community & Profile
- v0.8.4 Einstellungen & Admin Cleanup
- v0.8.5 Mobile Polish
- v0.8.6 Performance & Accessibility

## RC-Prüfung

`v090-rc.js` verifiziert nach dem Start:

- dass alle Redesign-Module tatsächlich geladen wurden
- dass zentrale Browser-APIs für die UI-Schicht verfügbar sind
- dass der RC ausschließlich Frontend-/UI-Schichten bündelt
- dass kein produktiver Stable-Loader-Schalter vorgenommen wurde

Das Ergebnis wird unter `window.__LS_CONNECT_RC_REPORT__` veröffentlicht und als `ready` oder `incomplete` markiert.

## Sicherheitsgrenze

v0.9.0 verändert nicht:

- Supabase-Tabellen, RPCs oder RLS-Regeln
- Authentifizierung oder Session-Logik
- Rollen-/Berechtigungslogik
- LMH-ModuleAdapter oder Session-Handoff
- PCAD-Migrationslogik
- Banking-Backend oder Ledger
- produktiven Stable-Kanal
- produktiven Vercel-Hauptloader

## Freigabekriterium für den nächsten Schritt

Eine spätere Live-Umschaltung darf erst erfolgen, wenn der RC im echten LS-Connect-Lauf gegen Login, Chats, Calls, Community, Profile, Einstellungen, Admin und Mobile-Nutzung geprüft wurde und keine regressiven UI- oder Funktionsfehler sichtbar sind.
