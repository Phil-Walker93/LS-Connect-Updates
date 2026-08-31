# LS Connect v0.8.3 – Community & Profile

Status: **Redesign Preview**

## Ziel

Community-, Story-, Kanal-, Organisations- und Profilbereiche werden auf dieselbe klare visuelle Hierarchie wie Navigation und Messenger-Workspace gebracht, ohne Datenmodelle oder Backend-Verträge zu verändern.

## Neu

- ruhigere und klarer gegliederte Profilkarten
- kompaktere Profilaktionen
- modernere Profilbilddarstellung
- optionale clientseitige Profil-Sektionslabels für Über, Zugehörigkeit, Kontakt und Aktivität
- Profil-Sektionslabels ändern weder Reihenfolge noch Inhalte und aktualisieren sich nur bei tatsächlicher Strukturänderung
- modernisierte Kanal-/Community-Karten
- besser strukturierte Feed- und Post-Flächen
- reduzierte visuelle Dominanz von Post-Aktionen
- horizontale, touchfreundliche Story-Leiste
- eigenständige visuelle Behandlung von Organisations-/Fraktionskarten
- responsive Anpassungen für Tablet und Smartphone

## Sicherheits- und Parallelentwicklungsgrenze

v0.8.3 verändert ausdrücklich **nicht**:

- Community-, Story-, Profil- oder Organisationsdaten
- Supabase-Tabellen, RPCs oder RLS-Regeln
- Authentifizierung oder Session-Logik
- LMH-ModuleAdapter oder Session-Handoff
- PCAD-Migrationslogik
- Banking-Backend oder Ledger
- produktiven Stable-Kanal
- produktiven Vercel-Hauptloader

## Dateien

- `files/v0803.js` – Redesign-Bootloader für v0.8.3
- `files/v0803-community.js` – Community-/Story-/Profil-UI-Schicht

## Nächster Schritt

**v0.8.4 – Einstellungen & Admin**

Einstellungen, Account-Verwaltung und Admin-Flächen werden im nächsten Schritt aus langen, überfüllten Blöcken in klar getrennte Kategorien und Panels überführt.
