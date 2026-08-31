# LS Connect RC Preview v0.9.3

## Warum dieser Hotfix existiert

Der vorherige lokale Preview-Server lieferte nur statische Dateien aus. LS Connect lädt Release-Dateien jedoch über absolute Pfade wie `/api/script?...`. Auf localhost wurden diese Pfade deshalb fälschlich gegen localhost statt gegen die bestehende Production aufgelöst. Ergebnis war eine unvollständige Mischansicht aus alter Basis und teilweise fehlenden Redesign-Patches.

## Fix in v0.9.3

- lokaler Proxy für `/api/script`
- alle Release-Skripte werden weiterhin unverändert vom bestehenden Production-Endpunkt bezogen
- Preview-Loader prüft den Proxy vor dem Start
- bei Proxy-Fehler startet die Vorschau nicht mehr in einem Mischzustand
- Python-Server bevorzugt; PowerShell-Proxy als Windows-Fallback
- kein direkter `file://`-Fallback mehr

## Start

1. Ordner entpacken.
2. `start-preview.bat` starten.
3. Der Browser öffnet automatisch die lokale Preview.
4. Im LS-Connect-Badge muss später `RC 0.9.1` bzw. ein QA-Status erscheinen.

## Sicherheitsgrenze

Production bleibt auf v0.7.10.13. Supabase, Auth, Rollen, LMH, PCAD und Banking werden durch den Preview-Launcher nicht verändert.
