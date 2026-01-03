$root = "J:\YiShen-Mothership\public\world"

# 核心产品 SKU + 采购意图
$INTENT_SKU = @(
  "office-chair-buyers",
  "office-chair-wholesale",
  "office-chair-oem",
  "gaming-chair-distributors",
  "gaming-chair-wholesale",
  "standing-desk-oem",
  "standing-desk-wholesale",
  "ergonomic-chair-supplier",
  "recliner-chair-oem",
  "mesh-chair-manufacturer"
)

# 所有国家（自动扫描你现有 world 目录）
$countries = Get-ChildItem $root -Directory | Select-Object -ExpandProperty Name

function WritePage($path,$title,$h1){
$html = @"
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>$title</title>
<meta name="description" content="$h1 YiShen Global buyer intent radar">
</head>
<body>
<h1>$h1</h1>
<p>YiShen Global official buyer intent gateway.</p>
<p>Contact: alex.yang@yishenglobal.net</p>
</body>
</html>
"@
$html | Set-Content -Encoding UTF8 $path
}

foreach($country in $countries){
  $citiesPath = "$root\$country\cities"
  if(!(Test-Path $citiesPath)){ continue }

  Get-ChildItem $citiesPath -Directory | ForEach-Object {
    $city = $_.Name
    $cityRoot = $_.FullName

    foreach($sku in $INTENT_SKU){
      $dir = Join-Path $cityRoot $sku
      mkdir $dir -Force | Out-Null
      $file = Join-Path $dir "index.html"

      $title = "$country $city $sku | YiShen Global"
      $h1 = "$country $city $sku"

      WritePage $file $title $h1
      Write-Host "🔥 intent page:" $file
    }
  }
}
