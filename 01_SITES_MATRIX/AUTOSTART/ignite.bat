@echo off
cd /d J:\YiShen-Mothership\PIPELINES\loops
for %%f in (*.ps1) do (
  powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File "%%f"
)
