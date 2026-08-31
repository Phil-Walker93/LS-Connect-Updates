$ErrorActionPreference='Stop'
try {
  $root=Split-Path -Parent $MyInvocation.MyCommand.Path
  $port=$null
  foreach($candidate in 8091..8100){
    try{
      $test=New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback,$candidate)
      $test.Start();$test.Stop();$port=$candidate;break
    }catch{}
  }
  if($null -eq $port){throw 'Kein freier Preview-Port zwischen 8091 und 8100 gefunden.'}
  $prefix="http://localhost:$port/"
  $listener=New-Object System.Net.HttpListener
  $listener.Prefixes.Add($prefix)
  $listener.Start()
  Write-Host "LS Connect RC Preview v0.9.4 läuft auf $prefix"
  Write-Host 'Fenster geöffnet lassen. Beenden mit Strg+C.'
  Start-Process $prefix
  while($listener.IsListening){
    $context=$listener.GetContext()
    $path=$context.Request.Url.AbsolutePath.TrimStart('/')
    if([string]::IsNullOrWhiteSpace($path)){$path='index.html'}
    $file=Join-Path $root $path
    if(-not(Test-Path $file -PathType Leaf)){
      $bytes=[Text.Encoding]::UTF8.GetBytes('Not Found')
      $context.Response.StatusCode=404
      $context.Response.ContentType='text/plain; charset=utf-8'
    }else{
      $bytes=[IO.File]::ReadAllBytes($file)
      switch([IO.Path]::GetExtension($file).ToLowerInvariant()){
        '.html'{$context.Response.ContentType='text/html; charset=utf-8'}
        '.js'{$context.Response.ContentType='application/javascript; charset=utf-8'}
        '.css'{$context.Response.ContentType='text/css; charset=utf-8'}
        default{$context.Response.ContentType='application/octet-stream'}
      }
      $context.Response.StatusCode=200
    }
    $context.Response.Headers['Cache-Control']='no-store, max-age=0'
    $context.Response.Headers['X-LS-Connect-Preview']='0.9.4'
    $context.Response.ContentLength64=$bytes.Length
    $context.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $context.Response.OutputStream.Close()
  }
}catch{
  Write-Host ''
  Write-Host ('FEHLER: '+$_.Exception.Message) -ForegroundColor Red
  Read-Host 'Enter drücken, um das Fenster zu schließen'
  exit 1
}finally{
  if($listener){try{$listener.Stop();$listener.Close()}catch{}}
}
