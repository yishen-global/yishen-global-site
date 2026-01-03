import pandas as pd
from pathlib import Path

SRC = Path("../data/hot_pool/icp_hot_pool.csv")
OUT = Path("../data/sku_map/icp_sku_matrix.csv")

SKU = {
    "gaming chair":"Gaming Chair",
    "mesh chair":"Mesh Chair",
    "recliner":"Recliner",
    "accent chair":"Accent Chair",
    "lounger":"Lounger"
}

def run():
    df = pd.read_csv(SRC)
    result = []

    for _, r in df.iterrows():
        p = str(r["products"]).lower()
        for k,v in SKU.items():
            if k in p:
                result.append({
                    "company": r["org_name"],
                    "country": r["country"],
                    "sku": v,
                    "china_value_usd": r["china_value_usd"]
                })

    pd.DataFrame(result).to_csv(OUT, index=False)
    print("🧬 icp_sku_matrix.csv generated")

if __name__ == "__main__":
    run()
