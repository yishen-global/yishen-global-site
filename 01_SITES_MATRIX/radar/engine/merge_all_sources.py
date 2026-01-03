import pandas as pd
import glob
import os

ROOT = r"J:\YiShen-Mothership\radar\data\raw_shipments"
OUT  = r"J:\YiShen-Mothership\radar\data\raw_shipments\panjiva\2025_master_merge.xlsx"

files = glob.glob(ROOT + r"\panjiva\**\*.xlsx", recursive=True)
frames = []

for f in files:
    if "master_merge" in f: continue
    try:
        df = pd.read_excel(f)
        df["source_file"] = os.path.basename(f)
        frames.append(df)
    except:
        pass

merged = pd.concat(frames, ignore_index=True)
merged.to_excel(OUT, index=False)
print("MASTER MERGED:", len(merged), "rows")
