param(
    [Parameter(Mandatory = $false)]
    [ValidateRange(1024, 65535)]
    [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'
$LocalVersion = '0.7.0' # fallback; wird nach Bestimmung der Serverwurzel aus version.json geladen
$UpdaterProtocol = 1
$UpdateSource = 'https://raw.githubusercontent.com/Phil-Walker93/LS-Connect-Updates/main/latest.json'
$AllowedUpdateHosts = @('raw.githubusercontent.com')
$PreservedFiles = @('config.js')
$script:ShouldRestart = $false

try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch { }

# Die Serverwurzel wird direkt aus dem Speicherort dieses Scripts ermittelt.
$Root = [System.IO.Path]::GetFullPath($PSScriptRoot)
try {
    $versionFile = Join-Path $Root 'version.json'
    if (Test-Path -LiteralPath $versionFile -PathType Leaf) {
        $versionInfo = Get-Content -LiteralPath $versionFile -Raw -Encoding UTF8 | ConvertFrom-Json
        if (-not [string]::IsNullOrWhiteSpace([string]$versionInfo.version)) { $LocalVersion = [string]$versionInfo.version }
        if ($null -ne $versionInfo.updater_protocol -and [int]$versionInfo.updater_protocol -gt 0) { $UpdaterProtocol = [int]$versionInfo.updater_protocol }
    }
} catch {
    Write-Host "[LS Connect] version.json konnte nicht gelesen werden; verwende Fallback v$LocalVersion." -ForegroundColor Yellow
}
$separators = [char[]]@([System.IO.Path]::DirectorySeparatorChar,[System.IO.Path]::AltDirectorySeparatorChar)
$RootPrefix = $Root.TrimEnd($separators) + [System.IO.Path]::DirectorySeparatorChar

function Get-MimeType([string]$Path) {
    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        '.html'        { return 'text/html; charset=utf-8' }
        '.htm'         { return 'text/html; charset=utf-8' }
        '.js'          { return 'text/javascript; charset=utf-8' }
        '.css'         { return 'text/css; charset=utf-8' }
        '.json'        { return 'application/json; charset=utf-8' }
        '.webmanifest' { return 'application/manifest+json; charset=utf-8' }
        '.svg'         { return 'image/svg+xml' }
        '.png'         { return 'image/png' }
        '.jpg'         { return 'image/jpeg' }
        '.jpeg'        { return 'image/jpeg' }
        '.gif'         { return 'image/gif' }
        '.webp'        { return 'image/webp' }
        '.ico'         { return 'image/x-icon' }
        '.txt'         { return 'text/plain; charset=utf-8' }
        '.ps1'         { return 'text/plain; charset=utf-8' }
        '.bat'         { return 'text/plain; charset=utf-8' }
        default        { return 'application/octet-stream' }
    }
}

function Write-Response(
    [System.Net.Sockets.NetworkStream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [string]$ContentType,
    [byte[]]$Body,
    [bool]$HeadOnly = $false,
    [string]$CacheControl = 'no-cache'
) {
    if ($null -eq $Body) { $Body = [byte[]]@() }
    $headers = "HTTP/1.1 $StatusCode $StatusText`r`n" +
               "Content-Type: $ContentType`r`n" +
               "Content-Length: $($Body.Length)`r`n" +
               "Cache-Control: $CacheControl`r`n" +
               "Connection: close`r`n" +
               "X-Content-Type-Options: nosniff`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    if (-not $HeadOnly -and $Body.Length -gt 0) { $Stream.Write($Body, 0, $Body.Length) }
    $Stream.Flush()
}

function Write-JsonResponse([System.Net.Sockets.NetworkStream]$Stream,[int]$StatusCode,[object]$Object,[bool]$HeadOnly=$false) {
    $statusText = if ($StatusCode -eq 200) { 'OK' } elseif ($StatusCode -eq 400) { 'Bad Request' } elseif ($StatusCode -eq 404) { 'Not Found' } else { 'Internal Server Error' }
    $json = $Object | ConvertTo-Json -Depth 12 -Compress
    Write-Response $Stream $StatusCode $statusText 'application/json; charset=utf-8' ([System.Text.Encoding]::UTF8.GetBytes($json)) $HeadOnly 'no-cache, no-store, must-revalidate'
}

function Get-RemoteJson([string]$Url) {
    $uri = [Uri]$Url
    if ($uri.Scheme -ne 'https') { throw 'Updatequelle muss HTTPS verwenden.' }
    $wc = New-Object System.Net.WebClient
    $wc.Headers['User-Agent'] = 'LS-Connect-Updater/0.7'
    try { return ($wc.DownloadString($uri) | ConvertFrom-Json) } finally { $wc.Dispose() }
}

function Compare-Version([string]$A,[string]$B) {
    $aa = $A.Split('.') | ForEach-Object { try { [int]$_ } catch { 0 } }
    $bb = $B.Split('.') | ForEach-Object { try { [int]$_ } catch { 0 } }
    $max = [Math]::Max([Math]::Max($aa.Count,$bb.Count),3)
    for ($i=0; $i -lt $max; $i++) {
        $av = if ($i -lt $aa.Count) { $aa[$i] } else { 0 }
        $bv = if ($i -lt $bb.Count) { $bb[$i] } else { 0 }
        if ($av -gt $bv) { return 1 }
        if ($av -lt $bv) { return -1 }
    }
    return 0
}

function Get-SafeTargetPath([string]$RelativePath) {
    if ([string]::IsNullOrWhiteSpace($RelativePath)) { throw 'Leerer Updatepfad.' }
    $normalized = $RelativePath.Replace('/', [System.IO.Path]::DirectorySeparatorChar).TrimStart($separators)
    if ([System.IO.Path]::IsPathRooted($normalized)) { throw 'Absoluter Updatepfad ist nicht erlaubt.' }
    $target = [System.IO.Path]::GetFullPath((Join-Path $Root $normalized))
    if (-not $target.StartsWith($RootPrefix,[System.StringComparison]::OrdinalIgnoreCase)) { throw 'Updatepfad verlässt den LS-Connect-Ordner.' }
    return $target
}

function Get-Sha256([byte[]]$Bytes) {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash($Bytes))).Replace('-','').ToLowerInvariant() } finally { $sha.Dispose() }
}

