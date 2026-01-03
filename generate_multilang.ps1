$root = "J:\Yishen-Mothership"
$countriesRoot = Join-Path $root "countries"

if (!(Test-Path $countriesRoot)) {
  Write-Host "Missing countries folder: $countriesRoot" -ForegroundColor Red
  exit
}

# Minimal, stable translations (no fancy quotes / no emoji)
$T = @{
  "es" = @{
    lang="es"; dir="ltr";
    h1="Programa Oficial de Socios Mayoristas LEISA - {{COUNTRY}}"
    sub="Venta Directa de Fabrica · MOQ bajo · Entrega rapida · OEM/ODM · DDP global"
    why="Por que los compradores de {{COUNTRY}} eligen LEISA"
    why2="Conviértete en distribuidor LEISA en {{COUNTRY}}"
    cta="Solicitar Cotizacion / RFQ"
    apply="Aplicar ahora"
    qq="Cotizacion Rapida"
  }
  "pt" = @{
    lang="pt"; dir="ltr";
    h1="Programa Oficial de Parceiros Atacadistas LEISA - {{COUNTRY}}"
    sub="Direto da Fabrica · MOQ baixo · Entrega rapida · OEM/ODM · DDP global"
    why="Por que compradores de {{COUNTRY}} escolhem a LEISA"
    why2="Torne-se distribuidor LEISA em {{COUNTRY}}"
    cta="Solicitar Cotacao / RFQ"
    apply="Aplicar agora"
    qq="Cotacao Rapida"
  }
  "fr" = @{
    lang="fr"; dir="ltr";
    h1="Programme Officiel Partenaires Grossistes LEISA - {{COUNTRY}}"
    sub="Usine directe · MOQ bas · Livraison rapide · OEM/ODM · DDP mondial"
    why="Pourquoi les acheteurs de {{COUNTRY}} choisissent LEISA"
    why2="Devenir distributeur LEISA en {{COUNTRY}}"
    cta="Demander un devis / RFQ"
    apply="Postuler maintenant"
    qq="Devis Rapide"
  }
  "ar" = @{
    lang="ar"; dir="rtl";
    h1="برنامج شركاء الجملة الرسمي من LEISA - {{COUNTRY}}"
    sub="مصنع مباشر · حد ادنى منخفض · تسليم سريع · OEM/ODM · DDP عالمي"
    why="لماذا يختار المشترون في {{COUNTRY}} LEISA"
    why2="كن موزعا لــ LEISA في {{COUNTRY}}"
    cta="طلب عرض سعر / RFQ"
    apply="قدّم الآن"
    qq="عرض سعر سريع"
  }
}

function Patch-Text($html, $countryCode, $langKey) {
  $d = $T[$langKey]
  $countryName = $countryCode.ToUpper()

  $h1 = $d.h1.Replace("{{COUNTRY}}",$countryName)
  $sub = $d.sub.Replace("{{COUNTRY}}",$countryName)
  $why = $d.why.Replace("{{COUNTRY}}",$countryName)
  $why2 = $d.why2.Replace("{{COUNTRY}}",$countryName)
  $qq  = $d.qq

  # 1) set lang/dir on <html>
  if ($html -match "<html[^>]*>") {
    $html = [regex]::Replace($html, "<html[^>]*>", "<html lang='$($d.lang)' dir='$($d.dir)'>", 1)
  } else {
    $html = "<html lang='$($d.lang)' dir='$($d.dir)'>" + $html
  }

  # 2) Replace main known headings if present
  $html = $html -replace "LEISA Official .*? Wholesale Partner Program", $h1
  $html = $html -replace "Factory Direct · Low MOQ · Fast Delivery · OEM ODM · Global DDP", $sub
  $html = $html -replace "Why .*? Buyers Choose LEISA", $why
  $html = $html -replace "Become LEISA .*? Distributor", $why2

  # 3) Rename Quick Quote title if injected
  $html = $html -replace "Quick Quote", $qq

  return $html
}

Get-ChildItem $countriesRoot -Directory | ForEach-Object {
  $code = $_.Name
  $src  = Join-Path $_.FullName "index.html"
  if (!(Test-Path $src)) { return }

  $html = Get-Content $src -Raw

  foreach($langKey in @("es","pt","fr","ar")){
    $out = Join-Path $_.FullName ("index.{0}.html" -f $langKey)
    if (Test-Path $out) {
      Write-Host "Skip exists: $code -> $langKey"
      continue
    }
    $patched = Patch-Text $html $code $langKey
    Set-Content $out $patched -Encoding UTF8
    Write-Host "LANG generated: $code -> $langKey"
  }
}

Write-Host "MULTILANG MATRIX READY" -ForegroundColor Green
