import os
import json
import time
import requests
from dotenv import load_dotenv

load_dotenv()

NOTION_KEY = os.getenv("NOTION_API_KEY")
NOTION_DB = os.getenv("NOTION_DB_ID")

BASE = os.path.dirname(os.path.abspath(__file__))
INPUT = os.path.join(BASE, "..", "outputs", "leads_enriched.jsonl")
LOG_DIR = os.path.join(BASE, "..", "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "notion_" + time.strftime("%Y-%m-%d") + ".log")

HEADERS = {
    "Authorization": f"Bearer {NOTION_KEY}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}

def log(action, **kw):
    r = {"time": time.strftime("%Y-%m-%d %H:%M:%S"), "engine": "notion", "action": action}
    r.update(kw)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")

def push_to_notion(row):
    payload = {
        "parent": {"database_id": NOTION_DB},
        "properties": {
            "Company": {"title":[{"text":{"content": row.get("cb_name") or row.get("company_name","")}}]},
            "Website": {"url": row.get("cb_site") or row.get("website")},
            "Country": {"select":{"name": row.get("cb_country","")}},
            "City": {"rich_text":[{"text":{"content": row.get("cb_city","")}}]},
            "Industry": {"rich_text":[{"text":{"content": row.get("cb_category","")}}]},
            "Employees": {"number": row.get("cb_employees") or 0},
            "Score": {"select":{"name": row.get("lead_score","B")}},
            "Hook": {"rich_text":[{"text":{"content": row.get("hook","")}}]},
            "Signal": {"rich_text":[{"text":{"content": row.get("signal","")}}]},
            "LinkedIn": {"url": row.get("cb_linkedin") and f"https://linkedin.com/company/{row.get('cb_linkedin')}"}
        }
    }
    r = requests.post("https://api.notion.com/v1/pages", headers=HEADERS, json=payload)
    return r.status_code in (200,201)

def main():
    if not NOTION_KEY or not NOTION_DB:
        print("Missing Notion env")
        return

    synced = 0
    for line in open(INPUT, encoding="utf-8"):
        row = json.loads(line)
        if push_to_notion(row):
            synced += 1
            log("sync", company=row.get("company_name"))
            time.sleep(0.6)

    log("complete", synced=synced)
    print("Notion synced:", synced)

if __name__ == "__main__":
    main()
