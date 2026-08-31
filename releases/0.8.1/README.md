# LS Connect v0.8.1 – Navigation Cleanup

Status: **Redesign Preview**

## Ziel

Die Sidebar wird übersichtlicher, ohne bestehende LS-Connect-Funktionen oder Backend-Verträge umzubauen.

## Neu

- kompakte Bereichsnavigation für **Alle**, **Chats**, **Community**, **Konto** und **Verwaltung**
- bestehende Sidebar-Aktionen werden ausschließlich clientseitig klassifiziert
- Bereichsfilter blenden nur Navigationselemente aus; Daten und Funktionen werden nicht verändert
- Bereichszähler geben einen schnellen Überblick über vorhandene Navigationseinträge
- Filter gilt nur für die aktuelle Browser-Sitzung
- bestehende v0.8.0-Hub-UI bleibt Grundlage
- Alt-Struktur-Labels innerhalb der neuen Navigation werden automatisch bereinigt

## Sicherheits- und Parallelentwicklungsgrenze

v0.8.1 verändert ausdrücklich **nicht**:

- Supabase-Tabellen oder Daten
- RPCs oder RLS-Regeln
- Authentifizierung oder Session-Logik
- LS-Mobile-Hub-ModuleAdapter/Handoff
- PCAD-Migrationslogik
- LS-Banking-Daten oder Integrationsbackend
- produktiven Stable-Kanal
- produktiven Vercel-Hauptloader

Damit kann die Redesign-Linie parallel zu Hub, PCAD und Banking weiterentwickelt werden.

## Dateien

- `files/v0801.js` – Redesign-Bootloader für v0.8.1
- `files/v0801-navigation.js` – neue Sidebar-/Bereichsnavigation

## Nächster Schritt

**v0.8.2 – Messenger Workspace**

Danach werden Chatliste, Chatkopf, Nachrichtenbereich und Composer als zusammenhängender moderner Messenger-Workspace überarbeitet, weiterhin ohne Backend-/Auth-Migration.
