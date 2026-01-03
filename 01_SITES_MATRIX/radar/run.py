import pandas as pd
import os
import datetime
from engine.icp_generator import generate_pool

BASE = "J:/YiShen-Mothership/radar"

RAW_PATH = BASE + "/data/raw_shipments/latest.csv"
OUT_POOL = BASE + "/data/icp_pool/icp_hot_pool.csv"
LOG_DIR = BASE + "/data/logs"

def main():
    print("=== YiShen Radar Boot ===")

    if not os.path.exists(RAW_PATH):
        print("❌ RAW shipment file missing:", RAW_PATH)
        return

    os.makedirs(os.path.dirname(OUT_POOL), exist_ok=True)
    os.makedirs(LOG_DIR, exist_ok=True)

    df = pd.read_csv(RAW_PATH)
    print("Loaded shipments:", len(df))

    generate_pool(df)

    log_file = LOG_DIR + "/radar_" + str(datetime.date.today()) + ".log"
    with open(log_file, "w", encoding="utf-8") as log:
        log.write("Radar OK | Shipments: " + str(len(df)))

    print("✅ Radar Finished")
    print("ICP pool saved to:", OUT_POOL)

if __name__ == "__main__":
    main()
