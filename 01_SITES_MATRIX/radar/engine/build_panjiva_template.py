import pandas as pd
import os

OUT = r"J:\YiShen-Mothership\radar\data\raw_shipments\panjiva_buyers.xlsx"

cols = [
    "Buyer Name","Country","City","State/Region","Postal Code",
    "Full Address (main address)","Revenue","Employees Count",
    "Total Number of Shipments","Number of Matched Shipments",
    "Weight of Matching Shipments (kg)","Value of Matching China Trade Data (USD)",
    "Last Shipment Date of Matched Shipments",
    "Top 3 Suppliers","Top 5 Products",
    "Phone","Email","Website","Contact Person","Panjiva URL"
]

df = pd.DataFrame(columns=cols)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
df.to_excel(OUT, index=False)
print("panjiva_buyers.xlsx TEMPLATE CREATED ->", OUT)
