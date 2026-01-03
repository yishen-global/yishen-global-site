import pandas as pd
from datetime import datetime

INPUT = "../output/merged_all_sources.csv"
OUTPUT = "contact_map.csv"

RULES = [
    ("ceo","CEO",100,"Decision"),
    ("chief","Director",95,"Decision"),
    ("head","Director",90,"Decision"),
    ("director","Director",88,"Decision"),
    ("procurement","Manager",85,"Decision"),
    ("buyer","Manager",82,"Decision"),
    ("sourcing","Manager",80,"Decision"),
    ("supply","Manager",72,"Gatekeeper"),
    ("finance","Director",65,"Finance"),
]

def classify(t):
    t=str(t).lower()
    for k,l,s,tag in RULES:
        if k in t: return l,s,tag
    return "Staff",40,"User"

def run():
    df=pd.read_csv(INPUT)
    now=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    rows=[]
    for _,r in df.iterrows():
        l,s,tag=classify(r["contact_title"])
        rows.append({
            "company_name":r["company_name"],
            "country":r["country"],
            "department":r["contact_title"],
            "contact_name":r["contact_name"],
            "contact_title":r["contact_title"],
            "email":r["email"],
            "phone":r["phone"],
            "linkedin":r["linkedin"],
            "decision_level":l,
            "influence_score":s,
            "role_tag":tag,
            "source":"merged",
            "added_at":now
        })
    pd.DataFrame(rows).to_csv(OUTPUT,index=False,encoding="utf-8-sig")
    print("🧬 contact_map.csv built")

if __name__=="__main__":
    run()
