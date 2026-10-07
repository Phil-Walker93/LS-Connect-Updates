# PhilTech 0.1.0-alpha.2

Technik-Mod-Prototyp für **Minecraft 26.3 + Fabric** mit eigenem TE-Energiesystem.

## Inhalt dieser Alpha

### TE-Energiesystem

- Eigene Energieeinheit: **TE (Tech Energy)**
- Serverseitige Energieverteilung
- Maschinenrollen: Erzeuger, Speicher und Verbraucher
- Verbraucher werden vor Energiespeichern versorgt
- Kabelnetzwerke werden per BFS erkannt
- Sicherheitslimit von 512 Kabelsegmenten pro Transfersuche
- Energie wird mit der Welt gespeichert

### TE-Generator

- Verwendet Minecraft-Brennstoffe über das neue 26.3-`COOKING_FUEL`-Komponentensystem
- Erzeugt **20 TE/t**
- Interner Speicher: **20.000 TE**
- Maximale Netzausgabe: **200 TE/t**
- Eigene GUI mit Energie- und Brennstoffanzeige
- Crafting-Reste von Brennstoffen werden berücksichtigt

### Energiezelle

- Kapazität: **100.000 TE**
- Ein- und Ausgang möglich
- Maximale Ausgabe: **200 TE/t**
- Rechtsklick zeigt den aktuellen Ladestand
- Gibt Energie automatisch an Verbraucher im Kabelnetz ab

### Kupfer-Energiekabel

- Verbindet Generatoren, Speicher und Verbraucher
- Direkte Nachbarschaft und zusammenhängende Kabelnetze funktionieren
- Aktuell ein Vanilla+-Basismodell aus Kupfer mit Redstone-Kern

### Reparaturtisch

- Interner Speicher: **10.000 TE**
- Verbrauch: **5 TE pro repariertem Haltbarkeitspunkt**
- Geschwindigkeit: **1 Haltbarkeitspunkt / 2 Ticks** = 10 Haltbarkeitspunkte pro Sekunde
- Reparaturdauer hängt direkt vom tatsächlichen Schaden ab
- Repariert schrittweise statt alles am Ende auf einmal
- Item kann jederzeit entnommen werden und behält seinen Reparaturstand
- Stoppt exakt bei Energiemangel und läuft nach erneuter Versorgung weiter
- Item schwebt und rotiert sichtbar über dem Tisch
- Schnellere Animation während einer aktiven Reparatur
- GUI zeigt Schaden, Restzeit und Energie
- Name, Verzauberungen und sonstige Item-Daten bleiben erhalten

## Beispielnetz

```text
TE-Generator ─ Kupferkabel ─ Reparaturtisch
                    │
                    └──────── Energiezelle
```

Der Generator versorgt zuerst den Reparaturtisch. Überschüssige Energie wird anschließend in der Energiezelle gespeichert. Fällt der Generator aus, kann die Energiezelle den Reparaturtisch weiter versorgen.

## Rezepte

Alle vier Blöcke besitzen bereits Crafting-Rezepte und Loot Tables:

- TE-Generator
- Energiezelle
- Kupfer-Energiekabel
- Reparaturtisch

## Entwicklung / Build

Voraussetzungen:

- JDK 25
- Minecraft 26.3
- Fabric Loader 0.19.5+
- Fabric API 0.161.0+26.3

Das Projekt verwendet aktuell `loom 1.18-SNAPSHOT` entsprechend dem aktuellen Fabric-Beispielprojekt für 26.3.

Lokal:

```bash
gradle build
```

Das fertige JAR liegt danach in `build/libs/`.

Zusätzlich ist unter `.github/workflows/build.yml` ein GitHub-Actions-Build enthalten. Er richtet Java 25 und Gradle ein, baut die Mod und stellt die erzeugten JARs als Workflow-Artefakt bereit.

## Installation

Die Mod ist als **Server+Client-Mod** ausgelegt. Server und alle Clients benötigen:

- Fabric Loader
- Fabric API
- dieselbe PhilTech-Version

## Bekannte Alpha-Punkte

- Das Kabelmodell zeigt in alpha.2 noch alle sechs Leitungsarme; dynamisch verbundene Kabelmodelle folgen.
- Generator und Energiezelle erhalten später stärkere Statusanzeigen/Animationen.
- Der elektrische Brecher ist als nächste Kernmaschine geplant.
- Ein vollständiger lokaler Compile konnte in der aktuellen Arbeitsumgebung nicht ausgeführt werden, da dort nur Java 21 und kein Gradle installiert sind. Die Projektdateien und Ressourcen werden deshalb zusätzlich statisch geprüft; der enthaltene GitHub-Workflow baut mit Java 25.
