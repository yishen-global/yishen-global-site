import pandas as pd
import re

ICP = r"J:\YiShen-Mothership\radar\data\icp_pool\icp_hot_pool_enriched.csv"
ZOOM = r"J:\YiShen-Mothership\radar\data\raw_shipments\zoominfo\zoominfo_master.xlsx"
OUT = r"J:\YiShen-Mothership\radar\data\icp_pool\icp_hot_pool_sov.csv"

def norm(x):
    if pd.isna(x): return ""
    return re.sub(r'[^a-z0-9]', '', str(x).lower())

icp = pd.read_csv(ICP)
zoom = pd.read_excel(ZOOM)

icp["org_key"] = icp["org_name"].apply(norm)
zoom["org_key"] = zoom["Company Name"].apply(norm)

zoom_small = zoom[[
    "org_key","First Name","Last Name","Job Title",
    "Direct Phone","Mobile Phone","Email","LinkedIn URL",
    "Revenue Range","Employee Count","Technologies","Buying Intent"
]]

merged = icp.merge(zoom_small, on="org_key", how="left")
merged.to_csv(OUT, index=False)
print("SOVEREIGN ICP READY ->", OUT)
