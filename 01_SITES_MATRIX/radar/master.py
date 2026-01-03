import os
from datetime import datetime

from panjiva_bulk_ingest import run as panjiva
from zoominfo_bulk_ingest import run as zoominfo
from apollo_bulk_ingest import run as apollo
from merge_all_sources import run as merge
from build_icp_master_pool import run as icp
from signal_scoring import run as score
from build_hot_pool import run as hot
from hub_writer import run as hub

LOG = "logs/radar.log"

def log(msg):
    os.makedirs("logs", exist_ok=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now()}] {msg}\n")
    print(msg)

def sovereign_boot():
    log("=== Sovereign Radar Boot ===")
    panjiva()
    zoominfo()
    apollo()
    merge()
    icp()
    score()
    hot()
    hub()
    log("=== Radar Cycle Completed ===")

if __name__ == "__main__":
    sovereign_boot()
