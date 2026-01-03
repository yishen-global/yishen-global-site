$st = "$env:SystemRoot\System32\schtasks.exe"
& $st /Query /TN "YiShen_MEXICO_TITAN_24x7"
& $st /Query /TN "YiShen_LATAM_NOVA_24x7"
& $st /Query /TN "YiShen_LATAM_EXPORT_DAILY_0200"
