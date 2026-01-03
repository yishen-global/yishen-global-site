$KEY = "4f8c1a9d0b2347b9a1c0d9e8f7a6b5c4"
$KEY_LOCATION = "https://yishenglobal.net/4f8c1a9d0b2347b9a1c0d9e8f7a6b5c4.txt"

$urls = @(
  "https://yishenglobal.net/",
  "https://yishenglobal.net/world/saudi/"
)

$body = @{
    host = "yishenglobal.net"
    key = $KEY
    keyLocation = $KEY_LOCATION
    urlList = $urls
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post `
  -Uri "https://api.indexnow.org/indexnow" `
  -ContentType "application/json; charset=utf-8" `
  -Body $body

Write-Host "IndexNow 推送完成"
