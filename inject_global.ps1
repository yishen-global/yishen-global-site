$root = "J:\Yishen-Mothership\countries"
$blocks = @"
<section class='hero'>
<h1>LEISA Official {{COUNTRY}} Wholesale Partner Program</h1>
<p>Factory Direct · Low MOQ · Fast Delivery · OEM ODM · Global DDP</p>
</section>

<section class='usp'>
<h2>Why {{COUNTRY}} Buyers Choose LEISA</h2>
<ul>
<li>Certified ergonomic chairs (BIFMA, SGS, CE)</li>
<li>MOQ from 30 pcs · Stable lead time</li>
<li>OEM & Private Label supported</li>
<li>DDP shipping to {{COUNTRY}}</li>
</ul>
</section>

<section class='cta'>
<h2>Become LEISA {{COUNTRY}} Distributor</h2>
<p>WhatsApp: +86-138-XXXX-XXXX</p>
<p>Email: sales@yishenglobal.net</p>
<p><a href='/contact.html'>Apply Now</a></p>
</section>
"@

Get-ChildItem $root -Directory | ForEach-Object {
  $file = "$($_.FullName)\index.html"
  if (Test-Path $file) {
    $html = Get-Content $file -Raw
    if ($html -notmatch "LEISA Official") {
      $new = $html -replace "</body>", "$($blocks.Replace('{{COUNTRY}}',$_.Name))</body>"
      Set-Content $file $new -Encoding UTF8
      Write-Host "Injected $_"
    }
  }
}
