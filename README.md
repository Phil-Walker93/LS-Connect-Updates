# LS Connect Updates

Zentrale Updatequelle für LS Connect.

Dieses Repository dient ausschließlich zur Verteilung von Versionsinformationen und geprüften Update-Dateien für LS Connect.

## Struktur

- `latest.json` – aktuellste stabile Version und Manifest-URL
- `channels/stable.json` – stabiler Update-Kanal
- `changelog.json` – Versionsverlauf für „Was ist neu?“
- `releases/<version>/manifest.json` – Dateiliste einer Version
- `releases/<version>/files/` – Update-Dateien ab v0.8

## Updater

LS Connect v0.7 ist die Bootstrap-Version und wird einmalig manuell installiert. Ab v0.8 läuft der reguläre Ablauf über **Nach Updates suchen → Jetzt aktualisieren**.

Jede Datei eines Updates wird vor dem Austausch per SHA-256 geprüft. Erst wenn alle Dateien vollständig heruntergeladen und geprüft sind, ersetzt der lokale Updater die Programmdateien. Vorher wird eine Sicherung angelegt; bei einem Fehler werden bereits ersetzte Dateien zurückgerollt.

`config.js` wird vom Updater grundsätzlich nicht überschrieben, damit die lokale Supabase-Konfiguration erhalten bleibt.

## Manifest-Protokoll 1

Ein Update-Manifest enthält `version`, `protocol`, `files` und optional `remove`. Jeder Eintrag in `files` besitzt mindestens `path`, `url` und `sha256`. Für Binärdateien kann `encoding: "base64"` verwendet werden.

Der lokale Updater akzeptiert ausschließlich HTTPS-Dateien von der fest freigegebenen Updatequelle und blockiert Pfad-Traversal außerhalb des LS-Connect-Ordners.

## Sicherheit

In diesem Repository werden keine Supabase-Secret-Keys, Service-Role-Keys, Passwörter oder sonstige Zugangsdaten gespeichert.
