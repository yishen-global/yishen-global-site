# YiShen Autonomous Sales Engine – Mothership Core
# server.py

from flask import Flask, request, jsonify
from quote import generate_quote
import datetime

app = Flask(__name__)

LEAD_DB = []

@app.route("/lead", methods=["POST"])
def receive_lead():
    data = request.json
    data["timestamp"] = datetime.datetime.now().isoformat()
    LEAD_DB.append(data)
    return jsonify({"status": "saved", "lead": data})

@app.route("/quote", methods=["POST"])
def quote_engine():
    data = request.json
    result = generate_quote(data)
    return jsonify(result)

@app.route("/confirm", methods=["POST"])
def confirm_order():
    data = request.json
    # 这里将来接入 PDF 盖章引擎 + WhatsApp Bot
    return jsonify({"status": "confirmed", "order": data})

@app.route("/leads", methods=["GET"])
def all_leads():
    return jsonify(LEAD_DB)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
