$base = "J:\YiShen-Mothership\agents\HUNTER_ENGINE"
Set-Location $base
python core\export_leads.py >> logs\latam_export.log 2>&1
