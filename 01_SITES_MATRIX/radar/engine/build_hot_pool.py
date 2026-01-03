# engine/build_hot_pool.py
import pandas as pd

def build_hot_pool(master_csv, output_csv):
    df = pd.read_csv(master_csv)
    hot = df[df['CONFIDENCE_SCORE'] > 80]
    hot.to_csv(output_csv, index=False)
    print("🔥 HOT POOL BUILT:", output_csv)
