# LS Connect v0.9.1.5 – Zeitstempel in „Was ist neu?“

## Problem

Der zentrale Changelog enthält bei den meisten Releases bereits ein `released_at`-Feld. Die aktuell produktive `openChangelogModal`-Darstellung rendert dieses Feld jedoch nicht. Dadurch sieht man zwar Version, Titel und Änderungen, aber nicht, wann das Update veröffentlicht wurde.

## Änderung

- Jede Changelog-Karte zeigt jetzt **Datum und Uhrzeit** der Veröffentlichung.
- Format: **TT.MM.JJJJ, HH:MM Uhr**.
- Primäre Quelle ist `released_at` aus `changelog.json`.
- Für neuere Release-Center-Versionen ohne zentralen Changelog-Zeitstempel wird die tatsächliche Stable-Freigabezeit verwendet.
- Einträge ohne belastbaren Zeitstempel bleiben ohne Datumsanzeige; es wird kein Datum erfunden.
- Die Änderung betrifft ausschließlich die Darstellung von „Was ist neu?“ und verändert keine Identity-, Rollen-, RLS-, Chat- oder Banking-Logik.

## Verifikation

- JavaScript-Syntaxprüfung mit `node --check`.
- Fallback-Verhalten bei fehlendem `released_at`.
- Deutsche Datums-/Zeitformatierung über `Intl.DateTimeFormat('de-DE')`.
