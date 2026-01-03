import pandas as pd
from pathlib import Path

ICP = Path("../data/hot_pool/icp_hot_pool.csv")
APOLLO = Path("../data/raw_shipments/apollo_contacts_export.xlsx")
OUT = Path("../data/contact_map/icp_contact_map.csv")

def run():
    icp = pd.read_csv(ICP)
    apollo = pd.read_excel(APOLLO)

    merged = icp.merge(apollo, left_on="org_name", right_on="Company", how="left")
    merged[["org_name","country","Name","Title","Email","LinkedIn"]].to_csv(OUT,index=False)
    print("🧭 icp_contact_map.csv generated")

if __name__ == "__main__":
    run()
