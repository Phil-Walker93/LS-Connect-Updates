$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$production = 'https://ls-connect-online.vercel.app'
$port = $null

foreach ($candidate in 8091..8100) {
  try {
    $test = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $candidate)
    $test.Start()
    $test.Stop()
    $port = $candidate
    break
  } catch {}
}

if ($null -eq $port) { throw 'Kein freier Preview-Port zwischen 8091 und 8100 gefunden.' }
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "LS Connect RC Preview v0.9.3 läuft auf $prefix"
Write-Host '/api/script wird an die bestehende Production weitergeleitet.'
Start-Process $prefix

function Write-Response($context, [byte[]]$bytes, [int]$status, [string]$contentType) {
  $context.Response.StatusCode = $status
  $context.Response.ContentType = $contentType
  $context.Response.Headers['Cache-Control'] = 'no-store, max-age=0'
  $context.Response.Headers['X-LS-Connect-Preview'] = '0.9.3'
  $context.Response.ContentLength64 = $bytes.Length
  $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $context.Response.OutputStream.Close()
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $absolutePath = $context.Request.Url.AbsolutePath

    if ($absolutePath -eq '/api/script') {
      try {
        $target = $production + $absolutePath + $context.Request.Url.Query
        $client = New-Object System.Net.WebClient
        $client.Headers['User-Agent'] = 'LS-Connect-RC-Preview/0.9.3'
        $client.Headers['Cache-Control'] = 'no-cache'
        $bytes = $client.DownloadData($target)
        $contentType = $client.ResponseHeaders['Content-Type']
        if ([string]::IsNullOrWhiteSpace($contentType)) { $contentType = 'application/javascript; charset=utf-8' }
        $context.Response.Headers['X-LS-Preview-Proxied'] = 'production-api-script'
        Write-Response $context $bytes 200 $contentType
      } catch {
        $bytes = [Text.Encoding]::UTF8.GetBytes("Preview-Proxy konnte Production nicht erreichen: $($_.Exception.Message)")
        Write-Response $context $bytes 502 'text/plain; charset=utf-8'
      }
      continue
    }

    $path = $absolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
    $file = Join-Path $root $path
    if (-not (Test-Path $file -PathType Leaf)) {
      $bytes = [Text.Encoding]::UTF8.GetBytes('Not Found')
      Write-Response $context $bytes 404 'text/plain; charset=utf-8'
      continue
    }

    $bytes = [IO.File]::ReadAllBytes($file)
    switch ([IO.Path]::GetExtension($file).ToLowerInvariant()) {
      '.html' { $contentType = 'text/html; charset=utf-8' }
      '.js'   { $contentType = 'application/javascript; charset=utf-8' }
      '.css'  { $contentType = 'text/css; charset=utf-8' }
      default { $contentType = 'application/octet-stream' }
    }
    Write-Response $context $bytes 200 $contentType
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
