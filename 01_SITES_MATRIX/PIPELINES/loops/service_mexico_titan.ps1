# ==========================================================
# YiShen Sovereignty Node — Service Wrapper
# Service: MEXICO · TITAN (24x7)
# File: service_mexico_titan.ps1
# ==========================================================

$ErrorActionPreference = "Stop"

# ---- Paths (edit only if your root changes) ----
$MOTHERSHIP = "J:\YiShen-Mothership"
$ENGINE     = Join-Path $MOTHERSHIP "agents\HUNTER_ENGINE"
$LOOPS      = Join-Path $MOTHERSHIP "services\loops"

$LOOP_SCRIPT = Join-Path $LOOPS "start_mexico_titan_loop.ps1"

# Logs
$LOGDIR = Join-Path $ENGINE "logs"
if (!(Test-Path $LOGDIR)) { New-Item -ItemType Directory -Path $LOGDIR | Out-Null }

$LOG = Join-Path $LOGDIR ("service_mexico_titan_{0}.log" -f (Get-Date -Format "yyyyMMdd"))

function Write-Log($msg) {
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
  $line | Tee-Object -FilePath $LOG -Append | Out-Null
}

# ---- Preflight ----
Write-Log "=== START SERVICE: MEXICO TITAN ==="
Write-Log "ENGINE=$ENGINE"
Write-Log "LOOPS=$LOOPS"
Write-Log "LOOP_SCRIPT=$LOOP_SCRIPT"

if (!(Test-Path $ENGINE))     { throw "ENGINE path not found: $ENGINE" }
if (!(Test-Path $LOOPS))      { throw "LOOPS path not found: $LOOPS" }
if (!(Test-Path $LOOP_SCRIPT)){ throw "Loop script not found: $LOOP_SCRIPT" }

# ---- Service Loop ----
$BackoffSeconds = 10
$MaxBackoff     = 120

while ($true) {
  try {
    Write-Log "Launching loop..."
    Set-Location $ENGINE

    # Start the loop in this same console context (foreground)
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $LOOP_SCRIPT 2>&1 |
      ForEach-Object { Write-Log $_ }

    # If loop exits (shouldn't), treat as crash and restart
    Write-Log "Loop exited unexpectedly. Restarting in $BackoffSeconds seconds..."
  }
  catch {
    Write-Log ("ERROR: " + $_.Exception.Message)
    Write-Log "Restarting in $BackoffSeconds seconds..."
  }

  Start-Sleep -Seconds $BackoffSeconds
  if ($BackoffSeconds -lt $MaxBackoff) {
    $BackoffSeconds = [Math]::Min($BackoffSeconds * 2, $MaxBackoff)
  }
}
