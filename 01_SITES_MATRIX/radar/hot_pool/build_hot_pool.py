import pandas as pd
from datetime import datetime
import os

BASE_DIR = os.path.dirname(__file__)
INPUT = os.path.join(BASE_DIR, "../output/global_signal_scored.csv")

COUNTRY_MAP = {
    "Saudi Arabia": "saudi_hot_pool.csv",
    "United States": "usa_hot_pool.csv",
    "United Arab Emirates": "uae_hot_pool.csv"
}

HOT_SCORE_THRESHOLD = 78

FIELDS = [
    "company_name","country","website","industry",
    "contact_name","contact_title","email","phone","linkedin",
    "signal_score","last_import_date","import_volume",
    "top_product","sku_gap","priority_level"
]

def run():
    df = pd.read_csv(INPUT)
    df = df[df["signal_score"] >= HOT_SCORE_THRESHOLD]

    for country, filename in COUNTRY_MAP.items():
        pool = df[df["country"] == country].copy()
        pool["priority_level"] = pool["signal_score"].apply(
            lambda x: "A+" if x >= 90 else "A" if x >= 85 else "B"
        )
        pool[FIELDS].to_csv(os.path.join(BASE_DIR, filename), index=False, encoding="utf-8-sig")
        print(f"🔥 {filename} built: {len(pool)}")

if __name__ == "__main__":
    run()
