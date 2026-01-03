from http.server import BaseHTTPRequestHandler
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import json, os

SCOPES = ["https://www.googleapis.com/auth/indexing"]

SERVICE_ACCOUNT_FILE = "yishen-global-index-core-428b9d964f43.json"

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers['Content-Length'])
        data = json.loads(self.rfile.read(length))
        url = data["url"]

        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        credentials.refresh(Request())

        token = credentials.token

        import requests
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        payload = {
            "url": url,
            "type": "URL_UPDATED"
        }

        r = requests.post(
            "https://indexing.googleapis.com/v3/urlNotifications:publish",
            headers=headers,
            json=payload
        )

        self.send_response(200)
        self.end_headers()
        self.wfile.write(r.text.encode())
