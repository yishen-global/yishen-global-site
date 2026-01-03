import os
import pandas as pd
from datetime import datetime

INPUT = "output/global_icp_master.csv"
OUTPUT = "output/global_signal_scored.csv"

# 成交信号权重
WEIGHTS = {
    "icp_base": 0.4,
    "import_activity": 0.25,
    "recent_import": 0.15,
    "sku_gap": 0.2
}

def sku_gap_score(gap):
    if pd.isnull(gap) or gap == "":
        return 20
    gap = str(gap).lower()
    if "chair" in gap or "desk" in gap or "sofa" in gap:
        return 90
    return 60

def import_score(row):
    score = 0
    if pd.notnull(row.get("import_volume")):
        score += 50
    if pd.notnull(row.get("last_import_date")):
        score += 50
    return score

def recency_score(date_str):
    try:
        days = (datetime.now() - pd.to_datetime(date_str)).days
        if days <= 90:
            return 100
        elif days <= 180:
            return 70
        else:
            return 40
    except:
        return 30

def run():
    os.makedirs("output", exist_ok=True)
    df = pd.read_csv(INPUT)

    # SKU gap fallback
    if "sku_gap" not in df.columns:
        df["sku_gap"] = ""

    df["import_score"] = df.apply(import_score, axis=1)
    df["recency_score"] = df["last_import_date"].apply(recency_score)
    df["sku_gap_score"] = df["sku_gap"].apply(sku_gap_score)

    # 综合成交信号评分
    df["signal_score"] = (
        df["icp_base_score"] * WEIGHTS["icp_base"] +
        df["import_score"] * WEIGHTS["import_activity"] +
        df["recency_score"] * WEIGHTS["recent_import"] +
        df["sku_gap_score"] * WEIGHTS["sku_gap"]
    ).round(2)

    df["signal_scored_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    df.to_csv(OUTPUT, index=False, encoding="utf-8-sig")
    print(f"📡 Signal Scoring Done: {len(df)} records -> {OUTPUT}")

if __name__ == "__main__":
    run()
