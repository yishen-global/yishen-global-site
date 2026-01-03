import sys, json, time, socket, requests
socket.setdefaulttimeout(180)

from google.oauth2 import service_account
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/indexing"]

KEY_FILE = r"J:\YiShen-Mothership\INDEX-CORE\yishen-global-index-core-428b9d964f43.json"


def get_credentials():
    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    creds.refresh(Request())
    return creds


def push(url):
    print("⚡ YISHEN INDEX CORE ONLINE")
    print("Pushing:", url)

    creds = get_credentials()
    headers = {
        "Authorization": "Bearer " + creds.token,
        "Content-Type": "application/json"
    }

    body = {
        "url": url,
        "type": "URL_UPDATED"
    }

    r = requests.post(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        headers=headers,
        data=json.dumps(body),
        timeout=120
    )

    print("STATUS:", r.status_code)
    print("RESPONSE:", r.text)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python index_push.py https://www.yourdomain.com/")
    else:
        push(sys.argv[1])
