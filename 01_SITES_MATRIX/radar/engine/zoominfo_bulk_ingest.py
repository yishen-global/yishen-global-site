import pandas as pd
import glob, os

SRC = r"J:\YiShen-Mothership\radar\data\raw_shipments\zoominfo\dump"
OUT = r"J:\YiShen-Mothership\radar\data\raw_shipments\zoominfo\zoominfo_master.xlsx"

frames = []

for f in glob.glob(SRC + r"\*.csv") + glob.glob(SRC + r"\*.xlsx"):
    try:
        df = pd.read_csv(f) if f.endswith(".csv") else pd.read_excel(f)
        df["__source_file"] = os.path.basename(f)
        frames.append(df)
        print("Loaded:", f, len(df))
    except Exception as e:
        print("Skipped:", f, e)

merged = pd.concat(frames, ignore_index=True)
merged.to_excel(OUT, index=False)
print("ZOOMINFO MASTER MERGED:", len(merged))
