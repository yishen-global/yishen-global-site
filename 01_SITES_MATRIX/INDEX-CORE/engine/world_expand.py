import os

SITE_DIR = r"J:\yishen-global-site"
COUNTRIES = [
"usa","canada","mexico","brazil","argentina","chile","peru","colombia","venezuela",
"germany","france","italy","spain","portugal","poland","czech","romania","sweden","finland","norway","denmark",
"uk","ireland","netherlands","belgium","switzerland","austria","hungary","greece","turkey",
"russia","ukraine","kazakhstan","uzbekistan","turkmenistan","tajikistan","kyrgyzstan","armenia","azerbaijan","georgia",
"china","japan","korea","taiwan","hongkong","singapore","malaysia","thailand","vietnam","philippines","indonesia","cambodia","laos","myanmar",
"india","pakistan","bangladesh","srilanka","nepal",
"uae","saudiarabia","qatar","kuwait","oman","bahrain","egypt","southafrica","nigeria","kenya","morocco","algeria","tunisia",
"australia","newzealand"
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{country} Office Chairs Manufacturer & Wholesale Supplier</title>
<meta name="description" content="YiShen Global supplies high quality office chairs in {country}. OEM, wholesale, project supply, fast delivery, low MOQ.">
<link rel="canonical" href="https://www.yishenglobal.net/{country}-office-chairs.html">
</head>
<body>
<h1>Office Chairs Supplier in {country}</h1>
<p>YiShen Global is a professional manufacturer and exporter of ergonomic office chairs, gaming chairs, mesh chairs and project seating solutions serving {country} market.</p>
</body>
</html>"""

os.makedirs(SITE_DIR, exist_ok=True)
count = 0

for c in COUNTRIES:
    path = os.path.join(SITE_DIR, f"{c}-office-chairs.html")
    if not os.path.exists(path):
        with open(path,"w",encoding="utf-8") as f:
            f.write(TEMPLATE.replace("{country}", c.upper()))
        count += 1

print(f"WORLD EXPANSION DONE: {count} pages generated")
