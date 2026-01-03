$root = "J:\YiShen-Mothership\public"
$script = "J:\YiShen-Mothership\flywheel\indexnow_push.ps1"

Write-Host "YiShen Global Auto Broadcast Engine ONLINE..."

$fsw = New-Object IO.FileSystemWatcher $root, "*.*"
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true

Register-ObjectEvent $fsw "Changed" -Action {
    Write-Host "Detected change, broadcasting to global engines..."
    & $script
}

Register-ObjectEvent $fsw "Created" -Action {
    Write-Host "New page detected, broadcasting..."
    & $script
}
