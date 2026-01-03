import pandas as pd
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
DATA = BASE / "data"

ICP_SRC = DATA / "icp_master_pool.csv"
SHIP_SRC = DATA / "raw_shipments" / "shipments.csv"
OUT = DATA / "icp_sku_matrix.csv"

SKU_MAP = {
    "mesh_midback": ["mesh mid back","midback mesh"],
    "mesh_highback": ["highback mesh","mesh high"],
    "leather_exec": ["leather executive","leather chair"],
    "gaming_rgb": ["rgb gaming","gaming rgb"],
    "recliner_lift": ["lift recliner","electric recliner"],
    "sofa_compress": ["compressed sofa","vacuum sofa"],
    "desk_dual_motor": ["dual motor desk","standing desk dual"],
    "desk_smart": ["smart desk","ai desk"],
    "project_bulk": ["project order","bulk project"]
}

def detect_sku(desc:str):
    d = desc.lower()
    for k, kws in SKU_MAP.items():
        for kw in kws:
            if kw in d:
                return k
    return None

def run():
    icp = pd.read_csv(ICP_SRC)
    ship = pd.read_csv(SHIP_SRC)

    rows = []

    for _, r in icp.iterrows():
        buyer = r["company"]
        country = r["country"]
        buyer_ship = ship[ship["company"]==buyer]

        row = {"company":buyer,"country":country}
        for sku in SKU_MAP:
            row[sku] = 0

        for _, s in buyer_ship.iterrows():
            sku = detect_sku(str(s.get("product","")))
            if sku:
                row[sku] = 1

        rows.append(row)

    df = pd.DataFrame(rows)
    df.to_csv(OUT, index=False)
    print("🔥 SKU MATRIX BUILT")
    print("Rows:",len(df))
    print("Output:",OUT)

if __name__ == "__main__":
    run()
