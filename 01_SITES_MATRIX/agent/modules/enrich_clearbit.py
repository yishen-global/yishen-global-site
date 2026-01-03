import os
import json
import time
import requests
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

BASE = os.path.dirname(os.path.abspath(__file__))
IN_DEDUP = os.path.join(BASE, "..", "outputs", "leads_dedup.jsonl")
IN_RAW = os.path.join(BASE, "..", "outputs", "leads_raw.jsonl")
OUT_ENRICH = os.path.join(BASE, "..", "outputs", "leads_enriched.jsonl")
LOG_DIR = os.path.join(BASE, "..", "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "enrich_" + time.strftime("%Y-%m-%d") + ".log")

CLEARBIT_KEY = os.getenv("CLEARBIT_API_KEY")
HEADERS = {
    "Authorization": f"Bearer {CLEARBIT_KEY}",
    "Content-Type": "application/json"
}

def log(action, **kwargs):
    entry = {"time": time.strftime("%Y-%m-%d %H:%M:%S"), "engine":"clearbit_enrich", "action": action}
    entry.update(kwargs)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

def domain_from_url(url):
    try:
        return urlparse(url).netloc.replace("www.","").lower()
    except:
        return ""

def clearbit_company_lookup(domain):
    url = "https://company.clearbit.com/v2/companies/find"
    params = {"domain": domain}
    r = requests.get(url, headers=HEADERS, params=params, timeout=20)
    if r.status_code == 200:
        return r.json()
    return None

def load_input():
    if os.path.exists(IN_DEDUP):
        return [json.loads(x) for x in open(IN_DEDUP, encoding="utf-8")]
    return [json.loads(x) for x in open(IN_RAW, encoding="utf-8")]

def main():
    if not CLEARBIT_KEY:
        print("Missing CLEARBIT_API_KEY in .env")
        return

    src = load_input()
    enriched_count = 0

    with open(OUT_ENRICH, "a", encoding="utf-8") as fout:
        for row in src:
            website = row.get("website","")
            domain = domain_from_url(website)
            if not domain:
                continue

            data = clearbit_company_lookup(domain)
            if not data:
                log("miss", domain=domain)
                continue

            # Pick useful fields (you can expand later)
            enriched = row.copy()
            enriched["cb_name"] = data.get("name")
            enriched["cb_domain"] = data.get("domain")
            enriched["cb_category"] = (data.get("category") or {}).get("industry")
            enriched["cb_country"] = (data.get("geo") or {}).get("country")
            enriched["cb_city"] = (data.get("geo") or {}).get("city")
            enriched["cb_employees"] = (data.get("metrics") or {}).get("employees")
            enriched["cb_raised"] = (data.get("metrics") or {}).get("raised")
            enriched["cb_foundedYear"] = data.get("foundedYear")
            enriched["cb_linkedin"] = (data.get("linkedin") or {}).get("handle")
            enriched["cb_twitter"] = (data.get("twitter") or {}).get("handle")
            enriched["cb_facebook"] = (data.get("facebook") or {}).get("handle")
            enriched["cb_logo"] = (data.get("logo") or "")
            enriched["cb_site"] = (data.get("site") or {}).get("url")

            fout.write(json.dumps(enriched, ensure_ascii=False) + "\n")
            enriched_count += 1
            log("hit", domain=domain)
            time.sleep(1.2)  # respect rate limit

    log("complete", enriched=enriched_count)
    print("Clearbit enriched:", enriched_count)

if __name__ == "__main__":
    main()
