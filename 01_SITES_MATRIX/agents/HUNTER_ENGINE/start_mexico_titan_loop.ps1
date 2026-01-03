$env:TARGET_COUNTRY="MEXICO"
$env:LOCK_SKU="TITAN"
$env:MAIN_PRODUCT="gaming chair"
$env:TARGET_ROLE="B2B"

while ($true) {
    python core\hunter.py
    Start-Sleep -Seconds 120
}
