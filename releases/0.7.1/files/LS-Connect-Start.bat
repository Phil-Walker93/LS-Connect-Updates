@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "LSC_ROOT=%~dp0"
set "APP_VERSION=0.7.1"

rem ============================================================
rem LS Connect - Doppelklick-Starter
rem Benötigt keine Python-Installation mehr.
rem Der lokale Webserver läuft über das in Windows enthaltene
rem PowerShell und der Browser öffnet sich erst, wenn er erreichbar ist.
rem ============================================================

where powershell.exe >nul 2>nul
if errorlevel 1 goto python_fallback

for /f "usebackq delims=" %%V in (`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$p=Join-Path $env:LSC_ROOT 'version.json'; try{$v=(Get-Content -Raw -LiteralPath $p | ConvertFrom-Json).version;if($v){Write-Output $v}}catch{}"`) do set "APP_VERSION=%%V"
title LS Connect v%APP_VERSION%

set "PORT=8080"
for /f "usebackq delims=" %%P in (`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$p=8080; while($p -lt 9000){$l=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,$p); try{$l.Start();$l.Stop();Write-Output $p;break}catch{try{$l.Stop()}catch{};$p++}}"`) do set "PORT=%%P"

if not defined PORT set "PORT=8080"

echo.
echo [LS Connect] Starte v%APP_VERSION% auf http://127.0.0.1:%PORT%/
echo [LS Connect] Das Serverfenster bitte offen lassen.
echo.

rem Browser erst öffnen, wenn der Server den Port wirklich angenommen hat.
start "" /min powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -Command "$p=%PORT%; for($i=0;$i -lt 80;$i++){try{$c=[Net.Sockets.TcpClient]::new();$a=$c.BeginConnect('127.0.0.1',$p,$null,$null);if($a.AsyncWaitHandle.WaitOne(250) -and $c.Connected){$c.Close();Start-Process 'http://127.0.0.1:%PORT%/';exit};$c.Close()}catch{};Start-Sleep -Milliseconds 250}"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0LS-Connect-Server.ps1" -Port %PORT%

echo.
echo [LS Connect] Der lokale Server wurde beendet.
pause
exit /b 0

:python_fallback
rem Nur als Notfall-Fallback für Systeme ohne powershell.exe.
py -3 -c "import sys; raise SystemExit(0 if sys.version_info.major == 3 else 1)" >nul 2>nul
if not errorlevel 1 goto run_py

python -c "import sys; raise SystemExit(0 if sys.version_info.major == 3 else 1)" >nul 2>nul
if not errorlevel 1 goto run_python

echo.
echo [LS Connect] Weder PowerShell noch Python 3 konnte gestartet werden.
echo LS Connect benötigt einen lokalen Webserver. Bitte wende dich an den Entwickler.
echo.
pause
exit /b 1

:run_py
set "PORT=8080"
start "" "http://127.0.0.1:%PORT%/"
py -3 -m http.server %PORT% --bind 127.0.0.1
exit /b %errorlevel%

:run_python
set "PORT=8080"
start "" "http://127.0.0.1:%PORT%/"
python -m http.server %PORT% --bind 127.0.0.1
exit /b %errorlevel%
