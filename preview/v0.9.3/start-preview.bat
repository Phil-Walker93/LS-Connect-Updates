@echo off
setlocal
cd /d "%~dp0"
echo Starte LS Connect RC Preview v0.9.3...
echo.

where py >nul 2>&1
if not errorlevel 1 (
  py -3 "%~dp0preview-server.py"
  goto :end
)

where python >nul 2>&1
if not errorlevel 1 (
  python "%~dp0preview-server.py"
  goto :end
)

echo Python wurde nicht gefunden. Nutze PowerShell-Proxy...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-preview.ps1"
if errorlevel 1 (
  echo.
  echo FEHLER: Der lokale Preview-Proxy konnte nicht gestartet werden.
  echo Die HTML-Datei wird absichtlich NICHT direkt geoeffnet, damit keine kaputte Mischansicht entsteht.
  pause
)

:end
endlocal
