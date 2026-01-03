# HUNTER ENGINE v1.0
# Global ICP Auto Harvest Core
# YiShen Mothership

import os, json, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "outputs")
LOG = os.path.join(ROOT, "logs")

KEYWORDS = [
    "bamboo decking importer",
    "outdoor bamboo flooring distributor",
    "compressed sofa importer",
    "vacuum packed sofa wholesaler",
    "gaming chair distributor",
    "ergonomic mesh chair buyer",
    "outdoor bamboo cladding supplier",
    "bamboo horse stable panel importer"
]

def harvest(keyword):
    print("🔍 HUNT:", keyword)
    leads = []
    for i in range(1, 6):
        leads.append({
            "company": f"{keyword.title()} Group {i}",
            "website": f"https://{keyword.replace(' ','')}{i}.com",
            "country": "UNKNOWN",
            "source": "GOOGLE_SIM",
            "pain_point": "Need stable OEM & low MOQ",
            "hook": "Boxed / Freight Saving / Private Label",
            "signal": "Active Importer",
            "score": "A"
        })
    return leads

def run():
    all_leads = []
    for kw in KEYWORDS:
        all_leads += harvest(kw)

    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    outfile = os.path.join(OUT, f"leads_{ts}.json")

    with open(outfile, "w", encoding="utf8") as f:
        json.dump(all_leads, f, indent=2, ensure_ascii=False)

    print("🚀 HUNT COMPLETE:", outfile)

if __name__ == "__main__":
    run()
