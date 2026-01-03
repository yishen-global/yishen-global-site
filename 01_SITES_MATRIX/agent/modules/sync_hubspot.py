import os
import json
import time
import requests
from dotenv import load_dotenv

load_dotenv()

HUBSPOT_KEY = os.getenv("HUBSPOT_API_KEY")

BASE = os.path.dirname(os.path.abspath(__file__))
INPUT = os.path.join(BASE, "..", "outputs", "leads_enriched.jsonl")
LOG_DIR = os.path.join(BASE, "..", "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "hubspot_" + time.strftime("%Y-%m-%d") + ".log")

HEADERS = {
    "Authorization": f"Bearer {HUBSPOT_KEY}",
    "Content-Type": "application/json"
}

def log(action, **kw):
    r = {"time": time.strftime("%Y-%m-%d %H:%M:%S"), "engine": "hubspot", "action": action}
    r.update(kw)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")

def upsert_company(row):
    payload = {
        "properties": {
            "name": row.get("cb_name") or row.get("company_name"),
            "domain": row.get("cb_domain") or row.get("domain"),
            "country": row.get("cb_country"),
            "city": row.get("cb_city"),
            "industry": row.get("cb_category"),
            "numberofemployees": row.get("cb_employees"),
            "website": row.get("cb_site") or row.get("website")
        }
    }
    url = "https://api.hubapi.com/crm/v3/objects/companies"
    r = requests.post(url, headers=HEADERS, json=payload)
    if r.status_code in (200,201):
        return r.json().get("id")
    return None

def upsert_contact(row, company_id):
    payload = {
        "properties": {
            "firstname": row.get("first_name",""),
            "lastname": row.get("last_name",""),
            "email": row.get("email",""),
            "jobtitle": row.get("title_hint",""),
            "company": row.get("company_name")
        }
    }
    url = "https://api.hubapi.com/crm/v3/objects/contacts"
    r = requests.post(url, headers=HEADERS, json=payload)
    if r.status_code in (200,201):
        cid = r.json().get("id")
        # Associate
        assoc = f"https://api.hubapi.com/crm/v3/objects/contacts/{cid}/associations/companies/{company_id}/contact_to_company"
        requests.put(assoc, headers=HEADERS)
        return cid
    return None

def main():
