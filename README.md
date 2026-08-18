# LS Connect Updates

Zentrale Updatequelle für LS Connect.

Dieses Repository dient ausschließlich zur Verteilung von Versionsinformationen und Updatepaketen für LS Connect.

## Struktur

- `latest.json` – aktuellste stabile Version
- `channels/stable.json` – stabiler Update-Kanal
- `releases/<version>/` – Updatepakete pro Version

## Sicherheit

Updatepakete werden mit SHA-256 geprüft. In diesem Repository werden keine Supabase-Secret-Keys, Service-Role-Keys, Passwörter oder sonstige Zugangsdaten gespeichert.

## Updateablauf

LS Connect ruft `latest.json` ab, vergleicht die installierte Version, lädt bei Bedarf das angegebene Paket herunter, prüft dessen SHA-256-Hash und startet anschließend den lokalen Updater.
