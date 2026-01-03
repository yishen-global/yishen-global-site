import pandas as pd
from datetime import datetime
import os

BASE_DIR = os.path.dirname(__file__)
INPUT = os.path.join(BASE_DIR, "hot_pool_all.csv")
OUTPUT = os.path.join(BASE_DIR, "icp_hot_pool_sov.csv")

def decision_power(title):
    t = str(title).lower()
    if "ceo" in t or "chief" in t or "director" in t or "head" in t:
        return "Yes"
    if "procurement" in t or "buyer" in t or "sourcing" in t:
        return "Likely"
    return "Unknown"

def run():
    if not os.path.exists(INPUT):
        print("❌ Missing hot_pool_all.csv")
        return

    df = pd.read_csv(INPUT)

    # 只保留 A+ 级
    df = df[df["priority_level"] == "A+"].copy()

    if df.empty:
        print("⚠ No A+ records found.")
        return

    df["decision_power"] = df["contact_title"].apply(decision_power)
    df["est_annual_volume"] = (df["import_volume"].fillna(0).astype(float) * 4).astype(int)
    df["deal_grade"] = df["signal_score"].apply(lambda x: "S" if x >= 95 else "A")
    df["followup_mode"] = "whatsapp"
    df["sov_built_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    df.to_csv(OUTPUT, index=False, encoding="utf-8-sig")
    print(f"👑 icp_hot_pool_sov.csv built: {len(df)} records")

if __name__ == "__main__":
    run()
