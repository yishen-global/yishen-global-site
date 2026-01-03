$root = "J:\YiShen-Mothership\public\world"

function BuildContent($country,$city,$sku){
  $product = ($sku -replace "-"," ")
  return @"
<h2>$product in $city, $country</h2>
<p>YiShen Global provides $product solutions for buyers and distributors in $city, $country. 
We support OEM/ODM customization, low MOQ, predictable lead time, and DDP delivery options.</p>

<p>Our factory-direct supply covers ergonomic office chairs, gaming chairs, standing desks, and project furniture. 
Importers in $city rely on YiShen Global for compliance-ready documents, stable packaging, and transparent production milestones.</p>

<h3>Why buyers in $city choose YiShen Global</h3>
<ul>
<li>Factory direct pricing</li>
<li>Custom branding and OEM support</li>
<li>Fast DDP delivery</li>
<li>Low MOQ and sample programs</li>
</ul>

<h3>Frequently searched keywords</h3>
<p>
$product $city<br>
$product supplier $country<br>
$product wholesale $city<br>
$product oem $country<br>
$product distributor $city
</p>

<h3>Contact</h3>
<p>Email: alex.yang@yishenglobal.net</p>
"@
}

Get-ChildItem "$root" -Directory | ForEach-Object {
  $country = $_.Name
  $citiesPath = "$root\$country\cities"
  if(!(Test-Path $citiesPath)){ return }

  Get-ChildItem $citiesPath -Directory | ForEach-Object {
    $city = $_.Name

    Get-ChildItem $_.FullName -Directory | ForEach-Object {
      $sku = $_.Name
      $file = Join-Path $_.FullName "index.html"

      if(Test-Path $file){
        $old = Get-Content $file -Raw
        if($old -notmatch "Frequently searched keywords"){
          $inject = BuildContent $country $city $sku
          $new = $old -replace "</body>","$inject`n</body>"
          Set-Content -Encoding UTF8 $file $new
          Write-Host "✓ injected:" $file
        }
      }
    }
  }
}
