import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib
import os

BASE_DIR = os.path.dirname(__file__)
INPUT = os.path.join(BASE_DIR, "../hot_pool/hot_pool_all.csv")
MODEL_PATH = os.path.join(BASE_DIR, "po_model.pkl")

def run():
    df = pd.read_csv(INPUT)

    df["import_volume"] = df["import_volume"].fillna(0)
    X = df[["signal_score","import_volume"]]
    y = df["priority_level"].apply(lambda x: 1 if x=="A+" else 0)

    model = LogisticRegression(max_iter=1000)
    model.fit(X,y)
    joblib.dump(model, MODEL_PATH)

    print("🧠 PO Prediction Model Trained")

if __name__=="__main__":
    run()
