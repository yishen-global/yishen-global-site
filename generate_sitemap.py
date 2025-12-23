import json
import os
from datetime import datetime

# =========================================================
# YISHEN GLOBAL — SEO SOVEREIGN INDEX GENERATOR (PATCHED)
# =========================================================

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(BASE_DIR)

DOMAIN = "https://yishenglobal.net/"
OUTPUT_FILE = "data/sovereign-index.xml"
LEDGER_FILES = ['sku-database.json', 'asset-ledger.json']


class SitemapSovereignty:
    def __init__(self):
        self.now = datetime.utcnow().strftime('%Y-%m-%d')
        self.nodes = []

    def boot(self):
        print(">>> [SYSTEM_V5.1]: INITIATING_SEO_SOVEREIGNTY_SCAN")

        self.scan_static_assets()
        self.harvest_dynamic_skus()
        self.construct_xml()

    def scan_static_assets(self):
        exclude = {'sku-template.html', 'sku-detail-template.html', '404.html'}
        html_dir = BASE_DIR

        static_pages = [
            f for f in os.listdir(html_dir)
            if f.endswith('.html') and f not in exclude
        ]

        for page in static_pages:
            self.nodes.append({
                "loc": f"{DOMAIN}{page}",
                "priority": "1.0" if page == "index.html" else "0.8",
                "changefreq": "daily" if page == "index.html" else "weekly"
            })

        print(f"[SCAN] {len(static_pages)} static pages indexed.")

    def harvest_dynamic_skus(self):
        ledger_path = next((f for f in LEDGER_FILES if os.path.exists(os.path.join(BASE_DIR, f))), None)
        if not ledger_path:
            print("[WARNING] No asset ledger found.")
            return

        try:
            with open(os.path.join(BASE_DIR, ledger_path), 'r', encoding='utf-8') as f:
                data = json.load(f)
                skus = data.get('products', []) if isinstance(data, dict) else data.values()

                for sku in skus:
                    sku_id = sku.get('id') or sku.get('code_id')
                    if sku_id:
                        self.nodes.append({
                            "loc": f"{DOMAIN}technical-passport.html?id={sku_id}",
                            "priority": "0.7",
                            "changefreq": "weekly"
                        })
        except Exception as e:
            print(f"[ERROR] Ledger read failed: {e}")

    def construct_xml(self):
        xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        ]

        for n in self.nodes:
            xml.append('  <url>')
            xml.append(f'    <loc>{n["loc"]}</loc>')
            xml.append(f'    <lastmod>{self.now}</lastmod>')
            xml.append(f'    <changefreq>{n["changefreq"]}</changefreq>')
            xml.append(f'    <priority>{n["priority"]}</priority>')
            xml.append('  </url>')

        xml.append('</urlset>')

        with open(os.path.join(BASE_DIR, OUTPUT_FILE), 'w', encoding='utf-8') as f:
            f.write('\n'.join(xml))

        print(f"[SUCCESS] Sovereign index manifested → {OUTPUT_FILE}")


if __name__ == "__main__":
    SitemapSovereignty().boot()
