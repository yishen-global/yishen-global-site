$root = "J:\Yishen-Mothership"
$countries = "$root\countries"
$rulesPath = "$root\autoquote_rules.json"

if (!(Test-Path $rulesPath)) {
  Write-Host "Missing autoquote_rules.json" -ForegroundColor Red
  exit
}

$rules = Get-Content $rulesPath -Raw | ConvertFrom-Json

Get-ChildItem $countries -Directory | ForEach-Object {
  $code = $_.Name
  $file = "$($_.FullName)\index.html"
  if (!(Test-Path $file)) { return }

  if (-not $rules.$code) { return }

  $r = $rules.$code
  $block = @"
<section class='quick-quote'>
  <h2>Quick Quote — $code</h2>
  <ul>
    <li><b>MOQ:</b> $($r.MOQ)</li>
    <li><b>Price Range:</b> $($r.Price)</li>
    <li><b>Lead Time:</b> $($r.Lead)</li>
  </ul>
  <p><a href='/contact.html'>Request Official Quotation</a></p>
</section>
"@

  $html = Get-Content $file -Raw
  if ($html -notmatch "quick-quote") {
    $new = $html -replace "</body>", "$block</body>"
    Set-Content $file $new -Encoding UTF8
    Write-Host "Quote block injected: $code"
  }
}
