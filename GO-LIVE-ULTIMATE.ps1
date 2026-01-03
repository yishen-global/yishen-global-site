Write-Host ""
Write-Host "===== YISHEN GLOBAL MASTER GO LIVE =====" -ForegroundColor Cyan

$domains = @("yishenglobal.net","yishen.ai")

foreach($d in $domains){
    Write-Host "PING $d ..."
    Test-Connection $d -Count 1 -Quiet | Out-Host
}

# 自动补 robots.txt
$robots = @"
User-agent: *
Allow: /
Sitemap: https://yishenglobal.net/sitemap.xml
Sitemap: https://yishen.ai/sitemap.xml
"@
$robots | Out-File J:\yishensite\public\robots.txt -Encoding utf8

# 自动补 sitemap
$urls = Get-ChildItem J:\yishensite\public -Filter *.html | ForEach-Object {
    "<url><loc>https://yishenglobal.net/$($_.Name)</loc></url>"
}

$map = "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>" + ($urls -join "") + "</urlset>"
$map | Out-File J:\yishensite\public\sitemap.xml -Encoding utf8

# 自动插入全站点火JS
$ignite = "<script src='/js/ignite-net.js'></script>"
Get-ChildItem J:\yishensite\public -Filter *.html | ForEach-Object {
    (Get-Content $_) -replace "</body>", "$ignite</body>" | Set-Content $_
}

# 写入主权信号
$signal = "GLOBAL_SOVEREIGN_SIGNAL=" + (Get-Date)
$signal | Out-File J:\yishensite\public\__signal.txt

# 全网点火探针
Invoke-WebRequest "https://www.google.com/ping?sitemap=https://yishenglobal.net/sitemap.xml"
Invoke-WebRequest "https://www.bing.com/ping?sitemap=https://yishenglobal.net/sitemap.xml"

Write-Host ""
Write-Host "🔥🔥🔥 GLOBAL GO LIVE COMPLETE 🔥🔥🔥" -ForegroundColor Green
