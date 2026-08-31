# LS Mobile Hub

Aktueller Entwicklungsstand: **v0.5.0 – LS-Connect-Integration**

Der LS Mobile Hub ist die zentrale Smartphone-Oberfläche des Los-Santos-RP-Systems. LS Connect, PCAD, Banking und zukünftige Fachsysteme bleiben eigenständige Module und werden über klar definierte Schnittstellen angebunden.

## Roadmap-Status

### v0.1.0 – Grundgerüst ✅
- Smartphone-Rahmen und Homescreen
- App-Launcher
- statische App-Kacheln
- Basisnavigation
- modulare App-Registry

### v0.1.1 – Projektabgrenzung & Struktur-Hotfix ✅
- getrennte Modul-Zieladressen über Umgebungsvariablen
- zentrale Integrationsverträge
- keine hart verdrahteten LS-Connect-/PCAD-URLs im UI-Code

### v0.2.0 – Erste nutzbare Benutzeroberfläche ✅
- responsive Darstellung
- Desktop- und Mobile-Grundlage
- Touch-Verhalten
- App-Öffnungsanimationen
- reduzierte Animationen bei entsprechender Systemeinstellung

### v0.3.0 – Modul-Verlinkungen ✅
- LS Connect über konfigurierbare Produktions-URL
- PCAD über konfigurierbare Produktions-URL
- Banking-Ziel vorbereitet

### v0.3.1 – Zurück-zum-Handy-Standard ⏸
Vorbereitet, aber noch nicht produktiv aktiviert. Dafür wird zuerst eine stabile LMH-Produktions-URL benötigt. Anschließend muss LS Connect kontrolliert um den Rückweg ergänzt werden. Bis dahin wird das bestehende LS-Connect-Produktionssystem nicht verändert.

### v0.4.0 – Rollen- und Berechtigungssystem ✅
- gemeinsame Supabase-Authentifizierung
- LMH-Rollen: Bürger, Unternehmen, LSPD, Staatsdienst, Administrator, Systemadministrator
- rollenbasierte App-Sichtbarkeit
- individuelle App-Overrides
- Row Level Security

### v0.5.0 – LS-Connect-Anbindung ✅
- bestehender LS-Connect-Account als LMH-Identitätsquelle
- Übernahme von Accountinformationen
- LMH-Rollen und App-Freigaben
- aktiver zugänglicher LS-Connect-Charakter
- Profilinformationen wie Name, Handle, Account-Typ und Profilfarbe
- gemeinsame Auth-Grundlage für spätere Session-Übergaben

## Sicherheits- und Architekturprinzip

Der Hub macht LS Connect oder PCAD nicht zu untrennbaren internen Bestandteilen. Bestehende Produktionssysteme bleiben während der Migration lauffähig. Browserseitig wird ausschließlich ein Supabase-Publishable-Key genutzt; privilegierte Server-Schlüssel gehören nicht in das Frontend. Rechte werden serverseitig über RLS und kontrollierte RPCs geprüft.

Ein echtes Single-Sign-on zwischen unterschiedlichen Vercel-Domains wird nicht durch das Weiterreichen von Access-Tokens in URLs umgesetzt. Dafür folgt ein sicherer Session-Handoff, sobald der Hub eine feste Produktionsadresse besitzt.

## Entwicklung

```bash
npm install
npm run dev
```

Produktionsbuild:

```bash
npm run build
```

## Nächster regulärer Roadmap-Schritt

**v0.6.0 – Banking-App Vorbereitung**

Vor einer produktiven Weiterentwicklung werden außerdem die noch offenen Integrationspunkte aus v0.3.1 abgeschlossen, sobald die feste LMH-Produktions-URL verfügbar ist.
