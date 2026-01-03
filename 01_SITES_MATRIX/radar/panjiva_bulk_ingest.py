import os
import csv
from datetime import datetime
from dotenv import load_dotenv
import requests
import time

load_dotenv()

PANJIVA_KEY = os.getenv("PANJIVA_API_KEY")
OUTPUT = "data_raw/panjiva_raw.csv"

BASE = "https://api.panjiva.com/api/v3/shipment/search"

TARGET_COUNTRIES = [
    "United States", "Saudi Arabia", "United Arab Emirates"
]

TARGET_HS = [
    "9401",  # chairs
    "9403",  # furniture
    "4418",  # flooring/wood building
    "9405"   # lighting
]

FIELDS = [
    "company_name","website","industry","country",
    "contact_name","contact_title","email","phone","linkedin",
    "last_import_date","import_volume","top_product"
]

def run():
    os.makedirs("data_raw", exist_ok=True)
    rows = []

    for country in TARGET_COUNTRIES:
        for hs in TARGET_HS:
            payload = {
                "api_key": PANJIVA_KEY,
                "country_of_import": country,
                "hs_code": hs,
                "page": 1
            }

            while True:
                r = requests.post(BASE, json=payload, timeout=30)
                data = r.json()

                shipments = data.get("shipments", [])
                if not shipments:
                    break

                for s in shipments:
                    importer = s.get("importer", {})
                    rows.append({
                        "company_name": importer.get("name"),
                        "website": "",
                        "industry": "Import / Trade",
                        "country": country,
                        "contact_name": "",
                        "contact_title": "",
                        "email": "",
                        "phone": "",
                        "linkedin": "",
                        "last_import_date": s.get("arrival_date"),
                        "import_volume": s.get("weight_kg") or s.get("teu"),
                        "top_product": s.get("product_description")
                    })

                payload["page"] += 1
                time.sleep(1)

    with open(OUTPUT, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"🚢 Panjiva Ingest Completed: {len(rows)} import records")

if __name__ == "__main__":
    run()
