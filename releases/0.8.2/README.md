# LS Connect v0.8.2 – Messenger Workspace

Status: **Redesign Preview**

## Ziel

Der eigentliche Messenger-Bereich wird ruhiger, klarer und moderner, ohne die vorhandene Nachrichten-, Anruf-, Supabase- oder Auth-Logik neu zu implementieren.

## Neu

- klareres dreispaltiges Desktop-Workspace-Raster
- kompaktere Chat- und Kanallisten
- modernisierte Chat-Kopfzeile
- ruhigere Nachrichtenabstände und besser lesbare Nachrichtenblasen
- Nachrichtenaktionen treten visuell zurück und erscheinen deutlich bei Hover/Fokus
- Composer bleibt als klare Eingabezone am unteren Rand
- responsive Anpassungen für Tablet und Smartphone
- definierte leere Zustände statt unstrukturierter Freiflächen
- optionale Header-Aktionsverdichtung: nur bei eindeutig vorhandenen Aktionscontainern werden mehr als drei Aktionen hinter einem Overflow-Menü zusammengefasst
- Originalbuttons bleiben im DOM; Overflow-Einträge lösen ausschließlich deren bestehende Click-Handler aus

## Sicherheits- und Parallelentwicklungsgrenze

v0.8.2 verändert ausdrücklich **nicht**:

- Nachrichten- oder Anrufdaten
- Supabase-Tabellen, RPCs oder RLS-Regeln
- Authentifizierung oder Session-Logik
- LMH-v0.10-ModuleAdapter/Handoff
- PCAD-Migrationslogik
- Banking-Backend oder Ledger
- produktiven Stable-Kanal
- produktiven Vercel-Hauptloader

## Dateien

- `files/v0802.js` – Redesign-Bootloader für v0.8.2
- `files/v0802-workspace.js` – Messenger-Workspace und defensive Header-Aktionsverdichtung

## Nächster Schritt

**v0.8.3 – Community & Profile**

Stories, Kanäle, Organisationen und Profile werden im nächsten Schritt auf dieselbe klare Karten- und Informationshierarchie gebracht.
