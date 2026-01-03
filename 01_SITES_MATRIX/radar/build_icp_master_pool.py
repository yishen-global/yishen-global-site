import os
import pandas as pd
from datetime import datetime

INPUT = "output/merged_all_sources.csv"
OUTPUT = "output/global_icp_master.csv"

# 基础 ICP 权重（可按你业务随时调）
WEIGHTS = {
    "has_email": 12,
    "has_phone": 8,
    "has_linkedin": 6,
    "has_website": 6,
    "priority_country": 10,   # US / SA / UAE
    "furniture_industry": 10, # 家具/建材/室内相关
    "import_activity": 12     # 有进口/贸易痕迹
}

PRIORITY_COUNTRIES = {"United States", "Saudi Arabia", "United Arab Emirates"}

FURNITURE_KEYWORDS = [
    "furniture", "office", "home", "interior", "chair",
    "sofa", "desk", "building", "construction", "floor", "material"
]

REQUIRED_FIELDS = [
    "company_name","country","industry","website",
    "contact_name","contact_title","email","phone","linkedin",
    "last_import_date","import_volume","top_product"
]

def normalize_text(x):
    return str(x).strip().lower() if pd.notnull(x) else ""

def base_icp_score(row):
    score = 0

    # 完整度
    if pd.notnull(row.get("email")) and row.get("email") != "":
        score += WEIGHTS["has_email"]
    if pd.notnull(row.get("phone")) and row.get("phone") != "":
        score += WEIGHTS["has_phone"]
    if pd.notnull(row.get("linkedin")) and row.get("linkedin") != "":
        score += WEIGHTS["has_linkedin"]
    if pd.notnull(row.get("website")) and row.get("website") != "":
        score += WEIGHTS["has_website"]

    # 国家优先级
    if row.get("country") in PRIORITY_COUNTRIES:
        score += WEIGHTS["priority_country"]

    # 行业相关度
    industry = normalize_text(row.get("industry"))
    if any(k in industry for k in FURNITURE_KEYWORDS):
        score += WEIGHTS["furniture_industry"]

    # 进口/贸易活跃度
    if pd.notnull(row.get("last_import_date")) or pd.notnull(row.get("import_volume")):
        score += WEIGHTS["import_activity"]

    return score

def ensure_columns(df):
    for c in REQUIRED_FIELDS:
        if c not in df.columns:
            df[c] = ""
    return df

def dedup(df):
    # 优先按 company + email，其次 company + phone
    df["key1"] = df["company_name"].fillna("").str.lower() + "|" + df["email"].fillna("").str.lower()
    df["key2"] = df["company_name"].fillna("").str.lower() + "|" + df["phone"].fillna("").str.lower()
    df = df.sort_values(by=["company_name"]).drop_duplicates(subset=["key1"], keep="first")
    df = df.drop_duplicates(subset=["key2"], keep="first")
    return df.drop(columns=["key1","key2"])

def run():
    os.makedirs("output", exist_ok=True)

    if not os.path.exists(INPUT):
        raise FileNotFoundError(f"Missing input: {INPUT}")

    df = pd.read_csv(INPUT)
    df = ensure_columns(df)

    # 统一基础字段
    df["company_name"] = df["company_name"].fillna("").str.strip()
    df["country"] = df["country"].fillna("").str.strip()
    df["industry"] = df["industry"].fillna("").str.strip()

    # 去重
    df = dedup(df)

    # 计算基础 ICP 分
    df["icp_base_score"] = df.apply(base_icp_score, axis=1)

    # 标注时间戳
    df["icp_built_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 输出
    df.to_csv(OUTPUT, index=False, encoding="utf-8-sig")
    print(f"🧠 ICP Master Pool Ready: {len(df)} records -> {OUTPUT}")

if __name__ == "__main__":
    run()
