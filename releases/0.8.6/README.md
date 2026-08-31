# LS Connect v0.8.6 – Performance & Accessibility

Status: **Redesign Preview**

## Ziel

Die Redesign-Linie wird technisch beruhigt und besser bedienbar, bevor sie als Release Candidate vorbereitet wird.

## Neu

- der seit v0.8.1 weitgehend redundante v0.8.0-Struktur-Observer wird nach dem vollständigen Redesign-Start deaktiviert
- Accessibility-Prüfungen verarbeiten neue DOM-Teilbäume inkrementell statt jedes Mal das gesamte Dokument zu scannen
- CSS-Containment und `content-visibility` reduzieren Rendering-Arbeit bei längeren Settings-, Profil-, Feed- und Admin-Ansichten
- deutlich sichtbarer `:focus-visible`-Zustand
- Tastaturnavigation mit Pfeiltasten sowie Home/End in Bereichs-, Admin- und Mobile-Navigation
- bessere ARIA-Zustände für aktive Tabs und mobile Navigation
- Nachrichtenbereich als zugängliches Live-Log
- Modals erhalten Dialog-Semantik und Beschriftung
- fehlende zugängliche Namen werden bei Icon-Buttons und unbeschrifteten Formularfeldern defensiv ergänzt
- Escape schließt das Redesign-Overflow-Menü und gibt den Fokus an den Auslöser zurück
- `prefers-reduced-motion` und Forced-Colors werden berücksichtigt

## Sicherheits- und Parallelentwicklungsgrenze

v0.8.6 verändert ausdrücklich **nicht**:

- Nachrichten-, Community-, Profil- oder Admin-Daten
- Supabase-Tabellen, RPCs oder RLS-Regeln
- Authentifizierung oder Session-Logik
- Rollen- oder Berechtigungslogik
- LMH-ModuleAdapter oder Session-Handoff
- PCAD-Migrationslogik
- Banking-Backend oder Ledger
- produktiven Stable-Kanal
- produktiven Vercel-Hauptloader

## Nächster Schritt

**v0.9.0 – Redesign Release Candidate**

Dort wird die komplette v0.8.x-Redesign-Kette als ein kontrollierbarer RC gebündelt und vor einer möglichen Live-Umschaltung technisch geprüft.
