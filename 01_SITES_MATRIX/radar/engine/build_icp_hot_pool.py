# engine/build_icp_hot_pool.py
import pandas as pd

def ignite_country_hot_pool(hot_csv, country_code, output_csv):
    df = pd.read_csv(hot_csv)
    sa = df[df['country'] == country_code]
    sa.to_csv(output_csv, index=False)
    print(f"🚀 {country_code} HOT POOL READY:", output_csv)
