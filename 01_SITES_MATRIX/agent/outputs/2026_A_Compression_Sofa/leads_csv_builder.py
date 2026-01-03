import os
import json
import csv
from datetime import datetime

BASE = os.path.dirname(os.path.abspath(__file__))
INPUT_RAW = os.path.join(BASE, "..", "outputs", "leads_raw.jsonl")
INPUT_HUNT = os.path.join(BASE, "..", "outputs", "leads_hunted.jsonl")
OUTPUT_CSV = os.path.join(BASE, "..", "outputs", "leads.csv")

FIELDS = [
    "lead_id","company","website","linkedin_profile","title",
    "country","product_focus","buyer_type","lead_score",
    "pain_point","hook","signal","boolean",
    "whatsapp_ready","email","created_at"
]

def score_lead(text):
    t = text.lower()
    if "private label" in t or "sofa in a box" in t:
        return "A+"
    if "distributor" in t or "importer" in t:
        return "A"
    return "B"

def build():
    raw = [json.loads(x) for x in open(INPUT_RAW, encoding="utf-8")]
    hunted = [json.loads(x) for x in open(INPUT_HUNT, encoding="utf-8")]

    rows = []
    for h in hunted:
        r = next((x for x in raw if x["company_name"] == h["company"]), None)
        if not r: continue

        score = score_lead(h["snippet"])

        rows.append({
            "lead_id": r["lead_id"],
            "company": h["company"],
            "website": r["website"],
            "linkedin_profile": h["linkedin_profile"],
            "title": h["title_hint"],
            "country": "",
            "product_focus": "Compression Sofa / Sofa in a Box",
            "buyer_type": r.get("buyer_model_hint",""),
            "lead_score": score,
            "pain_point": "High freight cost / Slow inventory turn",
            "hook": "Sofa in a Box / 60% CBM saving",
            "signal": "Small space / Apartment / DTC growth",
            "boolean": "private_label_possible=true",
            "whatsapp_ready": "YES",
            "email": "",
            "created_at": str(datetime.now())
        })

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for r in rows:
            w.writerow(r)

    print("leads.csv built:", len(rows))

if __name__ == "__main__":
    build()
