# LS Mobile Hub

Aktueller Entwicklungsstand: **v0.1.0 – Grundgerüst**

Der LS Mobile Hub ist die zentrale Smartphone-Oberfläche des Los-Santos-RP-Systems. Die einzelnen Fachsysteme bleiben als eigenständige Module konzipiert.

## v0.1.0 umgesetzt

- Smartphone-Rahmen und Homescreen
- App-Launcher
- statische App-Kacheln für LS Connect, PCAD, Banking, Mitteilungen und Einstellungen
- Basisnavigation zwischen Homescreen und Modulansicht
- responsive Grundlage für Desktop und mobile Endgeräte
- zentrale Modul-Registry in `src/modules.ts`
- keine produktive Kopplung an LS Connect oder PCAD

## Sicherheits- und Architekturprinzip

Der Hub darf LS Connect oder PCAD nicht zu internen, untrennbaren Bestandteilen machen. Module werden über definierte Schnittstellen und konfigurierbare Zieladressen angebunden. Bestehende Produktionssysteme bleiben während der Migration lauffähig.

## Entwicklung

```bash
npm install
npm run dev
```

Produktionsbuild:

```bash
npm run build
```

## Nächster Schritt

**v0.1.1 – Projektabgrenzung & Struktur-Hotfix**

Dort folgen getrennte Umgebungsvariablen, gemeinsame Schnittstellen und die technische Vorbereitung der externen Module.
