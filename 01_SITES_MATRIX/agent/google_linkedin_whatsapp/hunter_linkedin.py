import json

def hunt():
    buyers = json.load(open("db/buyers.json"))
    for b in buyers:
        b["linkedin_message"] = f"""
Hi, I noticed your company works with {b['company']}.
We help distributors reduce landed cost & lead-time instability.
May I share you one quick idea?
"""
    open("db/leads.json","w").write(json.dumps(buyers,indent=2))

if __name__ == "__main__":
    hunt()
