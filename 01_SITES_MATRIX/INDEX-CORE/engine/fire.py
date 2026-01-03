import requests, sys

if len(sys.argv) < 2:
    print("Usage: python fire.py https://example.com/")
    exit()

url = sys.argv[1]

r = requests.post("https://yishenglobal.vercel.app/api/index", json={
    "url": url
})

print(r.text)
