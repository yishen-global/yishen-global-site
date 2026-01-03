$root = "J:\YiShen-Mothership\public\world"

# 城市雷达：每国 12 个城市（先快起骨架，后续你要 100/300/1000 城市我再升级）
$CITY = @{
  saudi = @("riyadh","jeddah","dammam","khobar","mecca","medina","taif","tabuk","jazan","abha","najran","jubail")
  uae   = @("dubai","abu-dhabi","sharjah","ajman","ras-al-khaimah","fujairah","al-ain","jebel-ali","umm-al-quwain","khor-fakkan","dibba","madinat-zayed")
  qatar = @("doha","al-rayyan","al-wakrah","al-khor","umm-salal","dukhan","lusail","mesaieed","al-daayen","al-shahaniya","ruwais","zubarrah")
  kuwait= @("kuwait-city","hawalli","salmiya","farwaniya","jahra","mubarak-al-kabeer","shuwaikh","fahaheel","mangaf","sabah-al-salem","sharq","abdullah-al-salem")
  oman  = @("muscat","seeb","salalah","sohar","nizwa","sur","ibra","barka","rustaq","khasab","duqm","ibri")

  usa   = @("new-york","los-angeles","chicago","houston","phoenix","dallas","miami","atlanta","seattle","denver","boston","san-francisco")
  canada= @("toronto","vancouver","montreal","calgary","edmonton","ottawa","winnipeg","quebec-city","hamilton","kitchener","halifax","victoria")
  mexico= @("mexico-city","guadalajara","monterrey","puebla","tijuana","queretaro","leon","merida","cancun","toluca","chihuahua","hermosillo")

  brazil= @("sao-paulo","rio-de-janeiro","brasilia","belo-horizonte","curitiba","porto-alegre","recife","salvador","fortaleza","goiania","manaus","campinas")
  chile = @("santiago","valparaiso","vina-del-mar","concepcion","antofagasta","temuco","la-serena","iquique","rancagua","talca","puerto-montt","arica")
  peru  = @("lima","arequipa","trujillo","chiclayo","piura","cusco","huancayo","ica","tacna","juliaca","pucallpa","chimbote")
  colombia=@("bogota","medellin","cali","barranquilla","cartagena","bucaramanga","pereira","manizales","cucuta","ibague","villavicencio","santa-marta")
  argentina=@("buenos-aires","cordoba","rosario","mendoza","la-plata","tucuman","mar-del-plata","salta","santa-fe","san-juan","neuquen","bahia-blanca")

  germany=@("berlin","munich","hamburg","frankfurt","cologne","stuttgart","dusseldorf","leipzig","dortmund","essen","bremen","hannover")
  france =@("paris","lyon","marseille","toulouse","nice","nantes","strasbourg","montpellier","bordeaux","lille","rennes","grenoble")
  italy  =@("milan","rome","turin","naples","bologna","florence","venice","genoa","palermo","bari","verona","catania")
  spain  =@("madrid","barcelona","valencia","seville","zaragoza","malaga","bilbao","murcia","palma","vigo","alicante","cordoba")
  poland =@("warsaw","krakow","wroclaw","poznan","gdansk","lodz","szczecin","katowice","lublin","bialystok","gdynia","bydgoszcz")
  netherlands=@("amsterdam","rotterdam","the-hague","utrecht","eindhoven","tilburg","groningen","almere","breda","nijmegen","haarlem","arnhem")
  sweden=@("stockholm","gothenburg","malmo","uppsala","vasteras","orebro","linkoping","helsingborg","jonkoping","norrkoping","lund","umea")
}

$INTENTS = @("buyers","products","compliance","pricing")

function WriteHtml($path, $title, $desc, $h1, $links){
  $html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>$title</title>
  <meta name="description" content="$desc" />
</head>
<body>
  <h1>$h1</h1>
  $links
</body>
</html>
"@
  $html | Set-Content -Encoding UTF8 $path
}

foreach($country in $CITY.Keys){

  $countryDir = Join-Path $root $country
  if(!(Test-Path $countryDir)){ continue }

  # 1) 城市索引页
  $citiesIndexDir = Join-Path $countryDir "cities"
  mkdir $citiesIndexDir -Force | Out-Null
  $citiesIndex = Join-Path $citiesIndexDir "index.html"

  $cityLinks = ""
  foreach($city in $CITY[$country]){
    $cityLinks += "<li><a href='/world/$country/cities/$city/'>$city</a></li>`n"
  }
  $linksHtml = "<ul>`n$cityLinks</ul>"

  WriteHtml $citiesIndex "$country Cities | YiShen Global" "City radar for $country: buyer intent capture by city." "City Radar · $country" $linksHtml

  # 2) 城市页 + 4 个意图页
  $sitemapUrls = @()
  foreach($city in $CITY[$country]){
    $cityRoot = Join-Path $citiesIndexDir $city
    mkdir $cityRoot -Force | Out-Null

    $cityIndex = Join-Path $cityRoot "index.html"
    $intentLinks = ""
    foreach($it in $INTENTS){
      mkdir (Join-Path $cityRoot $it) -Force | Out-Null
      $intentLinks += "<li><a href='/world/$country/cities/$city/$it/'>$it</a></li>`n"

      $intentIndex = Join-Path (Join-Path $cityRoot $it) "index.html"
      WriteHtml $intentIndex "$country $city $it | YiShen Global" "YiShen Global $country $city $it portal." "$country · $city · $it" "<p>Radar page for $it.</p>"

      $sitemapUrls += "https://yishenglobal.net/world/$country/cities/$city/$it/"
    }

    WriteHtml $cityIndex "$country $city | YiShen Global" "City sovereignty node for $country $city." "$country · $city" "<ul>`n$intentLinks</ul>"
    $sitemapUrls += "https://yishenglobal.net/world/$country/cities/$city/"
  }

  # 3) 国家级 city-sitemap.xml
  $citySitemap = Join-Path $countryDir "sitemap-cities.xml"
  $urlXml = ""
  foreach($u in $sitemapUrls){
    $urlXml += "<url><loc>$u</loc><changefreq>daily</changefreq><priority>0.85</priority></url>`n"
  }
  "<?xml version='1.0' encoding='UTF-8'?><urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>$urlXml</urlset>" | Set-Content -Encoding UTF8 $citySitemap

  Write-Host "✅ city radar built:" $country
}
