import pandas as pd
from datetime import datetime
import os

BASE_DIR = os.path.dirname(__file__)

POOLS = [
    "saudi_hot_pool.csv",
    "usa_hot_pool.csv",
    "uae_hot_pool.csv"
]

OUTPUT = "hot_pool_all.csv"

def run():
    rows = []
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for p in POOLS:
        path = os.path.join(BASE_DIR, p)
        if os.path.exists(path):
            df = pd.read_csv(path)
            df["source_pool"] = p.replace("_hot_pool.csv", "")
            df["hot_built_at"] = now
            rows.append(df)
            print(f"✔ Loaded {p}: {len(df)}")
        else:
            print(f"⚠ Missing {p}")

    if not rows:
        print("❌ No pools found. Abort.")
        return

    pd.concat(rows).to_csv(os.path.join(BASE_DIR, OUTPUT), index=False, encoding="utf-8-sig")
    print(f"🔥 hot_pool_all.csv built with {sum(len(r) for r in rows)} records")

if __name__ == "__main__":
    run()
