# engine/icp_generator.py
import pandas as pd

def generate_icp_master(raw_df):
    df = raw_df.copy()

    df['ICP_LEVEL'] = 'L2'
    df['BUYER_TYPE'] = df['role'].apply(lambda x: 'Procurement' if 'procurement' in x.lower() else 'Distributor')
    df['CONFIDENCE_SCORE'] = df['signal_score'] * 1.5
    df['IS_TARGET'] = df['CONFIDENCE_SCORE'] > 65

    return df
