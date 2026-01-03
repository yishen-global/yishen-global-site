param($cmd,$region)

if($cmd -ne "all"){ Write-Host "Usage: ignite all latam|mena|eu|asean|japan"; exit }

$zones = @{
  "latam" = @("mx","br","cl","pe","co","ar")
  "mena"  = @("sa","ae","eg","ma","qa","kw")
  "eu"    = @("de","fr","it","es","nl","pl")
  "asean" = @("sg","th","vn","ph","id","my")
  "japan" = @("jp")
}

$pages = @("index","solutions","why-us","resources","contact")

foreach($c in $zones[$region]){
  $root = "countries\$c"
  mkdir $root -ea 0 | Out-Null
  foreach($p in $pages){
    $file="$root\$p.html"
    $title="$($c.ToUpper()) – $p"
    $html=@"
<!DOCTYPE html><html><head><meta charset='utf-8'><title>$title</title></head>
<body><h1>$title</h1><p>Node online.</p></body></html>
"@
    Set-Content $file $html -Encoding UTF8
  }
  Write-Host "IGNITED: $c -> $root"
}
