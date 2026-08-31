# LS Connect v0.9.3 – Preview Proxy Hotfix

Status: **RC Preview Infrastructure**

Behebt den lokalen Preview-Startweg aus v0.9.2. Absolute `/api/script`-Aufrufe werden jetzt über einen lokalen Proxy an den unveränderten Production-Script-Endpunkt weitergeleitet. Dadurch können auch dynamisch nachgeladene v0.8-/v0.9-Module vollständig starten.

Zusätzlich prüft der Preview-Loader den Proxy vor dem RC-Start und bricht bei Fehlern ab, statt eine unvollständige Mischansicht zu zeigen.

Keine Änderung an Stable, Supabase, Auth, Rollen, LMH, PCAD oder Banking.
