import pandas as pd
from pathlib import Path
from datetime import timedelta

SRC = Path("../data/hot_pool/icp_hot_pool.csv")
OUT = Path("../data/po_predict/icp_po_predict.csv")

def run():
    df = pd.read_csv(SRC)
    df["last_shipment_date"] = pd.to_datetime(df["last_shipment_date"])
    df["next_po_window"] = df["last_shipment_date"] + timedelta(days=45)

    df[["org_name","country","next_po_window"]].to_csv(OUT,index=False)
    print("📆 icp_po_predict.csv generated")

if __name__ == "__main__":
    run()
