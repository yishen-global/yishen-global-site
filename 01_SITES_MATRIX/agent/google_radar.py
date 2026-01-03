import requests,datetime

KEYWORDS = [
 '"office chair distributor" -alibaba -amazon',
 '"chain manufacturer" site:au inurl:contact',
 '"rigging supplier" site:de',
 '"building hardware importer"',
 '"furniture brand" site:fr'
]

for k in KEYWORDS:
    url="https://www.google.com/search?q="+k.replace(" ","+")
    open("radar_log.txt","a",encoding="utf-8").write(str(datetime.date.today())+" | "+k+"\n")
