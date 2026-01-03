$rules = @{
  "us"  = @{ MOQ=100; Price="$149-$299"; Lead="7-15 days" }
  "mx"  = @{ MOQ=120; Price="$139-$289"; Lead="7-20 days" }
  "br"  = @{ MOQ=150; Price="$129-$269"; Lead="10-25 days" }
  "eu"  = @{ MOQ=80;  Price="€159-€329"; Lead="7-15 days" }
  "ae"  = @{ MOQ=100; Price="$169-$349"; Lead="7-12 days" }
  "sa"  = @{ MOQ=120; Price="$159-$329"; Lead="7-15 days" }
  "jp"  = @{ MOQ=60;  Price="¥18,900-¥39,000"; Lead="7-10 days" }
}

$rules | ConvertTo-Json -Depth 5 | Set-Content J:\Yishen-Mothership\autoquote_rules.json -Encoding UTF8
Write-Host "AUTOQUOTE CORE DEPLOYED"
