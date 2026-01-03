Write-Host "FINAL CLEAN GO LIVE"

Get-ChildItem *.html | ForEach-Object {
 $c=Get-Content $_.Name -Raw
 if($c -notmatch "ignite-net.js"){
  $c=$c -replace "</body>","<script src='/public/ignite-net.js'></script>`n</body>"
 }
 if($_.Name -eq "contact.html" -and $c -notmatch "attack.js"){
  $c=$c -replace "</body>","<script src='/public/attack.js'></script>`n</body>"
 }
 Set-Content $_.Name $c -Encoding UTF8
}

Write-Host "🔥 CLEAN GO LIVE COMPLETE"
