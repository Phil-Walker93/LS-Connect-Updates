@echo off
setlocal
cd /d "%~dp0"
title LS Connect RC Preview v0.9.4
echo ==============================================
echo   LS Connect RC Preview v0.9.4
echo ==============================================
echo.

where py >nul 2>&1
if not errorlevel 1 (
  py -3 --version >nul 2>&1
  if not errorlevel 1 (
    echo Starte lokalen Preview-Server mit Python Launcher...
    py -3 "%~dp0static-preview-server.py"
    if errorlevel 1 goto :python_failed
    goto :end
  )
)

where python >nul 2>&1
if not errorlevel 1 (
  python --version >nul 2>&1
  if not errorlevel 1 (
    echo Starte lokalen Preview-Server mit Python...
    python "%~dp0static-preview-server.py"
    if errorlevel 1 goto :python_failed
    goto :end
  )
)

echo Python ist nicht verfuegbar. Nutze PowerShell-Fallback...
goto :powershell

:python_failed
echo.
echo Python-Start ist fehlgeschlagen. Nutze PowerShell-Fallback...

:powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-preview.ps1"
if errorlevel 1 goto :failed
goto :end

:failed
echo.
echo FEHLER: Die Preview konnte nicht gestartet werden.
echo Dieses Fenster bleibt offen, damit die Fehlermeldung sichtbar bleibt.
echo Bitte sende mir den Text aus diesem Fenster.
pause
exit /b 1

:end
endlocal
