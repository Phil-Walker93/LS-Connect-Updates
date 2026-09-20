# LS Connect v0.9.5 – Identity v2 RC

Status: **Identity-v2 Release Candidate**

## Ziel

LS Connect übernimmt das neue LMH-Modell **Charakter ODER Organisation**. Eine Organisation wird nicht mehr als „Charakter handelt im Namen von …“ behandelt.

## RC-Verhalten

- aktive Organisation wird als eigenständige Identität dargestellt
- Unternehmenskanäle verwenden Organization-Actor-RPCs
- Kanalnachrichten tragen die Organisation als Autor
- Community-Posts, Kommentare, Likes, Saves, Follows und Storys laufen über die aktive Identität
- Identity-Revision wird regelmäßig neu geprüft
- ein Wechsel zwischen Character und Organization führt zu einem sauberen Reload
- private Chats, Kontakte, Gruppen-Privatchats und Anrufe bleiben bewusst Character-only

## Rollout

Der Stable-Kanal wird **nicht** automatisch umgestellt. Diese Version liegt zuerst auf `redesign-rc`, bis Backend, UI und Handoff gemeinsam verifiziert sind.
