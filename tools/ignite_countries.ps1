$root = "J:\YiShen-Mothership\public\world"

$regions = @{
  eu = @("germany","france","italy","spain","poland","netherlands","sweden")
  usa = @("usa","canada","mexico")
  latam = @("brazil","chile","peru","colombia","argentina")
  gcc = @("saudi","uae","qatar","kuwait","oman")
}

$pages = @("index","buyers","products","compliance","pricing")

foreach($r in $regions.Keys){
  foreach($c in $regions[$r]){
    foreach($p in $pages){
      $dir = "$root\$c\$p"
      mkdir $dir -Force | Out-Null
      $file = "$dir\index.html"
      "<html><head><title>$c $p | YiShen Global</title><meta name='description' content='YiShen Global $c $p portal'></head><body><h1>$c $p Hub</h1></body></html>" | Set-Content $file
    }

    $sitemap = "$root\$c\sitemap.xml"
    $urls = ""
    foreach($p in $pages){
      $urls += "<url><loc>https://yishenglobal.net/world/$c/$p/</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`n"
    }
    "<?xml version='1.0' encoding='UTF-8'?><urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>$urls</urlset>" | Set-Content $sitemap
  }
}
