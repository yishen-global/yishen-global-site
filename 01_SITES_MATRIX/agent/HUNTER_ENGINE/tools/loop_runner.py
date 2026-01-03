import json, time, subprocess, os
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CORE = os.path.join(ROOT, "core")
CONFIGS = os.path.join(ROOT, "configs")
OUTPUTS = os.path.join(ROOT, "outputs")

CFG = os.path.join(CONFIGS, "loop_brazil_andes.json")

def run_hunter():
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    print("RUN:", ts)
    # 你现有 hunter.py 直接跑；如支持参数可在此扩展
    subprocess.call(["python", os.path.join(CORE, "hunter.py")])

def main():
    with open(CFG, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    interval = int(cfg.get("run_interval_hours", 6)) * 3600
    print("Brazil ANDES loop every", interval//3600, "hours")

    while True:
        run_hunter()
        print("SLEEP", interval)
        time.sleep(interval)

if __name__ == "__main__":
    main()