function Get-UpdateBytes([object]$FileEntry) {
    $url = [string]$FileEntry.url
    $uri = [Uri]$url
    if ($uri.Scheme -ne 'https' -or $AllowedUpdateHosts -notcontains $uri.Host.ToLowerInvariant()) { throw "Nicht erlaubte Updatequelle für $($FileEntry.path)." }
    $wc = New-Object System.Net.WebClient
    $wc.Headers['User-Agent'] = 'LS-Connect-Updater/0.7'
    try {
        if ([string]$FileEntry.encoding -eq 'base64') {
            $text = $wc.DownloadString($uri).Trim()
            return [Convert]::FromBase64String($text)
        }
        return $wc.DownloadData($uri)
    } finally { $wc.Dispose() }
}

function Apply-LsConnectUpdate([string]$ExpectedVersion) {
    $latest = Get-RemoteJson $UpdateSource
    if ([string]::IsNullOrWhiteSpace([string]$latest.version)) { throw 'Ungültige Versionsdatei.' }
    if ($ExpectedVersion -and $ExpectedVersion -ne [string]$latest.version) { throw 'Die angebotene Version hat sich geändert. Bitte erneut nach Updates suchen.' }
    if ((Compare-Version ([string]$latest.version) $LocalVersion) -le 0) {
        return @{ status='current'; version=$LocalVersion; updated=$false }
    }
    if ([string]::IsNullOrWhiteSpace([string]$latest.manifest_url)) { throw 'Das Updatepaket wurde noch nicht veröffentlicht.' }

    $manifest = Get-RemoteJson ([string]$latest.manifest_url)
    if ([string]$manifest.version -ne [string]$latest.version) { throw 'Versionsdatei und Updatepaket stimmen nicht überein.' }
    if ([int]$manifest.protocol -gt $UpdaterProtocol) { throw 'Dieses Update benötigt zuerst einen neueren LS-Connect-Updater.' }

    $stageRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("ls-connect-stage-" + [Guid]::NewGuid().ToString('N'))
    $backupBase = Join-Path (Split-Path $Root -Parent) '.lsconnect-backups'
    $backupRoot = Join-Path $backupBase ("v$LocalVersion-" + (Get-Date -Format 'yyyyMMdd-HHmmss'))
    New-Item -ItemType Directory -Force -Path $stageRoot,$backupRoot | Out-Null
    $prepared = @()
    $changed = @()

    try {
        foreach ($entry in @($manifest.files)) {
            $relative = [string]$entry.path
            if ($PreservedFiles -contains $relative.Replace('\','/').ToLowerInvariant()) { continue }
            $target = Get-SafeTargetPath $relative
            $bytes = Get-UpdateBytes $entry
            $actualHash = Get-Sha256 $bytes
            $expectedHash = ([string]$entry.sha256).ToLowerInvariant()
            if ($actualHash -ne $expectedHash) { throw "SHA-256-Prüfung fehlgeschlagen: $relative" }
            $stageFile = Join-Path $stageRoot ($relative.Replace('/',[System.IO.Path]::DirectorySeparatorChar))
            New-Item -ItemType Directory -Force -Path (Split-Path $stageFile -Parent) | Out-Null
            [System.IO.File]::WriteAllBytes($stageFile,$bytes)
            $prepared += [PSCustomObject]@{ Relative=$relative; Target=$target; Stage=$stageFile }
        }

        foreach ($item in $prepared) {
            $backup = Join-Path $backupRoot ($item.Relative.Replace('/',[System.IO.Path]::DirectorySeparatorChar))
            if (Test-Path -LiteralPath $item.Target -PathType Leaf) {
                New-Item -ItemType Directory -Force -Path (Split-Path $backup -Parent) | Out-Null
                Copy-Item -LiteralPath $item.Target -Destination $backup -Force
                $changed += [PSCustomObject]@{ Target=$item.Target; Backup=$backup; Existed=$true }
            } else {
                $changed += [PSCustomObject]@{ Target=$item.Target; Backup=$backup; Existed=$false }
            }
            New-Item -ItemType Directory -Force -Path (Split-Path $item.Target -Parent) | Out-Null
            Copy-Item -LiteralPath $item.Stage -Destination $item.Target -Force
        }

        foreach ($removePath in @($manifest.remove)) {
            $relative = [string]$removePath
            if ($PreservedFiles -contains $relative.Replace('\','/').ToLowerInvariant()) { continue }
            $target = Get-SafeTargetPath $relative
            if (Test-Path -LiteralPath $target -PathType Leaf) {
                $backup = Join-Path $backupRoot ($relative.Replace('/',[System.IO.Path]::DirectorySeparatorChar))
                New-Item -ItemType Directory -Force -Path (Split-Path $backup -Parent) | Out-Null
                Copy-Item -LiteralPath $target -Destination $backup -Force
                $changed += [PSCustomObject]@{ Target=$target; Backup=$backup; Existed=$true }
                Remove-Item -LiteralPath $target -Force
            }
        }

        return @{ status='installed'; version=[string]$latest.version; updated=$true; backup=$backupRoot }
    }
    catch {
        for ($i=$changed.Count-1; $i -ge 0; $i--) {
            $item = $changed[$i]
            try {
                if ($item.Existed -and (Test-Path -LiteralPath $item.Backup -PathType Leaf)) {
                    Copy-Item -LiteralPath $item.Backup -Destination $item.Target -Force
                } elseif (-not $item.Existed -and (Test-Path -LiteralPath $item.Target -PathType Leaf)) {
                    Remove-Item -LiteralPath $item.Target -Force
                }
            } catch { }
        }
        throw
    }
    finally {
        Remove-Item -LiteralPath $stageRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

Write-Host ''
Write-Host '======================================================' -ForegroundColor Cyan
Write-Host ("                 LS CONNECT v$LocalVersion") -ForegroundColor Cyan
Write-Host '======================================================' -ForegroundColor Cyan
Write-Host " Server: http://127.0.0.1:$Port/"
Write-Host ' Dieses Fenster offen lassen, solange LS Connect läuft.'
Write-Host ' Updates können ab v0.7 direkt in LS Connect installiert werden.'
Write-Host ' Zum Beenden: Fenster schließen oder STRG+C.'
Write-Host '======================================================' -ForegroundColor Cyan
Write-Host ''

try {
    while (-not $script:ShouldRestart) {
        $client = $listener.AcceptTcpClient()
        $reader = $null; $stream = $null
        try {
            $client.ReceiveTimeout = 8000; $client.SendTimeout = 15000
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream,[System.Text.Encoding]::UTF8,$false,4096,$true)
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

            $headers = @{}
            while ($true) {
                $line = $reader.ReadLine(); if ($null -eq $line -or $line.Length -eq 0) { break }
                $idx = $line.IndexOf(':')
                if ($idx -gt 0) { $headers[$line.Substring(0,$idx).Trim().ToLowerInvariant()] = $line.Substring($idx+1).Trim() }
            }
            $bodyText = ''
            if ($headers.ContainsKey('content-length')) {
                $length = 0
                if ([int]::TryParse($headers['content-length'],[ref]$length) -and $length -gt 0 -and $length -le 1048576) {
                    $buffer = New-Object char[] $length
                    $read = 0
                    while ($read -lt $length) { $n=$reader.Read($buffer,$read,$length-$read); if($n -le 0){break};$read+=$n }
                    $bodyText = -join $buffer[0..([Math]::Max($read-1,0))]
                }
            }

            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2) { Write-JsonResponse $stream 400 @{error='Bad Request'}; continue }
            $method = $parts[0].ToUpperInvariant(); $headOnly = $method -eq 'HEAD'
            $requestPath = $parts[1].Split('?')[0]
            try { $decodedPath = [System.Uri]::UnescapeDataString($requestPath) } catch { $decodedPath = $requestPath }

            if ($decodedPath -eq '/__lsconnect/update/check' -and ($method -eq 'GET' -or $headOnly)) {
                try {
                    $latest = Get-RemoteJson $UpdateSource
                    $latest | Add-Member -NotePropertyName installed_version -NotePropertyValue $LocalVersion -Force
                    $latest | Add-Member -NotePropertyName updater_protocol -NotePropertyValue $UpdaterProtocol -Force
                    Write-JsonResponse $stream 200 $latest $headOnly
                } catch { Write-JsonResponse $stream 500 @{error=$_.Exception.Message} $headOnly }
                continue
            }
            if ($decodedPath -eq '/__lsconnect/update/apply' -and $method -eq 'POST') {
                try {
                    $expected = $null
                    if ($bodyText) { try { $payload=$bodyText|ConvertFrom-Json;$expected=[string]$payload.expected_version } catch { } }
                    $result = Apply-LsConnectUpdate $expected
                    Write-JsonResponse $stream 200 $result
                } catch { Write-JsonResponse $stream 500 @{error=$_.Exception.Message} }
                continue
            }
            if ($decodedPath -eq '/__lsconnect/update/restart' -and $method -eq 'POST') {
                Write-JsonResponse $stream 200 @{status='restarting';port=$Port}
                $script:ShouldRestart = $true
                continue
            }
            if ($decodedPath -eq '/__lsconnect/health' -and ($method -eq 'GET' -or $headOnly)) {
                Write-JsonResponse $stream 200 @{status='ok';version=$LocalVersion;updater_protocol=$UpdaterProtocol} $headOnly
                continue
            }

            if ($method -ne 'GET' -and -not $headOnly) { Write-JsonResponse $stream 400 @{error='Method Not Allowed'}; continue }
            $relativePath = $decodedPath.TrimStart('/').Replace('/',[System.IO.Path]::DirectorySeparatorChar)
            if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath='index.html' }
            $candidate = [System.IO.Path]::GetFullPath((Join-Path $Root $relativePath))
            if (-not $candidate.StartsWith($RootPrefix,[System.StringComparison]::OrdinalIgnoreCase)) { Write-JsonResponse $stream 400 @{error='Forbidden'} $headOnly; continue }
            if (Test-Path -LiteralPath $candidate -PathType Container) { $candidate=Join-Path $candidate 'index.html' }
            if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) { Write-JsonResponse $stream 404 @{error='Not Found'} $headOnly; continue }
            $bytes=[System.IO.File]::ReadAllBytes($candidate);$mime=Get-MimeType $candidate;$fileName=[System.IO.Path]::GetFileName($candidate).ToLowerInvariant()
            $cacheControl=if($fileName -in @('sw.js','version.json','index.html')){'no-cache, no-store, must-revalidate'}else{'no-cache'}
            Write-Response $stream 200 'OK' $mime $bytes $headOnly $cacheControl
        }
        catch {
            try { if($null-ne$stream -and $stream.CanWrite){Write-JsonResponse $stream 500 @{error='Internal Server Error'}} } catch { }
        }
        finally {
            if($null-ne$reader){$reader.Dispose()};if($null-ne$stream){$stream.Dispose()};$client.Close()
        }
    }
}
finally {
    $listener.Stop()
    if ($script:ShouldRestart) {
        try {
            $restartFile = Join-Path ([System.IO.Path]::GetTempPath()) ("ls-connect-restart-" + [Guid]::NewGuid().ToString('N') + '.ps1')
            $serverPath = (Join-Path $Root 'LS-Connect-Server.ps1').Replace("'","''")
            $restartCode = "Start-Sleep -Milliseconds 900`r`nRemove-Item -LiteralPath `$MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue`r`n& '$serverPath' -Port $Port`r`n"
            [System.IO.File]::WriteAllText($restartFile,$restartCode,[System.Text.Encoding]::UTF8)
            Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$restartFile`""
        } catch {
            Write-Host "[LS Connect] Automatischer Neustart fehlgeschlagen: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}
