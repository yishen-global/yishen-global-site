import pandas as pd
from datetime import datetime

INPUT="../output/global_signal_scored.csv"
OUTPUT="icp_sku_matrix.csv"

def guess_gap(p):
    p=str(p).lower()
    if "mesh" in p: return "gaming chair","LEISA Pro Gaming Chair"
    if "sofa" in p: return "standing desk","LEISA Smart Desk"
    return "ergonomic chair","LEISA ErgoMesh E3"

def run():
    df=pd.read_csv(INPUT)
    rows=[]
    now=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    for _,r in df.iterrows():
        gap,sku=guess_gap(r["top_product"])
        rows.append({
            "country":r["country"],
            "industry":r["industry"],
            "company_name":r["company_name"],
            "contact_name":r["contact_name"],
            "contact_title":r["contact_title"],
            "email":r["email"],
            "phone":r["phone"],
            "top_imported_product":r["top_product"],
            "missing_sku_category":gap,
            "recommended_sku":sku,
            "market_gap_score":r["signal_score"],
            "estimated_monthly_volume":int(float(r["import_volume"] or 0)/12),
            "estimated_margin":"30%",
            "priority_level":"A+" if r["signal_score"]>=90 else "A",
            "matrix_built_at":now
        })
    pd.DataFrame(rows).to_csv(OUTPUT,index=False,encoding="utf-8-sig")
    print("🧬 icp_sku_matrix.csv built")

if __name__=="__main__":
    run()
