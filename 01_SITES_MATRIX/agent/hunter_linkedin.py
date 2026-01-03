import os
import json
import time
import requests
from datetime import datetime
from dotenv import load_dotenv
from urllib.parse import quote

load_dotenv()

LINKEDIN_SESSION = os.getenv("LINKEDIN_SESSION")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(BASE_DIR, "outputs")
LOG_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

INPUT_FILE = os.path.join(OUT_DIR, "leads_raw.jsonl")
OUTPUT_FILE = os.path.join(OUT_DIR, "leads_hunted.jsonl")
LOG_FILE = os.path.join(LOG_DIR, "hunter_" + datetime.now().strftime("%Y-%m-%d") + ".log")

TARGET_TITLES = [
    "Head of Procurement", "Sourcing Director", "Category Manager",
    "Product Manager", "Import Manager", "Supply Chain Director",
    "Buyer", "Merchandising Manager", "Purchasing Manager",
    "Private Label Manager"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Cookie": f"li_at={LINKEDIN_SESSION}"
}

def log(action, **kwargs):
    entry = {
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "engine": "linkedin_hunter",
        "action": action
    }
    entry.update(kwargs)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

def google_linkedin_search(company):
    query = f'site:linkedin.com/in "{company}" ("procurement" OR "buyer" OR "sourcing" OR "category")'
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": os.getenv("GOOGLE_API_KEY"),
        "cx": os.getenv("GOOGLE_CSE_ID"),
        "q": query
    }
    r = requests.get(url, params=params)
    return r.json().get("items", [])

def hunt():
    if not os.path.exists(INPUT_FILE):
        print("No leads_raw.jsonl found.")
        return

    with open(INPUT_FILE, encoding="utf-8") as f:
        leads = [json.loads(x) for x in f]

    hunted = []
    log("boot", leads=len(leads))

    for lead in leads:
        company = lead["company_name"]
        results = google_linkedin_search(company)

        for r in results[:3]:
            hunted.append({
                "company": company,
                "company_site": lead["website"],
                "linkedin_profile": r.get("link"),
                "title_hint": r.get("title"),
                "snippet": r.get("snippet"),
                "hunted_at": str(datetime.now())
            })

        time.sleep(1)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for h in hunted:
            f.write(json.dumps(h, ensure_ascii=False) + "\n")

    log("complete", hunted=len(hunted))
    print("Hunter completed:", len(hunted), "buyer profiles")

if __name__ == "__main__":
    hunt()
