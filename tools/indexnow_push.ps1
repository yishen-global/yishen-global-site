$KEY = "yishen-global-2026-master-key"
$SITE = "https://yishenglobal.net"
$ROOT = "J:\YiShen-Mothership\public"

$urls = Get-ChildItem $ROOT -Recurse -Filter index.html | ForEach-Object {
    $_.FullName.Replace($ROOT,"").Replace("\","/")
}

foreach($u in $urls){
    $url = "$SITE$u".Replace("/index.html","/")
    Write-Host "→ pushing $url"

    Invoke-RestMethod -Uri "https://api.indexnow.org/indexnow" `
      -Method Post `
      -ContentType "application/json" `
      -Body (@{
          host = "yishenglobal.net"
          key  = $KEY
          keyLocation = "$SITE/indexnow-key.txt"
          urlList = @($url)
      } | ConvertTo-Json -Depth 3)
}
