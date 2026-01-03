import os
import pandas as pd
from datetime import datetime

INPUT = "../output/merged_all_sources.csv"
OUTPUT = "global_icp_master.csv"

WEIGHTS = {
    "has_email": 12,
    "has_phone": 8,
    "has_linkedin": 6,
    "has_website": 6,
    "priority_country": 10,
    "furniture_industry": 10,
    "import_activity": 12
}

PRIORITY_COUNTRIES = {"United States","Saudi Arabia","United Arab Emirates"}
KEYWORDS = ["furniture","office","chair","sofa","desk","interior","building","floor"]

def score(row):
    s = 0
    if row["email"]: s+=WEIGHTS["has_email"]
    if row["phone"]: s+=WEIGHTS["has_phone"]
    if row["linkedin"]: s+=WEIGHTS["has_linkedin"]
    if row["website"]: s+=WEIGHTS["has_website"]
    if row["country"] in PRIORITY_COUNTRIES: s+=WEIGHTS["priority_country"]
    if any(k in str(row["industry"]).lower() for k in KEYWORDS): s+=WEIGHTS["furniture_industry"]
    if row["last_import_date"] or row["import_volume"]: s+=WEIGHTS["import_activity"]
    return s

def run():
    df = pd.read_csv(INPUT)
    df["icp_base_score"] = df.apply(score, axis=1)
    df["icp_built_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    df.to_csv(OUTPUT,index=False,encoding="utf-8-sig")
    print(f"🧠 ICP Master Pool built: {len(df)}")

if __name__=="__main__":
    run()
