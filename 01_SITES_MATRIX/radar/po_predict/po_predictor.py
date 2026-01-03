import pandas as pd
import joblib
from datetime import datetime
import os

BASE_DIR = os.path.dirname(__file__)
MODEL = os.path.join(BASE_DIR, "po_model.pkl")
INPUT = os.path.join(BASE_DIR, "../hot_pool/hot_pool_all.csv")
OUTPUT = os.path.join(BASE_DIR, "po_predict_today.csv")
HISTORY = os.path.join(BASE_DIR, "po_predict_history.csv")

def run():
    model = joblib.load(MODEL)
    df = pd.read_csv(INPUT)

    df["import_volume"] = df["import_volume"].fillna(0)
    X = df[["signal_score","import_volume"]]
    df["po_probability"] = model.predict_proba(X)[:,1]

    today = df[df["po_probability"]>=0.75].copy()
    today["predicted_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    today.to_csv(OUTPUT,index=False,encoding="utf-8-sig")

    try:
        hist = pd.read_csv(HISTORY)
        hist = pd.concat([hist,today])
    except:
        hist = today

    hist.to_csv(HISTORY,index=False,encoding="utf-8-sig")
    print(f"📦 Today PO Hot List: {len(today)}")

if __name__=="__main__":
    run()
