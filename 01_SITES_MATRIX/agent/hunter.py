import os, csv, json, time, requests, hashlib
from datetime import datetime
from bs4 import BeautifulSoup

BASE = "J:/YiShen-Mothership/agents/HUNTER_ENGINE"
RAW = f"{BASE}/core/leads_raw.jsonl"
DEDUP = f"{BASE}/core/leads_dedup.jsonl"
CSV = f"{BASE}/core/leads.csv"
LOG = f"{BASE}/logs/radar_{datetime.now().strftime('%Y-%m-%d')}.log"

HEADERS = {"User-Agent":"Mozilla/5.0"}

QUERIES = [
    "outdoor bamboo decking distributor",
    "bamboo flooring wholesaler",
    "horse stable bamboo supplier",
    "WPC bamboo flooring importer",
    "bamboo wall cladding projects",
    "garden bamboo bench supplier",
]

def log(msg):
    with open(LOG,'a',encoding='utf-8') as f:
        f.write(f"[{datetime.now()}] {msg}\n")

def hash_lead(name,site):
    return hashlib.md5(f"{name}{site}".encode()).hexdigest()

def google_scrape(q):
    log("SEARCH " + q)
    url = "https://www.google.com/search?q=" + q.replace(" ","+")
    r = requests.get(url,headers=HEADERS,timeout=15)
    soup = BeautifulSoup(r.text,"html.parser")
    res=[]
    for g in soup.select(".tF2Cxc"):
        name = g.select_one("h3")
        link = g.select_one("a")
        if name and link:
            res.append({"company":name.text.strip(),"site":link["href"],"query":q})
    return res

def analyze(c):
    c["pain"] = "import margin pressure / long lead time"
    c["hook"] = "certified bamboo outdoor flooring"
    c["signal"] = "project / distributor / wholesaler"
    c["bool"] = "AND bamboo AND outdoor"
    return c

def write_raw(c):
    with open(RAW,"a",encoding="utf-8") as f:
        f.write(json.dumps(c,ensure_ascii=False)+"\n")

def dedup():
    seen={}
    rows=[]
    if os.path.exists(RAW):
        for line in open(RAW,encoding='utf-8'):
            c=json.loads(line)
            h=hash_lead(c["company"],c["site"])
            if h not in seen:
                seen[h]=1
                rows.append(c)
    with open(DEDUP,"w",encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r,ensure_ascii=False)+"\n")
    return rows

def export_csv(rows):
    with open(CSV,"w",newline="",encoding="utf-8") as f:
        w=csv.writer(f)
        w.writerow(["Company","Website","Pain","Hook","Signal","Bool","SourceQuery"])
        for r in rows:
            w.writerow([r["company"],r["site"],r["pain"],r["hook"],r["signal"],r["bool"],r["query"]])

def main():
    log("HUNTER START")
    for q in QUERIES:
        for c in google_scrape(q):
            c=analyze(c)
            write_raw(c)
            time.sleep(2)
    rows=dedup()
    export_csv(rows)
    log("HUNTER DONE | TOTAL "+str(len(rows)))
    print(">>> HUNTER COMPLETE:",len(rows),"LEADS")

if __name__=="__main__":
    main()
