import pandas as pd
import re

ICP = r"J:\YiShen-Mothership\radar\data\icp_pool\icp_hot_pool.csv"
APO = r"J:\YiShen-Mothership\radar\data\raw_shipments\apollo\apollo_master.xlsx"
OUT = r"J:\YiShen-Mothership\radar\data\icp_pool\icp_hot_pool_enriched.csv"

print("Loading ICP pool...")
icp = pd.read_csv(ICP)
print("Loading Apollo master...")
apo = pd.read_excel(APO)

def normalize(x):
    if pd.isna(x): return ""
    return re.sub(r'[^a-z0-9]', '', str(x).lower())

icp["org_key"] = icp["org_name"].apply(normalize)
apo["org_key"] = apo["Company Name"].apply(normalize)

# 只取 Apollo 中最有价值字段
apo_small = apo[[
    "org_key","First Name","Last Name","Job Title","Email",
    "Phone","LinkedIn URL","Company Website"
]]

merged = icp.merge(apo_small, on="org_key", how="left")

merged.to_csv(OUT, index=False)
print("ENRICHED ICP POOL READY ->", OUT)
