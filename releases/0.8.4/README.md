# LS Connect v0.8.4 – Einstellungen & Admin Cleanup

Status: **Redesign Preview**

## Neu
- lange Einstellungsdialoge erhalten eine kompakte Bereichsnavigation
- vorhandene Settings-Blöcke werden nur clientseitig gefiltert
- Kategorien: Konto, Design, Hinweise, Privatsphäre, System, Weitere
- Admin-Tabs werden als kompakte, horizontal scrollbare Navigation dargestellt
- Verwaltungszeilen, Rollen-, Nutzer- und Logbereiche werden visuell verdichtet
- gefährliche Aktionen sind klarer gekennzeichnet
- Tabellen werden ruhiger und lesbarer dargestellt
- Smartphone-Modals nutzen die gesamte Breite und größere Touch-Flächen

## Parallelentwicklungs-Grenze
Keine Änderungen an Supabase, Auth, RPC, RLS, LMH-Handoff, PCAD-Migration oder Banking-Backend. Stable-Kanal und produktiver Hauptloader bleiben unverändert.

## Dateien
- `files/v0804.js`
- `files/v0804-settings-admin.js`

## Nächster Schritt
**v0.8.5 – Mobile Polish**
