import os
import pandas as pd
from datetime import datetime

INPUTS = [
    "data_raw/apollo_raw.csv",
    "data_raw/zoominfo_raw.csv",
    "data_raw/panjiva_raw.csv"
]

OUTPUT = "output/merged_all_sources.csv"

STANDARD_FIELDS = [
    "company_name","website","industry","country",
    "contact_name","contact_title","email","phone","linkedin",
    "last_import_date","import_volume","top_product"
]

def normalize_df(df):
    # 统一字段
    for c in STANDARD_FIELDS:
        if c not in df.columns:
            df[c] = ""

    # 规范字符串
    for c in ["company_name","website","industry","country","contact_name","contact_title","email","phone","linkedin","top_product"]:
        df[c] = df[c].fillna("").astype(str).str.strip()

    return df[STANDARD_FIELDS]

def merge_and_dedup(dfs):
    merged = pd.concat(dfs, ignore_index=True)

    # 去重：company+email 优先，其次 company+phone
    merged["key1"] = merged["company_name"].str.lower() + "|" + merged["email"].str.lower()
    merged["key2"] = merged["company_name"].str.lower() + "|" + merged["phone"].str.lower()

    merged = merged.sort_values(by=["company_name"])
    merged = merged.drop_duplicates(subset=["key1"], keep="first")
    merged = merged.drop_duplicates(subset=["key2"], keep="first")

    return merged.drop(columns=["key1","key2"])

def run():
    os.makedirs("output", exist_ok=True)
    dfs = []

    for path in INPUTS:
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = normalize_df(df)
            dfs.append(df)
            print(f"✔ Loaded {path} ({len(df)})")
        else:
            print(f"⚠ Missing {path}")

    if not dfs:
        print("❌ No source data found. Abort merge.")
        return

    merged = merge_and_dedup(dfs)
    merged["merged_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    merged.to_csv(OUTPUT, index=False, encoding="utf-8-sig")
    print(f"🧬 Merged pool ready: {len(merged)} records → {OUTPUT}")

if __name__ == "__main__":
    run()
