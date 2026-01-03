import pandas as pd
import os

SRC = r"J:\YiShen-Mothership\radar\data\raw_shipments\238k.csv"
OUT = r"J:\YiShen-Mothership\radar\data\raw_shipments\panjiva\2025_master_merge.xlsx"

chunks = []
CHUNK = 200000   # 20万行一段，内存安全

for chunk in pd.read_csv(SRC, chunksize=CHUNK, low_memory=False):
    chunk["__source_file"] = "238k.csv"
    chunks.append(chunk)
    print("Loaded chunk:", len(chunk))

merged = pd.concat(chunks, ignore_index=True)
merged.to_excel(OUT, index=False)
print("BIG CSV INGESTED:", len(merged))
