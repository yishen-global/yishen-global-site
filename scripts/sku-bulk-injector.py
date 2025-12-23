import json, random, string
from datetime import datetime

LEDGER = "sku-database.json"

CATEGORIES = [
    "OFFICE_FURNITURE", "GAMING_CHAIR", "MEDICAL_PRECISION",
    "MARITIME_HARDWARE", "INFRA_TOOLS", "CARBON_NEUTRAL", "LIFTING_SYSTEM"
]

def rand_sku():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

def build_sku(i):
    cat = random.choice(CATEGORIES)
    sku = f"{cat}_{rand_sku()}"
    return {
        "id": sku,
        "category": cat,
        "name": f"{cat} Sovereign Node {i}",
        "tagline": "Autonomous Industrial Sovereign Asset",
        "hs_code": "AUTO_SYNC",
        "image": "assets/system/node-active-stub.webp",
        "technical_data": {
            "material": "AI_SCANNED",
            "standard": "ISO / BIFMA / ISTA",
            "logistics": f"ISTA-6A / {round(random.uniform(0.12, 1.8), 2)} CBM",
            "market_logic": "GLOBAL_AUTO_GROWTH"
        }
    }

def main(count=100):
    try:
        with open(LEDGER, "r", encoding="utf-8") as f:
            db = json.load(f)
    except:
        db = {"products": [], "last_sync": ""}

    start = len(db["products"])
    for i in range(count):
        db["products"].append(build_sku(start + i + 1))

    db["last_sync"] = datetime.now().isoformat()

    with open(LEDGER, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    print(f">>> SKU BULK INJECTED: {count} NEW NODES MANIFESTED.")

if __name__ == "__main__":
    import sys
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    main(n)
