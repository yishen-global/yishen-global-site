import sys, requests, xml.etree.ElementTree as ET
from index_push import push

if len(sys.argv) < 2:
    print("Usage: python fire_sitemap.py sitemap.xml")
    exit()

sitemap = sys.argv[1]

tree = ET.parse(sitemap)
root = tree.getroot()

ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}

urls = [url.find("ns:loc", ns).text for url in root.findall("ns:url", ns)]

print(f"🔥 Total URLs Found: {len(urls)}")

for u in urls:
    print("🚀 Pushing:", u)
    push(u)

print("✅ SITEMAP FIRE COMPLETE")
