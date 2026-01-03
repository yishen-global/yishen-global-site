import os
import re
import csv
import json
import time
import hashlib
import argparse
from datetime import datetime
from dataclasses import dataclass, asdict
from urllib.parse import urlparse
import requests
from dotenv import load_dotenv

load_dotenv()

# ========================
# ENV
# ========================
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")

# ========================
# PATHS
# ========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(BASE_DIR, "outputs")
LOG_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR, "radar_" + datetime.now().strftime("%Y-%m-%d") + ".log")

# ========================
# UTIL
# ========================

def log(action, status="ok", **kwargs):
    entry = {
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "engine": "google_radar",
        "action": action,
        "status": status
    }
    entry.update(kwargs)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

def normalize_domain(url: str) -> str:
    try:
        return urlparse(url).netloc.replace("www.", "").lower()
    except:
        return ""

def hash_id(*parts):
    return hashlib.sha256("|".join(parts).encode()).hexdigest()[:16]

EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", re.I)

# ========================
# DATA STRUCTURE
# ========================

@dataclass
class Lead:
    lead_id: str
    company_name: str
    website: str
    domain: str
    query: str
    source_url: str
    snippet: str
    emails_found: str
    product_line: str
    created_at: str

# ========================
# GOOGLE SEARCH
# ========================

def google_search(q, start=1):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {"key": GOOGLE_API_KEY, "cx": GOOGLE_CSE_ID, "q": q, "start": start}
    r = requests.get(url, params=params, timeout=30)
    r.raise_for_status()
    return r.json()

# ========================
# MAIN RADAR ENGINE
# ========================

def build_queries():
    base = [
        '"sofa in a box"', '"compression sofa"', '"boxed sofa"',
        '"vacuum packed sofa"', '"compact sofa"', '"space saving sofa"'
    ]
    intents = ["distributor", "wholesale", "private label", "importer", "brand", "manufacturer"]
    queries = []
    for b in base:
        for i in intents:
            queries.append(f"{b} {i} -alibaba -1688 -temu -shein")
    return list(set(queries))

def main():
    log("boot", message="Radar started")
    queries = build_queries()
    all_leads = []
    seen_domains = set()

    for q in queries:
        for p in range(1, 21, 10):
            try:
                data = google_search(q, p)
            except Exception as e:
                log("error", status="fail", query=q, error=str(e))
                continue

            for it in data.get("items", []):
                link = it.get("link")
                domain = normalize_domain(link)
                if not domain or domain in seen_domains:
                    continue
                seen_domains.add(domain)

                title = it.get("title", "")
                snippet = it.get("snippet", "")
                emails = ",".join(set(EMAIL_PATTERN.findall(snippet)))

                lead = Lead(
                    lead_id=hash_id(domain),
                    company_name=title.split("|")[0].strip(),
                    website="https://" + domain,
                    domain=domain,
                    query=q,
                    source_url=link,
                    snippet=snippet,
                    emails_found=emails,
                    product_line="A_Compression_Sofa",
                    created_at=str(datetime.now())
                )
                all_leads.append(lead)

            time.sleep(1)

    raw_path = os.path.join(OUT_DIR, "leads_raw.jsonl")
    csv_path = os.path.join(OUT_DIR, "leads.csv")

    with open(raw_path, "w", encoding="utf-8") as f:
        for l in all_leads:
            f.write(json.dumps(asdict(l), ensure_ascii=False) + "\n")

    if all_leads:
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=asdict(all_leads[0]).keys())
            writer.writeheader()
            for l in all_leads:
                writer.writerow(asdict(l))

    log("complete", total=len(all_leads), raw_file=raw_path, csv_file=csv_path)
    print(f"Radar finished. Leads: {len(all_leads)}")

if __name__ == "__main__":
    main()
