$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8091
$prefix = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "LS Connect RC Preview läuft auf $prefix"
Start-Process $prefix

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = $context.Request.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
    $file = Join-Path $root $path
    if (-not (Test-Path $file -PathType Leaf)) {
      $context.Response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes('Not Found')
    } else {
      $bytes = [IO.File]::ReadAllBytes($file)
      switch ([IO.Path]::GetExtension($file).ToLowerInvariant()) {
        '.html' { $context.Response.ContentType = 'text/html; charset=utf-8' }
        '.js'   { $context.Response.ContentType = 'application/javascript; charset=utf-8' }
        '.css'  { $context.Response.ContentType = 'text/css; charset=utf-8' }
        default { $context.Response.ContentType = 'application/octet-stream' }
      }
      $context.Response.StatusCode = 200
    }
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $context.Response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
