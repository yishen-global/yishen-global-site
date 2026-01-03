# engine/build_icp_master_pool.py
import pandas as pd
from icp_generator import generate_icp_master

def build_master_pool(source_csv, output_csv):
    raw = pd.read_csv(source_csv)
    master = generate_icp_master(raw)
    master.to_csv(output_csv, index=False)
    print("✅ ICP MASTER POOL BUILT:", output_csv)
