# LS Connect RC Preview v0.9.4

Hotfix für den lokalen Preview-Start.

## Änderungen
- kein lokaler `/api/script`-Proxy mehr nötig
- Preview-Routing wird vor allen Stable-/RC-Patches installiert
- root-relative `/api/script`-Aufrufe werden direkt auf die bestehende LS-Connect-Production umgeleitet
- relative Basis-Ressourcen werden über ein Production-`base` korrekt aufgelöst
- robuster Windows-Starter mit Python und PowerShell-Fallback
- bei einem Startfehler bleibt das Fenster offen und zeigt die Fehlermeldung

## Start
1. ZIP entpacken.
2. `start-preview.bat` doppelklicken.
3. Das Konsolenfenster offen lassen.
4. Die Preview öffnet sich automatisch im Browser.

Die öffentliche Production bleibt unverändert auf v0.7.10.13.
