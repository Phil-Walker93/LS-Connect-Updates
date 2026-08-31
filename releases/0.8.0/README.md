# LS Connect v0.8.0 – Hub UI Redesign

## Ziel

LS Connect erhält eine neue, moderne Oberfläche im Stil des LS Mobile Hub, ohne die bestehende fachliche Logik, Supabase-Strukturen oder Auth-Flows umzubauen.

## Grundprinzip

- bestehende Funktionen bleiben erhalten
- keine Änderungen an gemeinsamen LMH-/LS-Connect-Supabase-Tabellen
- keine Änderungen an Auth oder Rollenlogik
- neue UI als isolierte, rückrollbare Schicht
- produktiver Stable-Kanal bleibt bis zur Abnahme unverändert

## Neue Informationsstruktur

Die Navigation wird visuell in vier Bereiche gegliedert:

1. **Kommunikation** – Chats, Nachrichten, Kontakte, Anrufe
2. **Community** – Kanäle, Stories, Gruppen und Feed-Funktionen
3. **Konto** – Profil, Charaktere, Design und Einstellungen
4. **Verwaltung** – Admin-, Moderations-, Ticket- und Systembereiche

Die Struktur-Schicht verschiebt keine dynamischen Chat- oder Kanalzeilen und greift nicht in deren Event-Handler ein.

## Neues Designsystem

- Hub-inspirierte dunkle Glas-/Slate-Oberfläche
- größere Radien und klarere Kartenhierarchie
- weniger harte Panel-Trennungen
- modernisierte aktive Navigation
- ruhigere Chatblasen
- klarere Composer-/Input-Zone
- vereinheitlichte Modals und Einstellungsblöcke
- mobile Floating-Navigation
- reduzierte Animationen werden respektiert

## Technischer Aufbau

- `v080.js` – isolierter Bootloader
- `v080-theme.js` – ausschließlich visuelle UI-Schicht
- `v080-structure.js` – leichte Navigations-/Informationsstruktur
- Basis bleibt die bestehende v0.7.11.2-Funktionskette

## Nicht Bestandteil dieses Schritts

- keine Datenbankmigration
- keine neuen RLS-Regeln
- keine Auth-Änderungen
- keine Entfernung bestehender Funktionen
- keine Aktivierung des produktiven Stable-Kanals

## Geplante nächste Redesign-Schritte

### v0.8.1 – Navigation Cleanup
Überflüssige Doppel-Navigation entfernen und klare Primär-/Sekundärnavigation definieren.

### v0.8.2 – Messenger Workspace
Chatliste, Chatkopf, Composer, Anhänge und Nachrichtenaktionen als einheitlichen Messenger-Arbeitsbereich neu ordnen.

### v0.8.3 – Community & Profil
Kanäle, Stories, Profile und Organisationsseiten in ein gemeinsames Karten-/Detailseitenmuster überführen.

### v0.8.4 – Einstellungen & Administration
Einstellungen und Admin-Bereiche aus langen, überfüllten Modals in klar gegliederte Abschnitte überführen.

### v0.8.5 – Mobile Polish
Smartphone-Navigation, Touch-Flächen, Modals/Sheets und responsive Zustände finalisieren.

### v0.8.6 – Accessibility & Performance
Tastaturführung, Fokuszustände, semantische Labels sowie DOM-/Observer- und Renderkosten prüfen.

### v0.9.0 – Redesign Release Candidate
Gesamtabnahme, Regressionstest und kontrollierter Wechsel des produktiven Loaders.
