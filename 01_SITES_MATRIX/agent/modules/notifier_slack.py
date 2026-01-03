import os
import json
import time
import requests
from dotenv import load_dotenv

load_dotenv()

SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL")

def push(title, message, level="info"):
    if not SLACK_WEBHOOK:
        return
    payload = {
        "text": f"*{title}*\n{message}",
        "mrkdwn": True
    }
    try:
        requests.post(SLACK_WEBHOOK, json=payload, timeout=10)
    except:
        pass

# Usage examples:
if __name__ == "__main__":
    push("YiShen.AI Radar", "New A+ lead captured: Zinus (USA)", level="success")
