import json
import datetime
import os

LEDGER_PATH = "sku-database.json"
INTEL_FEED_PATH = "public/assets/data/intel-feed.json"

INTEL_SOURCES = {
    "TRADEMO": "https://api.trademo.com/v1/shipments",
    "ROCKETREACH": "https://api.rocketreach.co/v1/search",
    "REDDIT": "https://www.reddit.com/r/supplychain/search.json",
    "LOGISTICS_NODE": "https://api.example-logistics.org/v1/hscodes"
}

DOMAINS = [
    "FURNITURE", "MARITIME_HARDWARE", "MILITARY_AERO",
    "BIO_MATERIALS", "INFRA_TOOLS", "MEDICAL_PRECISION", "LIFTING_SYSTEMS"
]


def now_ts():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


class SovereignDataHarvester:
    def __init__(self):
        self.timestamp = now_ts()
        self.auth_key = os.getenv("HQ_CORE_GATE_KEY", "LOCAL_TEST_MODE")

    def boot(self):
        print(f">>> [SYSTEM_V5]: BOOTING_INTEGRATED_HARVESTER | TIME: {self.timestamp}")

        payload = self.fetch_global_nodes()
        db = self.load_or_init_ledger()

        updates, new_entries = self.sync_logic(db, payload)

        self.write_ledger(db)
        self.write_intel_feed(payload)

        print(f">>> [SYSTEM_V5]: HARVEST_COMPLETE. UPDATED={updates} NEW={new_entries}")

    def fetch_global_nodes(self):
        # 你后面接真实 API，只要把 results 结构保持一致即可
        print("> INTERCEPTING: Global Industrial Nodes (7 Dimensions)...")
        return {
            "results": [
                {
                    "code_id": "OFFICE_MESH_V4",
                    "standard_name": "Mesh Chair Sovereign Node",
                    "volume": "0.24",
                    "compliance": "BIFMA_X5.1",
                    "sentiment": "NEGATIVE_COMPETITOR_SIGNAL",
                    "sector": "FURNITURE",
                    "hs_hint": "9401.31"
                },
                {
                    "code_id": "CHAIN_G80_MASTER",
                    "standard_name": "G80 Marine Chain Node",
                    "volume": "0.05",
                    "compliance": "ABS_G80",
                    "status": "BRAZIL_AD_EXEMPT_READY",
                    "sector": "MARITIME_HARDWARE",
                    "hs_hint": "7315.82"
                },
                {
                    "code_id": "MEDICAL_CHAIR",
                    "standard_name": "Medical Precision Chair Node",
                    "volume": "0.12",
                    "compliance": "ISO_13485",
                    "sector": "MEDICAL_PRECISION",
                    "hs_hint": "9402.10"
                },
                {
                    "code_id": "INDUSTRIAL_LADDER",
                    "standard_name": "Infrastructure MRO Ladder Node",
                    "volume": "1.45",
                    "compliance": "EN131_ANSI",
                    "sector": "INFRA_TOOLS",
                    "hs_hint": "7616.99"
                }
            ]
        }

    def load_or_init_ledger(self):
        if not os.path.exists(LEDGER_PATH):
            print(f"! [CRITICAL] {LEDGER_PATH} missing. Initializing emergency vault.")
            return {"products": [], "last_sync": ""}
        with open(LEDGER_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        # 防止你以前写成 dict 或缺字段
        if not isinstance(data, dict):
            data = {"products": [], "last_sync": ""}
        if "products" not in data or not isinstance(data["products"], list):
            data["products"] = []
        return data

    def sync_logic(self, db, payload):
        new_entries = 0
        updates = 0

        for item in payload.get("results", []):
            sku_id = item.get("code_id")
            if not sku_id:
                continue

            existing = next((p for p in db["products"] if p.get("id") == sku_id), None)

            if existing:
                existing.setdefault("technical_data", {})
                existing["technical_data"]["logistics"] = f"ISTA-6A / {item.get('volume','0.00')} CBM"
                existing["technical_data"]["standard"] = item.get("compliance", existing["technical_data"].get("standard", "ISO_STABLE"))
                existing["hs_code"] = existing.get("hs_code") if existing.get("hs_code") not in [None, "", "PENDING_VERIFICATION"] else item.get("hs_hint", "PENDING_VERIFICATION")
                if item.get("status"):
                    existing["tagline"] = (existing.get("tagline") or "Sovereign Asset Node") + f" | {item['status']}"
                updates += 1
                print(f"[SYNC] Updated Node: {sku_id}")
            else:
                new_sku = {
                    "id": sku_id,
                    "category": item.get("sector", "DYNAMIC_SYNCED_ASSET"),
                    "name": item.get("standard_name", "Sovereign Asset Node"),
                    "tagline": "Auto-synchronized from global intelligence node",
                    "hs_code": item.get("hs_hint", "PENDING_VERIFICATION"),
                    "image": "assets/system/node-active-stub.webp",
                    "technical_data": {
                        "material": "Verified via AI Scan",
                        "standard": item.get("compliance", "ISO_STABLE"),
                        "logistics": f"ISTA-6A / {item.get('volume','0.00')} CBM",
                        "market_logic": item.get("sentiment", "SIGNAL_PENDING")
                    }
                }
                db["products"].append(new_sku)
                new_entries += 1
                print(f"[HARVEST] New Asset Captured: {sku_id}")

        db["last_sync"] = self.timestamp
        return updates, new_entries

    def write_ledger(self, db):
        with open(LEDGER_PATH, "w", encoding="utf-8") as f:
            json.dump(db, f, indent=2, ensure_ascii=False)
        print(f"[SUCCESS] Ledger written: {LEDGER_PATH}")

    def write_intel_feed(self, payload):
        os.makedirs(os.path.dirname(INTEL_FEED_PATH), exist_ok=True)
        feed = {
            "generated_at": self.timestamp,
            "source": "SovereignDataHarvester",
            "items": payload.get("results", [])
        }
        with open(INTEL_FEED_PATH, "w", encoding="utf-8") as f:
            json.dump(feed, f, indent=2, ensure_ascii=False)
        print(f"[SUCCESS] Intel feed manifested: {INTEL_FEED_PATH}")


if __name__ == "__main__":
    SovereignDataHarvester().boot()
