# LS Connect v0.9.2 – Isolated RC Preview Loader

Status: **Preview/Test only**

## Ziel

Der Loader startet die bestehende LS-Connect-Production-Basis unverändert und ergänzt ausschließlich in der lokalen Vorschau die Redesign-RC-Kette `v0.9.1` plus einen Preview-Marker.

## Sicherheitsprinzip

- Production-URL wird nur gelesen, nicht verändert.
- Erwartete Stable-Version muss exakt `0.7.10.13` sein.
- Der Loader bricht ab, wenn der bekannte Stable-Patchanker fehlt.
- Der Loader bricht ab, wenn Production bereits RC-/Preview-Patches enthält.
- `channels/stable.json`, `latest.json` und der produktive Vercel-Hauptloader bleiben unverändert.
- Keine Supabase-, Auth-, RPC-, RLS-, LMH-, PCAD- oder Banking-Änderungen.

## Start unter Windows

`start-preview.bat` startet einen lokalen HTTP-Server auf `http://localhost:8091/` und öffnet die Vorschau im Browser. Falls der lokale Server nicht gestartet werden kann, wird `index.html` direkt geöffnet.

## Patchkette der Vorschau

1. aktuelle Production-Basis `0.7.10.13`
2. `0.9.1 / v091.js` – RC QA Hardening
3. `0.9.2 / v092-preview-marker.js` – eindeutige Preview-Markierung und Runtime-Version

Die `v091.js`-Kette lädt intern die vollständige Redesign-Linie bis v0.8.0/0.7.11.2.

## Erwartetes Ergebnis

Nach erfolgreichem Start zeigt das Redesign-Badge den RC-/QA-Status. Der QA-Bericht ist unter `window.__LS_CONNECT_RC_QA_REPORT__` verfügbar.

## Nächster Schritt

Interaktive RC-Abnahme: Login, Charakterwechsel, Chats, Calls, Stories, Kanäle, Profile, Einstellungen, Admin und mobile Bedienung.
