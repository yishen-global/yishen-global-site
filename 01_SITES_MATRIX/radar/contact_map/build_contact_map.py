import pandas as pd
from datetime import datetime

INPUT = "output/merged_all_sources.csv"
OUTPUT = "output/contact_map.csv"

DECISION_KEYWORDS = {
    "ceo": ("CEO",95,"Decision"),
    "chief": ("Director",90,"Decision"),
    "head": ("Director",88,"Decision"),
    "director": ("Director",85,"Decision"),
    "procurement": ("Manager",82,"Decision"),
    "buyer": ("Manager",80,"Decision"),
    "sourcing": ("Manager",78,"Decision"),
    "supply": ("Manager",70,"Gatekeeper"),
    "finance": ("Director",65,"Finance"),
    "account": ("Manager",60,"Finance")
}

def classify(title):
    t = str(title).lower()
    for k,(lvl,score,tag) in DECISION_KEYWORDS.items():
        if k in t:
            return lvl,score,tag
    return "Staff",40,"User"

def run():
    df = pd.read_csv(INPUT)
    rows = []
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for _,r in df.iterrows():
        lvl,score,tag = classify(r.get("contact_title",""))
        rows.append({
            "company_name": r.get("company_name",""),
            "country": r.get("country",""),
            "department": r.get("contact_title",""),
            "contact_name": r.get("contact_name",""),
            "contact_title": r.get("contact_title",""),
            "email": r.get("email",""),
            "phone": r.get("phone",""),
            "linkedin": r.get("linkedin",""),
            "decision_level": lvl,
            "influence_score": score,
            "role_tag": tag,
            "source": "merged",
            "added_at": now
        })

    pd.DataFrame(rows).to_csv(OUTPUT,index=False,encoding="utf-8-sig")
    print(f"🧠 Contact Map Built: {len(rows)} nodes")

if __name__ == "__main__":
    run()
