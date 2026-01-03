# =========================================================
# YiShen Global — World Sovereignty Node Generator
# Output:
#   /public/world/{node}/index.html
#   /public/world/index.html
#   /public/sitemap-world.xml
#   /public/sitemap.xml   (sitemap index)
#   /public/robots.txt
#   /public/vercel.json   (optional but recommended)
# =========================================================

$Root = "J:\YiShen-Mothership"
$Public = Join-Path $Root "public"
$WorldDir = Join-Path $Public "world"

# --- Configure domain ---
$Domain = "https://yishenglobal.net"

# --- Define node groups (you can expand freely) ---
# EU / USA / LATAM / GCC (and extras if you want)
$Nodes = @(
  "eu",
  "usa",
  "latam",
  "gcc"
)

# --- Node metadata (title/keywords) ---
$Meta = @{
  "eu"    = @{ Title="EU Supply Chain Sovereignty"; Desc="EU node: compliance-ready industrial supply chain, furniture & materials sourcing, predictable DDP execution."; Keywords="EU procurement, EPD, CE, FSC, office furniture, supply chain, DDP" }
  "usa"   = @{ Title="USA Supply Chain Sovereignty"; Desc="USA node: predictable import execution, furniture & industrial materials, DDP and compliance-first delivery."; Keywords="USA importer, procurement, office chairs, standing desks, DDP, supply chain" }
  "latam" = @{ Title="LATAM Supply Chain Sovereignty"; Desc="LATAM node: regional distribution-ready SKUs, predictable lead times, multi-country import execution."; Keywords="LATAM distributors, Mexico, Brazil, Chile, procurement, DDP" }
  "gcc"   = @{ Title="GCC Supply Chain Sovereignty"; Desc="GCC node: Saudi/UAE-focused import execution, heat-resistant specs, fast replenishment, predictable clearance."; Keywords="GCC, Saudi, UAE, procurement, furniture, flooring, DDP" }
}

# --- Ensure dirs ---
if (!(Test-Path $Public)) { throw "Public directory not found: $Public" }
if (!(Test-Path $WorldDir)) { New-Item -ItemType Directory -Path $WorldDir | Out-Null }

# --- Template builder ---
function New-NodeHtml($node, $title, $desc, $keywords) {
@"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>$title | YiShen Global</title>
  <meta name="description" content="$desc" />
  <meta name="keywords" content="$keywords" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="$Domain/world/$node/" />

  <meta property="og:title" content="$title | YiShen Global" />
  <meta property="og:description" content="$desc" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="$Domain/world/$node/" />

  <style>
    :root { --bg:#050b17; --panel:rgba(255,255,255,0.06); --text:#eaf1ff; --muted:rgba(234,241,255,0.72); --accent:#0ea5e3; }
    body { margin:0; font-family: Inter, Arial, sans-serif; background:var(--bg); color:var(--text); }
    .wrap { max-width: 980px; margin: 0 auto; padding: 56px 20px 80px; }
    .badge { display:inline-block; padding:8px 12px; border:1px solid rgba(255,255,255,0.12); border-radius:999px; background:rgba(255,255,255,0.04); color:var(--muted); font-size:12px; }
    h1 { margin:14px 0 10px; font-size: 34px; line-height: 1.15; }
    p { margin:0 0 14px; color:var(--muted); font-size: 15px; line-height:1.7; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:18px; }
    .card { background:var(--panel); border:1px solid rgba(255,255,255,0.10); border-radius:16px; padding:16px; }
    .card h3 { margin:0 0 8px; font-size:14px; color:var(--text); }
    .card ul { margin:0; padding-left:18px; color:var(--muted); font-size:14px; line-height:1.7; }
    .cta { margin-top:18px; display:flex; gap:12px; flex-wrap:wrap; }
    .btn { display:inline-block; padding:10px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.14); background:rgba(255,255,255,0.06); color:var(--text); text-decoration:none; }
    .btn.primary { border-color: rgba(14,165,227,0.55); box-shadow: 0 0 0 3px rgba(14,165,227,0.12) inset; }
    footer { margin-top:26px; color:rgba(234,241,255,0.55); font-size:12px; }
    @media (max-width: 780px) { .grid { grid-template-columns: 1fr; } h1{font-size:28px;} }
  </style>
</head>
<body>
  <div class="wrap">
    <span class="badge">WORLD SOVEREIGNTY NODE · /world/$node/</span>
    <h1>$title</h1>
    <p>$desc</p>

    <div class="grid">
      <div class="card">
        <h3>What we deliver</h3>
        <ul>
          <li>Predictable lead times & transparent milestones</li>
          <li>Compliance-first export documentation</li>
          <li>Category-ready SKUs (Office Chairs · Standing Desks · Materials)</li>
          <li>DDP execution options (region dependent)</li>
        </ul>
      </div>
      <div class="card">
        <h3>Fast qualification</h3>
        <ul>
          <li>Target role: Procurement / Buyer / Distributor</li>
          <li>MOQ flexibility + OEM/ODM customization</li>
          <li>Packaging engineering (drop-test logic)</li>
          <li>Ask for: sample plan, price ladder, compliance pack</li>
        </ul>
      </div>
    </div>

    <div class="cta">
      <a class="btn primary" href="mailto:alex.yang@yishenglobal.net?subject=Node%20Inquiry%20-%20$node">Email: alex.yang@yishenglobal.net</a>
      <a class="btn" href="$Domain/world/">Back to World Hub</a>
      <a class="btn" href="$Domain/sitemap.xml">Sitemap</a>
    </div>

    <footer>
      YiShen Global · Node: $node · Canonical: $Domain/world/$node/
    </footer>
  </div>
</body>
</html>
"@
}

