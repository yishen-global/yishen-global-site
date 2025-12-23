import json, os, math
from datetime import datetime

# =========================================================
# YISHEN GLOBAL — SEO SOVEREIGN GENERATOR V5.ULTIMATE
# 功能：
# 1. 自动扫描静态页面
# 2. 自动裂变 SKU 动态页
# 3. 支持 10,000+ SKU sitemap 分片
# =========================================================

DOMAIN = "https://yishenglobal.net/"
OUTPUT_DIR = "public"
MAX_URLS = 45000  # 每个 sitemap 分片最大容量

LEDGER_FILES = ["sku-database.json", "asset-ledger.json"]

class SovereignSitemap:
    def __init__(self):
        self.today = datetime.utcnow().strftime("%Y-%m-%d")
        self.urls = []

    def boot(self):
        print(">>> [SEO_CORE]: SOVEREIGN_SITEMAP_GENERATOR_ONLINE")

        self.scan_static()
        self.harvest_skus()
        self.split_and_write()

    def scan_static(self):
        for f in os.listdir("public"):
            if f.endswith(".html"):
                self.urls.append({
                    "loc": f"{DOMAIN}{f}",
                    "priority": "1.0" if f == "index.html" else "0.8",
                    "freq": "daily" if f == "index.html" else "weekly"
                })

    def harvest_skus(self):
        ledger = next((f for f in LEDGER_FILES if os.path.exists(f)), None)
        if not ledger:
            print("! NO SKU LEDGER FOUND.")
            return

        with open(ledger, "r", encoding="utf-8") as f:
            db = json.load(f)

        skus = db.get("products", [])
        for sku in skus:
            sid = sku.get("id")
            if sid:
                self.urls.append({
                    "loc": f"{DOMAIN}technical-passport.html?id={sid}",
                    "priority": "0.7",
                    "freq": "weekly"
                })

        print(f">>> [SKU_SYNC]: {len(skus)} DYNAMIC SKU URLS INJECTED")

    def split_and_write(self):
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        total = len(self.urls)
        parts = math.ceil(total / MAX_URLS)

        index_nodes = []

        for i in range(parts):
            batch = self.urls[i * MAX_URLS:(i + 1) * MAX_URLS]
            filename = f"sitemap-part-{i+1}.xml"
            path = os.path.join(OUTPUT_DIR, filename)
            index_nodes.append(f"{DOMAIN}{filename}")

            with open(path, "w", encoding="utf-8") as f:
                f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
                f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
                for u in batch:
                    f.write("  <url>\n")
                    f.write(f"    <loc>{u['loc']}</loc>\n")
                    f.write(f"    <lastmod>{self.today}</lastmod>\n")
                    f.write(f"    <changefreq>{u['freq']}</changefreq>\n")
                    f.write(f"    <priority>{u['priority']}</priority>\n")
                    f.write("  </url>\n")
                f.write("</urlset>")

        # 写 sitemap-index.xml
        with open(os.path.join(OUTPUT_DIR, "sitemap.xml"), "w", encoding="utf-8") as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            f.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
            for loc in index_nodes:
                f.write("  <sitemap>\n")
                f.write(f"    <loc>{loc}</loc>\n")
                f.write(f"    <lastmod>{self.today}</lastmod>\n")
                f.write("  </sitemap>\n")
            f.write("</sitemapindex>")

        print(f">>> [SEO_LOCKED]: {total}_]()
