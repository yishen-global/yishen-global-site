import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_ID = os.getenv("WHATSAPP_PHONE_ID")

LEADS_FILE = "outputs/leads.csv"
LOG_FILE = "logs/whatsapp_log.json"

TEMPLATE = """
Hi {name}, this is Alex from YiShen Global.

We help importers and DTC brands launch Sofa-in-a-Box / Compression Sofa programs with:
• Up to 60% freight saving
• Faster warehouse rotation
• Private label customization

Would you like to see our 3 best-selling boxed sofa SKUs for 2026?
"""

def send_message(phone, text):
    url = f"https://graph.facebook.com/v18.0/{PHONE_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {"body": text}
    }
    r = requests.post(url, headers=headers, json=payload)
    return r.json()

def run_flywheel():
    os.makedirs("logs", exist_ok=True)
    if not os.path.exists(LEADS_FILE):
        print("No leads found.")
        return

    leads = []
    with open(LEADS_FILE, encoding="utf-8") as f:
        for line in f:
            leads.append(line.strip().split(","))

    for l in leads[1:]:
        name = l[0]
        phone = l[-1]  # assume last column is phone
        if not phone.startswith("+"):
            continue

        msg = TEMPLATE.format(name=name)
        res = send_message(phone, msg)

        with open(LOG_FILE, "a", encoding="utf-8") as log:
            log.write(json.dumps({
                "name": name,
                "phone": phone,
                "time": str(datetime.now()),
                "response": res
            }) + "\n")

        print("Sent to", name, phone)

if __name__ == "__main__":
    run_flywheel()
