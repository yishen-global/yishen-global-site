# ==========================================================
# YiShen Sovereignty Node — Service Wrapper
# Service: LATAM · EXPORT (Daily / OnDemand / Resilient)
# File: service_latam_export.ps1
# ==========================================================

$ErrorActionPreference = "Stop"

# ---- Paths ----
$MOTHERSHIP = "J:\YiShen-Mothership"
$ENGINE     = Join-Path $MOTHERSHIP "agents\HUNTER_ENGINE"
$LOOPS      = Join-Path $MOTHERSHIP "services\loops"

$EXPORT_SCRIPT = Join-Path $LOOPS "start_latam_export.ps1"

# Logs
$LOGDIR = Join-Path $ENGINE "logs"
if (!(Test-Path $LOGDIR)) { New-Item -ItemType Directory -Path $LOGDIR | Out-Null }

$LOG = Join-Path $LOGDIR ("service_latam_export_{0}.log" -f (Get-Date -Format "yyyyMMdd"))

function Write-Log($msg) {
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
  $line | Tee-Object -FilePath $LOG -Append | Out-Null
}

# ---- Preflight ----
Write-Log "=== START SERVICE: LATAM EXPORT ==="
Write-Log "ENGINE=$ENGINE"
Write-Log "LOOPS=$LOOPS"
Write-Log "EXPORT_SCRIPT=$EXPORT_SCRIPT"

if (!(Test-Path $ENGINE))       { throw "ENGINE path not found: $ENGINE" }
if (!(Test-Path $LOOPS))        { throw "LOOPS path not found: $LOOPS" }
if (!(Test-Path $EXPORT_SCRIPT)){ throw "Export script not found: $EXPORT_SCRIPT" }

# ---- Export Service Loop ----
# 这是一个“周期型守护器”，每天02:00跑一次；若异常崩溃，自动补偿重试

$RunHour = 2          # 02:00 AM
$RetryDelay = 300     # 失败后 5 分钟重试
$SleepGranularity = 60

while ($true) {

  try {
    $now = Get-Date
    $todayRun = Get-Date -Hour $RunHour -Minute 0 -Second 0

    if ($now -gt $todayRun) {
      $nextRun = $todayRun.AddDays(1)
    } else {
      $nextRun = $todayRun
    }

    $wait = [int]($nextRun - $now).TotalSeconds
    Write-Log "Next export scheduled at $nextRun (wait ${wait}s)"

    while ($wait -gt 0) {
      Start-Sleep -Seconds $SleepGranularity
      $wait -= $SleepGranularity
    }

    Write-Log "Launching EXPORT job..."
    Set-Location $ENGINE

    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $EXPORT_SCRIPT 2>&1 |
      ForEach-Object { Write-Log $_ }

    Write-Log "EXPORT job finished."

  }
  catch {
    Write-Log ("EXPORT ERROR: " + $_.Exception.Message)
    Write-Log "Retrying in $RetryDelay seconds..."
    Start-Sleep -Seconds $RetryDelay
  }
}
