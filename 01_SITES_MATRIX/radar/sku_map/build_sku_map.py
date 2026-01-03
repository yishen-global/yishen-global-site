import pandas as pd
from datetime import datetime
import os

BASE_DIR = os.path.dirname(__file__)
ICP_MATRIX = os.path.join(BASE_DIR, "../icp_pool/icp_sku_matrix.csv")
PRICE_BAND = os.path.join(BASE_DIR, "sku_price_band.csv")
OUTPUT = os.path.join(BASE_DIR, "sku_map_master.csv")

def run():
    icp = pd.read_csv(ICP_MATRIX)
    price = pd.read_csv(PRICE_BAND)

    df = pd.merge(icp, price, left_on="recommended_sku", right_on="sku", how="left")

    df["sku_map_score"] = df["market_gap_score"] * df["priority"].map({"A+":1.2,"A":1.0}).fillna(0.8)
    df["mapped_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    df.to_csv(OUTPUT, index=False, encoding="utf-8-sig")
    print(f"🗺 sku_map_master.csv built: {len(df)}")

if __name__=="__main__":
    run()
