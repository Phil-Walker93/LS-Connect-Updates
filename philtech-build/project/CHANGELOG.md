# Changelog

## 0.1.0-alpha.2

- Eigenes TE-Energiesystem eingeführt
- Serverseitige Kabelnetzwerke mit Verbraucher-Priorisierung
- TE-Generator hinzugefügt
  - 20 TE/t Erzeugung
  - 20.000 TE interner Speicher
  - 200 TE/t maximale Ausgabe
  - Minecraft-26.3-Brennstoffkomponenten
  - Generator-GUI
- Energiezelle hinzugefügt
  - 100.000 TE Kapazität
  - 200 TE/t maximale Ausgabe
  - automatische Versorgung von Verbrauchern
- Kupfer-Energiekabel hinzugefügt
- Reparaturtisch an TE-System angebunden
  - 10.000 TE Speicher
  - 5 TE je Haltbarkeitspunkt
  - automatische Pause bei Energiemangel
  - Fortsetzung ohne Fortschrittsverlust
- Reparatur- und Generator-GUI überarbeitet
- Interne Energieerzeugung von externer Energieannahme getrennt
- Minecraft-26.3-Portierung korrigiert: entfernte Block-Codecs nicht mehr verwendet
- Crafting-Reste von Generator-Brennstoffen berücksichtigt
- Rezepte, Loot Tables, Modelle und Sprachdateien für neue Blöcke ergänzt
- GitHub-Actions-Build mit Java 25 ergänzt

## 0.1.0-alpha.1

- Erster spielbarer Reparaturtisch
- Dynamische Reparaturzeit anhand des fehlenden Haltbarkeitswerts
- Schrittweise Reparatur; Item jederzeit entnehmbar
- Server-seitige Reparaturlogik und Client-Synchronisierung
- Schwebendes und rotierendes 3D-Item über dem Tisch
- Reparatur-GUI mit Fortschritt, Restschaden und Restzeit
- Rezept, Loot Table, Sprachdateien und Vanilla+-Blockmodell
