$base = "J:\YiShen-Mothership\agents\HUNTER_ENGINE"
$ps = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$st = "$env:SystemRoot\System32\schtasks.exe"

$mx = "$base\services\start_mexico_titan_loop.ps1"
$la = "$base\services\start_latam_nova_loop.ps1"
$ex = "$base\services\start_latam_export.ps1"

& $st /Create /F /SC ONSTART /RU SYSTEM /RL HIGHEST /TN "YiShen_MEXICO_TITAN_24x7" `
 /TR "`"$ps`" -ExecutionPolicy Bypass -File `"$mx`""

& $st /Create /F /SC ONSTART /RU SYSTEM /RL HIGHEST /TN "YiShen_LATAM_NOVA_24x7" `
 /TR "`"$ps`" -ExecutionPolicy Bypass -File `"$la`""

& $st /Create /F /SC DAILY /ST 02:00 /RU SYSTEM /RL HIGHEST /TN "YiShen_LATAM_EXPORT_DAILY_0200" `
 /TR "`"$ps`" -ExecutionPolicy Bypass -File `"$ex`""

Write-Host "Tasks installed"
