import csv, os, datetime

def save_to_hub(pool):
    outpath = "J:/YiShen-Mothership/radar/data/icp_pool/icp_hot_pool.csv"
    os.makedirs(os.path.dirname(outpath), exist_ok=True)

    if not pool:
        with open(outpath, "w", newline="", encoding="utf-8-sig") as f:
            f.write("org_name,country,hs_focus,icp_score,signal_flags,est_next_po_window\n")
        logpath = "J:/YiShen-Mothership/radar/data/logs/radar_" + str(datetime.date.today()) + ".log"
        with open(logpath, "w", encoding="utf-8") as log:
            log.write("Radar OK but no ICP matched radar rules")
        return

    with open(outpath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=pool[0].keys())
        writer.writeheader()
        for r in pool:
            writer.writerow(r)

    logpath = "J:/YiShen-Mothership/radar/data/logs/radar_" + str(datetime.date.today()) + ".log"
    with open(logpath, "w", encoding="utf-8") as log:
        log.write(f"Radar OK: {len(pool)} ICPs generated")
