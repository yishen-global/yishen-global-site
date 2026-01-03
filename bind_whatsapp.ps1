$root = "J:\Yishen-Mothership\countries"
$btn = "<div class='whatsapp'><a href='https://wa.me/86138XXXXXXX?text=Hello%20LEISA%20{{COUNTRY}}%20Distributor%20Request' target='_blank'>💬 WhatsApp Distributor Request</a></div>"

Get-ChildItem $root -Directory | ForEach-Object {
  $file = "$($_.FullName)\index.html"
  if (Test-Path $file) {
    $html = Get-Content $file -Raw
    if ($html -notmatch "wa.me") {
      $new = $html -replace "</body>", "$($btn.Replace('{{COUNTRY}}',$_.Name))</body>"
      Set-Content $file $new -Encoding UTF8
      Write-Host "WhatsApp bound: $_"
    }
  }
}
