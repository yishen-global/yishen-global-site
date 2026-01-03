$taskName = "YiShen_Mexico_TITAN_24x7"
$action = New-ScheduledTaskAction -Execute "python" -Argument "J:\YiShen-Mothership\agents\HUNTER_ENGINE\tools\loop_runner.py loop_mexico_titan.json"
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -RunLevel Highest -Force
Start-ScheduledTask -TaskName $taskName
