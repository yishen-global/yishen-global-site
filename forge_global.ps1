$root = "J:\Yishen-Mothership"
$forge = "$root\forge"
New-Item -ItemType Directory -Force -Path $forge | Out-Null

$global = @(
"<!DOCTYPE html>",
"<html lang='en'>",
"<head>",
"<meta charset='UTF-8'>",
"<title>YiShen Global | Sovereign Trade Network</title>",
"<meta name='viewport' content='width=device-width, initial-scale=1'>",
"<link rel='stylesheet' href='../styles.css'>",
"</head>",
"<body>",
"<section class='hero'>",
"<h1>YiShen Global Trade Network</h1>",
"<p>One system. All markets. Sovereign supply chain power.</p>",
"<a href='../contact.html' class='cta'>Request Distribution Access</a>",
"</section>",
"<section class='grid'>",
"<div>North America</div>",
"<div>Europe</div>",
"<div>Middle East</div>",
"<div>LATAM</div>",
"<div>Japan</div>",
"<div>ASEAN</div>",
"</section>",
"<footer>YiShen Global Mothership</footer>",
"</body>",
"</html>"
)

Set-Content "$forge\global.html" ($global -join "`r`n") -Encoding UTF8

$template = @(
"<!DOCTYPE html>",
"<html lang='en'>",
"<head>",
"<meta charset='UTF-8'>",
"<title>{{COUNTRY}} | YiShen Global</title>",
"<link rel='stylesheet' href='../styles.css'>",
"</head>",
"<body>",
"<h1>{{COUNTRY}} Distribution Network</h1>",
"<p>Request access to YiShen sovereign supply channels in {{COUNTRY}}</p>",
"<a href='../contact.html'>Apply Partnership</a>",
"</body>",
"</html>"
)

Set-Content "$forge\country-template.html" ($template -join "`r`n") -Encoding UTF8

Write-Host "GLOBAL FORGE DEPLOYED OK" -ForegroundColor Green
