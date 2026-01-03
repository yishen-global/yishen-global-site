import pandas as pd
import glob
import os

SRC = r"J:\YiShen-Mothership\radar\data\raw_shipments\panjiva\dump"
OUT = r"J:\YiShen-Mothership\radar\data\raw_shipments\panjiva\2025_master_merge.xlsx"

frames = []

for f in glob.glob(SRC + r"\*.xlsx"):
    try:
        df = pd.read_excel(f)
        df["__source_file"] = os.path.basename(f)
        frames.append(df)
        print("Loaded:", f, len(df))
    except Exception as e:
        print("Skipped:", f, e)

merged = pd.concat(frames, ignore_index=True)
merged.to_excel(OUT, index=False)
print("MASTER MERGE DONE:", len(merged))
