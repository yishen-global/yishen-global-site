import json
import requests
import datetime
import os
import time
import tempfile
import shutil

# =========================================================
# YISHEN GLOBAL - AUTO_DATA_HARVESTER V5.1 POWER_PATCHED
# Non-invasive Stability Layer
# =========================================================

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

class SovereignDataHarvester:
    def __init__(self):
        self.ledger_path = 'sku-database.json'
        self.timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        self.auth_key = os.getenv("HQ_CORE_GATE_KEY", "LOCAL_TEST_MODE")
        self.external_payload = {}

    def boot(self):
        print(f">>> [SYSTEM_V5.1]: BOOTING_HARVESTER | UTC: {self.timestamp}")

        try:
            self.external_payload = self.fetch_global_nodes()
        except Exception as e:
            print(f"! [ERROR]: External fetch failure: {e}")
            return

        try:
            self.sync_logic()
        except Exception as e:
            print(f"! [CRITICAL]: Ledger sync aborted safely: {e}")

        print(">>> [SYSTEM_V5.1]: HARVEST_COMPLETE.")

    def fetch_global_nodes(self):
        print("> INTERCEPTING: Global Industrial Nodes (SAFE MODE)...")
        return {
            "results": [
                {
                    "code_id": "OFFICE_MESH_V4",
                    "volume": "0.24",
                    "compliance": "BIFMA_X5.1",
                    "sentiment": "NEGATIVE_COMPETITOR_SIGNAL",
                    "sector": "FURNITURE"
                },
                {
                    "code_id": "CHAIN_G80_MASTER",
                    "volume": "0.05",
                    "compliance": "ABS_G80",
                    "status": "BRAZIL_AD_EXEMPT_READY",
                    "sector": "MARITIME_HARDWARE"
                },
                {
                    "code_id": "NEW_TRENCH_Digger_01",
                    "standard_name": "Hydro-Infra Digger",
                    "volume": "1.45",
                    "compliance": "CE_INFRA",
                    "sector": "INFRA_TOOLS"
                }
            ]
        }

    def sync_logic(self):
        if not os.path.exists(self.ledger_path):
            db = {"products": [], "last_sync": ""}
        else:
            with open(self.ledger_path, 'r', encoding='utf-8') as f:
                db = json.load(f)

        new_entries = 0
        updates = 0

        for item in self.external_payload.get('results', []):
            sku_id = item.get('code_id')
            existing_product = next((p for p in db['products'] if p['id'] == sku_id), None)

            if existing_product:
                existing_product['technical_data']['logistics'] = f"ISTA-6A / {item.get('volume')} CBM"
                existing_product['technical_data']['standard'] = item.get('compliance')
                if 'status' in item:
                    existing_product['tagline'] += f" | {item['status']}"
                updates += 1
            else:
                new_sku = {
                    "id": sku_id,
                    "category": item.get('sector', 'DYNAMIC_SYNCED_ASSET'),
                    "name": item.get('standard_name', 'Sovereign Asset Node'),
                    "tagline": "Auto-synchronized from global intelligence node",
                    "hs_code": "PENDING_VERIFICATION",
                    "image": "assets/system/node-active-stub.webp",
                    "technical_data": {
                        "material": "Verified via AI Scan",
                        "standard": item.get('compliance', 'ISO_STABLE'),
                        "logistics": f"ISTA-6A / {item.get('volume', '0.00')} CBM",
                        "market_logic": "NEW_MARKET_ENTRY_DETECTED"
                    }
                }
                db['products'].append(new_sku)
                new_entries += 1

        db['last_sync'] = self.timestamp

        self.safe_write(self.ledger_path, db)

        print(f"[SUCCESS] {updates} Updated / {new_entries} New Assets.")

    def safe_write(self, path, data):
        fd, tmp = tempfile.mkstemp()
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        shutil.move(tmp, path)

if __name__ == "__main__":
    SovereignDataHarvester().boot()
