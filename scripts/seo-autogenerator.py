import json, datetime

DOMAIN = "https://yishenglobal.net/"

with open("sku-database.json","r",encoding="utf-8") as f:
    db = json.load(f)["products"]

urls = []

# 核心页面
core = ["","genesis.html","clusters.html","resources.html","tactical-briefing.html"]
for c in core:
    urls.append(f"{DOMAIN}{c}")

# SKU 爆炸生成
for p in db:
    urls.append(f"{DOMAIN}technical-passport.html?id={p['id']}")

    # 市场裂变路径
    for m in p["markets"]:
        urls.append(f"{DOMAIN}market/{p['id']}/{m}")

    # SEO 关键词裂变路径
    for k in p["seo"]["keywords"]:
        urls.append(f"{DOMAIN}search/{k.replace(' ','-')}")

# 物理写入 sitemap.xml
today = datetime.date.today().isoformat()
xml = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

for u in urls:
    xml.append(f"<url><loc>{u}</loc><lastmod>{today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>")

xml.append("</urlset>")

open("sitemap.xml","w",encoding="utf-8").write("\n".join(xml))

print(">>> SITEMAP AUTO-GENERATED:", len(urls), "URL NODES")
