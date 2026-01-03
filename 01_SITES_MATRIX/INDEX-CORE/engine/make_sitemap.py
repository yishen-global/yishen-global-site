import os
from xml.etree.ElementTree import Element, SubElement, ElementTree

# === YISHEN SOVEREIGN SITEMAP ENGINE v1.0 ===

ROOT = r"J:\yishen-global-site"
DOMAIN = "https://www.yishenglobal.net"

IGNORE_DIRS = {
    ".git", ".vercel", "node_modules", "__pycache__", ".idea", ".next"
}

IGNORE_FILES = {
    "404.html", "500.html", "robots.txt", "vercel.json"
}

def collect_html_files():
    urls = []
    for root, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for f in files:
            if not f.lower().endswith(".html"):
                continue
            if f in IGNORE_FILES:
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, ROOT).replace("\\", "/")
            if rel_path.startswith("_") or "/_" in rel_path:
                continue

            if rel_path.endswith("index.html"):
                rel_path = rel_path.replace("index.html", "")
            url = DOMAIN + "/" + rel_path.strip("/")
            urls.append(url)
    return urls

def build_sitemap(urls):
    urlset = Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    for u in sorted(set(urls)):
        url = SubElement(urlset, "url")
        SubElement(url, "loc").text = u
        SubElement(url, "changefreq").text = "daily"
        SubElement(url, "priority").text = "0.8"
    ElementTree(urlset).write("sitemap.xml", encoding="utf-8", xml_declaration=True)

if __name__ == "__main__":
    urls = collect_html_files()
    build_sitemap(urls)
    print(f"\nSITEMAP GENERATED {len(urls)} URLS\n")
