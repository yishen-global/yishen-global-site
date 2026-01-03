Write-Host ""
Write-Host "===============================" -ForegroundColor Cyan
Write-Host "   YISHEN GLOBAL MOTHERSHIP     " -ForegroundColor Green
Write-Host "   GLOBAL GO LIVE SEQUENCE     " -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Cyan

$domains = @(
  "yishenglobal.net",
  "www.yishenglobal.net",
  "yishen.ai",
  "www.yishen.ai"
)

foreach ($d in $domains) {
    Write-Host "PING $d ..." -ForegroundColor Yellow
    try {
        Test-Connection $d -Count 1 -Quiet | Out-Host
    } catch {
        Write-Host "FAILED $d" -ForegroundColor Red
    }
}

# 强制生成 sitemap ping
$pingUrls = @(
 "https://www.google.com/ping?sitemap=https://yishenglobal.net/sitemap.xml",
 "https://www.google.com/ping?sitemap=https://yishen.ai/sitemap.xml",
 "https://www.bing.com/ping?sitemap=https://yishenglobal.net/sitemap.xml",
 "https://www.bing.com/ping?sitemap=https://yishen.ai/sitemap.xml"
)

foreach ($u in $pingUrls) {
  Write-Host "PING SEARCH ENGINE:" $u -ForegroundColor Cyan
  try {
    Invoke-WebRequest $u -UseBasicParsing | Out-Null
  } catch {}
}

Write-Host ""
Write-Host "GLOBAL GO LIVE COMPLETE" -ForegroundColor Green
Write-Host ""
