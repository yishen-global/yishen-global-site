import requests, os, time, csv
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

APOLLO_KEY = os.getenv("APOLLO_API_KEY")
OUTPUT = "data_raw/apollo_raw.csv"

BASE = "https://api.apollo.io/v1/mixed_people/search"

TARGET_INDUSTRIES = [
    "Furniture", "Office Furniture", "Home Furnishings",
    "Building Materials", "Interior Design", "Construction"
]

TARGET_COUNTRIES = ["United States", "Canada", "Mexico"]

HEADERS = {
    "Content-Type": "application/json",
    "X-Api-Key": APOLLO_KEY
}

FIELDS = [
    "company_name", "website", "industry", "country",
    "contact_name", "contact_title", "email", "phone", "linkedin"
]

def run():
    os.makedirs("data_raw", exist_ok=True)
    all_rows = []

    for country in TARGET_COUNTRIES:
        payload = {
            "q_organization_industry_names": TARGET_INDUSTRIES,
            "q_organization_locations": [country],
            "page": 1,
            "per_page": 100
        }

        while True:
            r = requests.post(BASE, json=payload, headers=HEADERS)
            data = r.json()

            people = data.get("people", [])
            if not people:
                break

            for p in people:
                org = p.get("organization", {})
                all_rows.append({
                    "company_name": org.get("name"),
                    "website": org.get("website_url"),
                    "industry": org.get("industry"),
                    "country": org.get("country"),
                    "contact_name": f"{p.get('first_name','')} {p.get('last_name','')}",
                    "contact_title": p.get("title"),
                    "email": p.get("email"),
                    "phone": p.get("phone_numbers",[{}])[0].get("raw_number"),
                    "linkedin": p.get("linkedin_url")
                })

            payload["page"] += 1
            time.sleep(1)

    with open(OUTPUT, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"🛰 Apollo Ingest Completed: {len(all_rows)} leads")

if __name__ == "__main__":
    run()
