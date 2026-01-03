@echo off
echo === Installing YiShen TITAN Sovereignty Node ===

set ROOT=J:\YiShen-Mothership\services
set PS=C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe

sc create YISHEN_TITAN binPath= "\"%PS%\" -ExecutionPolicy Bypass -File \"%ROOT%\service_mexico_titan.ps1\"" start= auto
sc description YISHEN_TITAN "YiShen Global Sovereignty Hunter Node - Mexico TITAN"

net start YISHEN_TITAN

echo.
echo TITAN NODE INSTALLED AND STARTED.
pause