# --- Write each node page ---
foreach ($n in $Nodes) {
  $NodeDir = Join-Path $WorldDir $n
  if (!(Test-Path $NodeDir)) { New-Item -ItemType Directory -Path $NodeDir | Out-Null }

  $title = $Meta[$n].Title
  $desc = $Meta[$n].Desc
  $kw = $Meta[$n].Keywords

  $html = New-NodeHtml -node $n -title $title -desc $desc -keywords $kw
  $out = Join-Path $NodeDir "index.html"
  Set-Content -Path $out -Value $html -Encoding UTF8
  Write-Host "✓ node page:" $out
}

# --- World hub page ---
$hubLinks = ($Nodes | ForEach-Object { "<li><a href='$Domain/world/$_/' style='color:#0ea5e3;text-decoration:none'>/world/$_/</a></li>" }) -join "`n"
$WorldHub = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>World Nodes | YiShen Global</title>
<meta name="description" content="World sovereignty nodes: EU, USA, LATAM, GCC." />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="$Domain/world/" />
<style>
  body{margin:0;background:#050b17;color:#eaf1ff;font-family:Inter,Arial,sans-serif}
  .wrap{max-width:900px;margin:0 auto;padding:56px 20px}
  h1{margin:0 0 10px;font-size:32px}
  p{margin:0 0 18px;color:rgba(234,241,255,0.72);line-height:1.7}
  ul{margin:0;padding-left:18px;line-height:2}
  .btn{display:inline-block;margin-top:18px;padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.06);color:#eaf1ff;text-decoration:none}
</style>
</head>
<body>
<div class="wrap">
  <h1>World Sovereignty Nodes</h1>
  <p>Entry hub for region nodes. Each node is indexable, canonicalized, and included in sitemap.</p>
  <ul>
    $hubLinks
  </ul>
  <a class="btn" href="$Domain/sitemap.xml">View sitemap</a>
</div>
</body>
</html>
"@
Set-Content -Path (Join-Path $WorldDir "index.html") -Value $WorldHub -Encoding UTF8
Write-Host "✓ world hub:" (Join-Path $WorldDir "index.html")

# --- sitemap-world.xml (urlset) ---
$SitemapWorld = @()
$SitemapWorld += '<?xml version="1.0" encoding="UTF-8"?>'
$SitemapWorld += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
$SitemapWorld += "  <url><loc>$Domain/world/</loc><changefreq>daily</changefreq><priority>0.9</priority></url>"
foreach ($n in $Nodes) {
  $SitemapWorld += "  <url><loc>$Domain/world/$n/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>"
}
$SitemapWorld += '</urlset>'
Set-Content -Path (Join-Path $Public "sitemap-world.xml") -Value ($SitemapWorld -join "`n") -Encoding UTF8
Write-Host "✓ sitemap-world.xml written"

# --- sitemap.xml (sitemap index) ---
$SitemapIndex = @"
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>$Domain/sitemap-world.xml</loc>
  </sitemap>
</sitemapindex>
"@
Set-Content -Path (Join-Path $Public "sitemap.xml") -Value $SitemapIndex -Encoding UTF8
Write-Host "✓ sitemap.xml (index) written"

# --- robots.txt ---
$Robots = @"
User-agent: *
Allow: /

Sitemap: $Domain/sitemap.xml
Sitemap: $Domain/sitemap-world.xml
"@
Set-Content -Path (Join-Path $Public "robots.txt") -Value $Robots -Encoding UTF8
Write-Host "✓ robots.txt written"

# --- vercel.json (recommended) ---
$VercelJson = @"
{
  "version": 2,
  "routes": [
    { "src": "^/world$", "dest": "/world/index.html" },
    { "src": "^/world/(eu|usa|latam|gcc)/?$", "dest": "/world/$1/index.html" }
  ]
}
"@
Set-Content -Path (Join-Path $Public "vercel.json") -Value $VercelJson -Encoding UTF8
Write-Host "✓ vercel.json written (public/vercel.json)"

Write-Host "`nDONE. Next: run vercel --prod from J:\YiShen-Mothership"
