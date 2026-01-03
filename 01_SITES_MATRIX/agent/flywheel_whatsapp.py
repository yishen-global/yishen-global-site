import json
from config import WHATSAPP_ENTRY

def push():
    leads = json.load(open("db/leads.json"))
    for l in leads:
        l["whatsapp_cta"] = WHATSAPP_ENTRY
    open("db/leads.json","w").write(json.dumps(leads,indent=2))

if __name__ == "__main__":
    push()
