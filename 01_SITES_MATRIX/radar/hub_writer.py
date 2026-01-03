import os
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

HUB_TOKEN = os.getenv("HUBSPOT_TOKEN")
BASE = "https://api.hubapi.com"
HEADERS = {
    "Authorization": f"Bearer {HUB_TOKEN}",
    "Content-Type": "application/json"
}

# 只推送高优先级
ALLOWED_PRIORITY = {"A+", "A"}

POOLS = [
    "saudi_hot_pool.csv",
    "usa_hot_pool.csv",
    "uae_hot_pool.csv"
]

# ========== HubSpot Helpers ==========

def hs_search_contact_by_email(email):
    url = f"{BASE}/crm/v3/objects/contacts/search"
    payload = {
        "filterGroups": [{
            "filters": [{"propertyName": "email", "operator": "EQ", "value": email}]
        }]
    }
    r = requests.post(url, headers=HEADERS, json=payload, timeout=30)
    data = r.json()
    results = data.get("results", [])
    return results[0] if results else None

def hs_create_or_update_contact(row):
    email = row.get("email")
    if not email:
        return None

    existing = hs_search_contact_by_email(email)

    props = {
        "email": email,
        "firstname": row.get("contact_name", "").split(" ")[0],
        "lastname": " ".join(row.get("contact_name", "").split(" ")[1:]),
        "jobtitle": row.get("contact_title", ""),
        "company": row.get("company_name", ""),
        "website": row.get("website", ""),
        "country": row.get("country", ""),
        "phone": row.get("phone", ""),
        "linkedin_profile": row.get("linkedin", ""),
        "hs_lead_status": "NEW",
        "lifecyclestage": "lead",
        "lead_source": "YiShen Radar",
        "radar_priority": row.get("priority_level", ""),
        "radar_signal_score": str(row.get("signal_score", "")),
        "radar_top_product": row.get("top_product", ""),
        "radar_sku_gap": row.get("sku_gap", ""),
        "radar_last_import": row.get("last_import_date", "")
    }

    if existing:
        cid = existing["id"]
        url = f"{BASE}/crm/v3/objects/contacts/{cid}"
        requests.patch(url, headers=HEADERS, json={"properties": props}, timeout=30)
        return cid
    else:
        url = f"{BASE}/crm/v3/objects/contacts"
        r = requests.post(url, headers=HEADERS, json={"properties": props}, timeout=30)
        return r.json().get("id")

def hs_create_deal(contact_id, row):
    if not contact_id:
        return

    deal_name = f"{row.get('company_name','')} | Radar Lead"
    amount = row.get("import_volume") or "0"

    props = {
        "dealname": deal_name,
        "amount": str(amount),
        "pipeline": "default",
        "dealstage": "appointmentscheduled",
        "radar_country": row.get("country", ""),
        "radar_priority": row.get("priority_level", ""),
        "radar_signal_score": str(row.get("signal_score", "")),
        "radar_top_product": row.get("top_product", "")
    }

    url = f"{BASE}/crm/v3/objects/deals"
    r = requests.post(url, headers=HEADERS, json={"properties": props}, timeout=30)
    deal_id = r.json().get("id")

    if deal_id:
        # 关联联系人
        assoc = f"{BASE}/crm/v3/objects/deals/{deal_id}/associations/contacts/{contact_id}/deal_to_contact"
        requests.put(assoc, headers=HEADERS, timeout=30)

def process_pool(path):
    if not os.path.exists(path):
        print(f"⚠️ Missing pool: {path}")
        return

    df = pd.read_csv(path)
    df = df[df["priority_level"].isin(ALLOWED_PRIORITY)]

    print(f"→ Pushing {len(df)} records from {path}")

    for _, row in df.iterrows():
        cid = hs_create_or_update_contact(row)
        hs_create_deal(cid, row)

def run():
    for p in POOLS:
        process_pool(p)
    print("🧲 HubSpot sync completed.")

if __name__ == "__main__":
    run()
