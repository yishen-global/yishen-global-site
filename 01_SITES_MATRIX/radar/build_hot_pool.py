import pandas as pd
from datetime import datetime

INPUT = "output/global_signal_scored.csv"

COUNTRY_MAP = {
    "Saudi Arabia": "saudi_hot_pool.csv",
    "United States": "usa_hot_pool.csv",
    "United Arab Emirates": "uae_hot_pool.csv"
}

HOT_SCORE_THRESHOLD = 78

def run():
    df = pd.read_csv(INPUT)

    # 只保留高意向买家
    df = df[df["signal_score"] >= HOT_SCORE_THRESHOLD]

    # 统一输出字段结构
    fields = [
        "company_name", "country", "website", "industry",
        "contact_name", "contact_title", "email", "phone", "linkedin",
        "signal_score", "last_import_date", "import_volume",
        "top_product", "sku_gap", "priority_level"
    ]
    df = df[fields]

    for country, filename in COUNTRY_MAP.items():
        pool = df[df["country"] == country]
        pool["priority_level"] = pool["signal_score"].apply(
            lambda x: "A+" if x >= 90 else "A" if x >= 85 else "B"
        )
        pool.to_csv(filename, index=False, encoding="utf-8-sig")
        print(f"🔥 {filename} generated: {len(pool)} buyers")

    print("🛡️ Sovereign Hot Pools Ready.")

if __name__ == "__main__":
    run()
