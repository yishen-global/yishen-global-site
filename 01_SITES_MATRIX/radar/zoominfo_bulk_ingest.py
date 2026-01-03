import os, csv, time, requests
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

ZOOMINFO_KEY = os.getenv("ZOOMINFO_API_KEY")
OUTPUT = "data_raw/zoominfo_raw.csv"

BASE = "https://api.zoominfo.com/search/company"

TARGET_INDUSTRIES = [
    "Furniture","Office Furniture","Home Furnishings",
    "Interior Design","Construction","Building Materials"
]

TARGET_COUNTRIES = ["United States", "Saudi Arabia", "United Arab Emirates"]

FIELDS = [
    "company_name","website","industry","country",
    "contact_name","contact_title","email","phone","linkedin",
    "last_import_date","import_volume","top_product"
]

def run():
    os.makedirs("data_raw", exist_ok=True)
    rows = []

    for country in TARGET_COUNTRIES:
        for industry in TARGET_INDUSTRIES:
            payload = {
                "api_key": ZOOMINFO_KEY,
                "country": country,
                "industry": industry,
                "page": 1
            }

            while True:
                r = requests.post(BASE, json=payload, timeout=30)
                data = r.json()
                companies = data.get("companies", [])
                if not companies:
                    break

                for c in companies:
                    rows.append({
                        "company_name": c.get("companyName"),
                        "website": c.get("website"),
                        "industry": industry,
                        "country": country,
                        "contact_name": c.get("contact", {}).get("fullName"),
                        "contact_title": c.get("contact", {}).get("jobTitle"),
                        "email": c.get("contact", {}).get("email"),
                        "phone": c.get("contact", {}).get("phone"),
                        "linkedin": c.get("contact", {}).get("linkedinUrl"),
                        "last_import_date": "",
                        "import_volume": "",
                        "top_product": ""
                    })

                payload["page"] += 1
                time.sleep(1)

    with open(OUTPUT, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"🔍 ZoomInfo Ingest Completed: {len(rows)} companies")

if __name__ == "__main__":
    run()
