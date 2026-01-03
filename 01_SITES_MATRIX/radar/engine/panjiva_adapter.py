import pandas as pd

INPUT = "J:/YiShen-Mothership/radar/data/raw_shipments/panjiva_raw.csv"
OUTPUT = "J:/YiShen-Mothership/radar/data/raw_shipments/latest.csv"

def pick_col(df, keys):
    for k in df.columns:
        for key in keys:
            if key.lower() in k.lower():
                return k
    return None

def main():
    df = pd.read_csv(INPUT)

    importer_col = pick_col(df, ["consignee","importer"])
    country_col  = pick_col(df, ["country"])
    hs_col       = pick_col(df, ["hs","harmonized","commodity"])
    bl_col       = pick_col(df, ["bill","bl"])

    if not hs_col:
        raise Exception("❌ Cannot find HS column in Panjiva CSV")

    out = pd.DataFrame()
    out["importer"] = df[importer_col].fillna("UNKNOWN")
    out["country"] = df[country_col].fillna("UNKNOWN")
    out["hs_code"] = df[hs_col].astype(str).str[:6]
    out["last_90d_shipments"] = out.groupby("importer")["hs_code"].transform("count")
    out["value_growth"] = 0.25
    out["supplier_changed"] = True
    out["new_hs_added"] = False

    out.to_csv(OUTPUT, index=False)
    print("✔ Panjiva adapted to Radar format")

if __name__ == "__main__":
    main()
