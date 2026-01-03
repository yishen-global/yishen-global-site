import pandas as pd
import os

RAW_PATH = "data/raw_shipments/shipments.csv"
OUT_PATH = "data/sku_gap_map.csv"


def build_sku_gap_map():

    # 1️⃣ 读取真实出货源
    if not os.path.exists(RAW_PATH):
        print("❌ RAW SHIPMENT FILE NOT FOUND:", RAW_PATH)
        return False

    raw_df = pd.read_csv(RAW_PATH)

    if raw_df.empty:
        print("❌ RAW SHIPMENT FILE EMPTY")
        return False

    # 2️⃣ 生成 GAP 维度（引擎心脏）
    gap_df = (
        raw_df
        .assign(
            sku=lambda d: d["product"].str.lower().str.replace(" ", "_"),
            country=lambda d: d["country"],
            buyer=lambda d: d["company"],
            qty=lambda d: d["qty"]
        )
        .groupby(["country", "sku"])
        .agg(
            buyers=("buyer", "nunique"),
            total_qty=("qty", "sum")
        )
        .reset_index()
    )

    # 3️⃣ GAP 判定逻辑（未来会越来越智能）
    gap_df["is_gap"] = (gap_df["buyers"] <= 1)

    gap_only = gap_df[gap_df["is_gap"] == True]

    if gap_only.empty:
        print("⚠️ RADAR: No SKU gaps detected – protected existing map.")
        return False

    # 4️⃣ 防破坏写入
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    gap_only.to_csv(OUT_PATH, index=False, encoding="utf-8")

    print("🔥 SKU GAP MAP BUILT")
    print("Rows:", len(gap_only))
    print("Output:", OUT_PATH)
    return True


if __name__ == "__main__":
    build_sku_gap_map()
