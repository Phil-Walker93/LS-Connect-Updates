# LS Connect v0.9.1.3 – LMH Identity Handoff

Dieser Follow-up-Patch wird **erst nach dem laufenden v0.9.1.2 Recovery-Candidate** aktiviert.

## Ziel

LS Connect ist nicht mehr Eigentümer der Charakter-/Profilverwaltung. Erstellung, Auswahl und Organisations-/Unternehmensprofile werden zentral im LS Mobile Hub verwaltet.

## Verhalten

- „Charakter erstellen“ wird aus LS Connect entfernt.
- „Charaktere verwalten“ und die lokale Reihenfolge-/Auswahlverwaltung werden entfernt.
- Das Charaktermenü enthält stattdessen einen direkten Einstieg zum LS Mobile Hub.
- LS Connect verwendet weiterhin den vom LMH synchronisierten aktiven Charakter.
- Bestehende Charakter-, Chat-, Kontakt-, Post- und Organisations-IDs bleiben unverändert.
- Keine Banking-, PCAD- oder Auth-Daten werden durch diesen UI-Patch verändert.

## Rollout-Sicherheit

1. LMH Central Identity muss produktiv und geprüft sein.
2. v0.9.1.2 darf nicht durch diesen Candidate überschrieben werden.
3. Erst danach wird v0.9.1.3 über das bestehende Release Center als Candidate registriert und getestet.
4. Legacy-RPCs werden erst nach erfolgreichem LS-Connect-Test serverseitig auf LMH-only eingeschränkt.
