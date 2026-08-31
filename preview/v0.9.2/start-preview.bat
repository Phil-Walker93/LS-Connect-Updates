@echo off
setlocal
cd /d "%~dp0"
echo Starte LS Connect RC Preview v0.9.2...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-preview.ps1"
if errorlevel 1 (
  echo.
  echo Lokaler Webserver konnte nicht gestartet werden. Oeffne die Preview direkt im Browser.
  start "LS Connect RC Preview" "%~dp0index.html"
)
endlocal
