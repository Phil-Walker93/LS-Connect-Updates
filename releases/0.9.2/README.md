# LS Connect v0.9.2 – Preview Loader

Status: **isolierte RC-Vorschau**

v0.9.2 verändert nicht die eigentliche LS-Connect-Funktionalität. Die Version stellt nur einen kontrollierten Preview-Startweg für den v0.9.1 Release Candidate bereit.

## Enthalten

- `files/v092-preview-marker.js` – stellt nach dem alten Stable-Guard die RC-Runtime-Version wieder her und kennzeichnet die Vorschau eindeutig.
- `preview/v0.9.2/index.html` – liest die aktuelle Production-Basis, prüft exakt Stable v0.7.10.13 und ergänzt RC + Preview-Marker ausschließlich im Preview-Dokument.
- Windows-Starter für lokalen HTTP-Test.

## Nicht verändert

- produktiver Hauptloader
- Stable-Kanal
- Supabase / Auth / RPC / RLS
- LS Mobile Hub Handoff
- PCAD
- Banking

Nächster Schritt: interaktive RC-Abnahme.
