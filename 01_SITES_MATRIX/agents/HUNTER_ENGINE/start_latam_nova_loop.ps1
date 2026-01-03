$env:TARGET_COUNTRY="LATAM"
$env:LOCK_SKU="NOVA"
$env:MAIN_PRODUCT="gaming chair"
$env:TARGET_ROLE="B2B"

while ($true) {
    python core\hunter.py
    Start-Sleep -Seconds 150
}
