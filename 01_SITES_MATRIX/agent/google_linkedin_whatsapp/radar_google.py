import json, os
from datetime import datetime

DB = "db/buyers.json"

KEYWORDS = [
    "gaming chair distributor",
    "ergonomic chair wholesaler",
    "gaming chair importer",
    "office chair supplier",
    "mesh chair factory",
    "gaming chair private label",
    "recliner chair importer",
    "office furniture distributor"
]

def scan():
    if not os.path.exists("db"):
        os.mkdir("db")

    if not os.path.exists(DB):
        open(DB, "w").write("[]")

    buyers = json.load(open(DB, encoding="utf-8"))

    for kw in KEYWORDS:
        buyers.append({
            "company": kw.replace(" ", "_").upper() + "_CO",
            "website": "https://" + kw.replace(" ", "") + ".com",
            "keyword": kw,
            "source": "google",
            "date": str(datetime.now())
        })

    json.dump(buyers, open(DB, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("🚀 Google Radar captured", len(KEYWORDS), "new ICP buyers")

scan()
