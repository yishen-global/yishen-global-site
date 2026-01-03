$root = "J:\Yishen-Mothership"
$forge = "$root\forge"
$countries = "$root\countries"

$template = "$forge\country-template.html"
if (!(Test-Path $template)) {
  Write-Host "Missing template. Run forge_global.ps1 first." -ForegroundColor Red
  exit
}

$matrix = @{
  us="United States"; mx="Mexico"; ca="Canada"; br="Brazil"; cl="Chile"; pe="Peru"; co="Colombia"; ar="Argentina";
  eu="European Union"; de="Germany"; fr="France"; it="Italy"; es="Spain"; uk="United Kingdom";
  sa="Saudi Arabia"; ae="United Arab Emirates"; eg="Egypt"; tr="Turkey";
  jp="Japan"; kr="South Korea"; vn="Vietnam"; th="Thailand"; id="Indonesia"; my="Malaysia"; ph="Philippines"; sg="Singapore";
  au="Australia"; nz="New Zealand"; in="India"; pk="Pakistan"; za="South Africa"; ng="Nigeria"; ke="Kenya"
}

New-Item -ItemType Directory -Force -Path $countries | Out-Null

foreach ($c in $matrix.Keys) {
  $dir = "$countries\$c"
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $html = (Get-Content $template -Raw).Replace("{{COUNTRY}}",$matrix[$c])
  Set-Content "$dir\index.html" $html -Encoding UTF8
  Write-Host "IGNITED $c → countries\$c"
}

Write-Host "GLOBAL COUNTRY MATRIX DEPLOYED" -ForegroundColor Green
