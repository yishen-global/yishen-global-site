# -*- coding: utf-8 -*-
"""
YiShen Radar - Panjiva Hot Pool Builder (Production)
Input : Panjiva Buyer-level Excel (.xlsx) with columns like:
    Buyer Name, Country, Total Number of Shipments, Number of Matched Shipments,
    Weight of Matching Shipments (kg), Value of Matching China Trade Data (USD),
    Last Shipment Date of Matched Shipments, Top 3 Suppliers, Top 5 Products,
    Phone, Email, Website, Contact Person, Panjiva URL, etc.
Output:
    radar/data/icp_pool/icp_hot_pool.csv
    radar/data/icp_pool/icp_hot_pool.xlsx
Log:
    radar/data/logs/panjiva_builder_YYYY-MM-DD.log
"""

import os
import re
import math
import argparse
import datetime as dt
from typing import Optional, Dict, Any

import pandas as pd


# -----------------------------
# Paths
# -----------------------------
BASE = "J:/YiShen-Mothership/radar"
DEFAULT_INPUT = BASE + "/data/raw_shipments/panjiva_buyers.xlsx"
OUT_DIR = BASE + "/data/icp_pool"
OUT_CSV = OUT_DIR + "/icp_hot_pool.csv"
OUT_XLSX = OUT_DIR + "/icp_hot_pool.xlsx"
LOG_DIR = BASE + "/data/logs"


# -----------------------------
# Helpers
# -----------------------------
def log(msg: str):
    os.makedirs(LOG_DIR, exist_ok=True)
    log_path = f"{LOG_DIR}/panjiva_builder_{dt.date.today()}.log"
    stamp = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{stamp}] {msg}"
    print(line)
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def pick_col(df: pd.DataFrame, candidates):
    """Pick first matching column by fuzzy contains (case-insensitive)."""
    cols = list(df.columns)
    for cand in candidates:
        for c in cols:
            if cand.lower() == str(c).strip().lower():
                return c
    for cand in candidates:
        for c in cols:
            if cand.lower() in str(c).strip().lower():
                return c
    return None


def to_float(x) -> Optional[float]:
    if pd.isna(x):
        return None
    s = str(x).strip()
    if s == "":
        return None
    # Remove currency, commas, spaces
    s = s.replace(",", "").replace("$", "").replace("USD", "").strip()
    # Keep digits, dot, minus
    s = re.sub(r"[^0-9\.\-]", "", s)
    if s in ("", "-", ".", "-."):
        return None
    try:
        return float(s)
    except Exception:
        return None


def to_int(x) -> Optional[int]:
    f = to_float(x)
    if f is None:
        return None
    try:
        return int(round(f))
    except Exception:
        return None


def parse_date(x) -> Optional[dt.date]:
    if pd.isna(x):
        return None
    if isinstance(x, dt.date) and not isinstance(x, dt.datetime):
        return x
    if isinstance(x, dt.datetime):
        return x.date()
    s = str(x).strip()
    if s == "":
        return None
    # Try pandas parse
    try:
        d = pd.to_datetime(s, errors="coerce")
        if pd.isna(d):
            return None
        return d.date()
    except Exception:
        return None


def days_since(d: Optional[dt.date]) -> Optional[int]:
    if not d:
        return None
    return (dt.date.today() - d).days


def safe_str(x) -> str:
    if pd.isna(x):
        return ""
    return str(x).strip()


def sigmoid(z: float) -> float:
    return 1.0 / (1.0 + math.exp(-z))


def clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))


# -----------------------------
# Scoring Logic (Production)
# -----------------------------
def compute_window(last_days: Optional[int]) -> str:
    if last_days is None:
        return "Unknown"
    if last_days <= 30:
        return "30-60 days"
    if last_days <= 90:
        return "60-90 days"
    if last_days <= 180:
        return "90-180 days"
    if last_days <= 365:
        return "180-365 days"
    return "365+ days"


def compute_signals(row: Dict[str, Any]) -> str:
    flags = []

    # Recency
    last_days = row.get("last_days")
    if last_days is not None:
        if last_days <= 30:
            flags.append("recent_30d")
        elif last_days <= 90:
            flags.append("recent_90d")
        elif last_days <= 180:
            flags.append("recent_180d")

    # Volume & value
    mv = row.get("match_value_usd")
    mw = row.get("match_weight_kg")
    ms = row.get("matched_shipments")
    ts = row.get("total_shipments")

    if mv is not None and mv >= 100000:
        flags.append("high_value_100k")
    elif mv is not None and mv >= 30000:
        flags.append("value_30k")

    if mw is not None and mw >= 5000:
        flags.append("heavy_5t")
    elif mw is not None and mw >= 1000:
        flags.append("heavy_1t")

    if ms is not None and ms >= 10:
        flags.append("high_match_freq")
    elif ms is not None and ms >= 3:
        flags.append("match_freq")

    if ts is not None and ts >= 200:
        flags.append("super_active_trade")
    elif ts is not None and ts >= 50:
        flags.append("active_trade")

    # Contact readiness
    if safe_str(row.get("email", "")):
        flags.append("has_email")
    if safe_str(row.get("phone", "")):
        flags.append("has_phone")
    if safe_str(row.get("website", "")):
        flags.append("has_website")
    if safe_str(row.get("contact_person", "")):
        flags.append("has_contact_person")

    return ",".join(flags)


def compute_icp_score(row: Dict[str, Any]) -> float:
    """
    Output: 0..1
    Uses:
      - matched shipments (strong)
      - match value USD
      - match weight KG
      - recency boost (days since last shipment)
      - company size (employees / revenue) lightly
      - contact completeness boost
    """
    # Core metrics
    ms = row.get("matched_shipments") or 0
    ts = row.get("total_shipments") or 0
    mv = row.get("match_value_usd") or 0.0
    mw = row.get("match_weight_kg") or 0.0
    emp = row.get("employees") or 0
    rev = row.get("revenue_usd") or 0.0

    last_days = row.get("last_days")
    if last_days is None:
        recency = 0.0
    else:
        # 0..1 where 0 days -> 1, 365+ -> ~0
        recency = clamp01(1.0 - (last_days / 365.0))

    # Contact completeness
    contact_boost = 0.0
    if safe_str(row.get("email", "")):
        contact_boost += 0.08
    if safe_str(row.get("phone", "")):
        contact_boost += 0.05
    if safe_str(row.get("website", "")):
        contact_boost += 0.03
    if safe_str(row.get("contact_person", "")):
        contact_boost += 0.06

    # Log-scaled volume metrics
    ms_term = math.log1p(ms)        # 0.. ~
    mv_term = math.log1p(mv)        # 0.. ~
    mw_term = math.log1p(mw)        # 0.. ~
    ts_term = math.log1p(ts)

    # Company size lightly
    emp_term = math.log1p(emp)
    rev_term = math.log1p(rev)

    # Weighted linear -> sigmoid
    z = (
        1.15 * ms_term +
        0.45 * mv_term +
        0.35 * mw_term +
        0.25 * ts_term +
        0.10 * emp_term +
        0.12 * rev_term +
        2.10 * recency
    )

    base = sigmoid((z - 6.0) / 1.7)  # shift/scale tuned for typical trade data
    score = clamp01(base + contact_boost)
    return round(score, 4)


def classify_tier(score: float, last_days: Optional[int]) -> str:
    # Tier labels you can directly route in your workflow
    if score >= 0.85:
        return "HOT_BUYER"
    if score >= 0.70:
        return "ACTIVE_BUYER"
    if score >= 0.55:
        return "WARM_BUYER"
    # If very recent but low score (small but fresh)
    if last_days is not None and last_days <= 60 and score >= 0.45:
        return "EMERGING_BUYER"
    return "DORMANT_BUYER"


# -----------------------------
# Main
# -----------------------------
def build(input_path: str, sheet: Optional[str] = None, top_n: int = 0) -> None:
    log(f"Input: {input_path}")

    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    # Load
    if input_path.lower().endswith(".xlsx"):
        df = pd.read_excel(input_path, sheet_name=sheet if sheet else 0)
    else:
        df = pd.read_csv(input_path)

    df.columns = [str(c).strip() for c in df.columns]
    log(f"Loaded rows: {len(df)} | cols: {len(df.columns)}")

    # Pick columns (robust)
    col_buyer = pick_col(df, ["Buyer Name", "buyer name", "consignee", "importer", "company"])
    col_country = pick_col(df, ["Country"])
    col_city = pick_col(df, ["City"])
    col_state = pick_col(df, ["State/Region", "State", "Region"])
    col_postal = pick_col(df, ["Postal Code", "Zip", "ZIP"])
    col_addr = pick_col(df, ["Full Address", "Full Address (main address)", "Address"])
    col_route = pick_col(df, ["Route"])
    col_globalhq = pick_col(df, ["Global HQ"])
    col_globalhq_addr = pick_col(df, ["Global HQ Address"])
    col_globalhq_duns = pick_col(df, ["Global HQ DUNS", "DUNS"])
    col_dom_hq = pick_col(df, ["Domestic HQ"])
    col_dom_hq_addr = pick_col(df, ["Domestic HQ Address"])
    col_dom_hq_duns = pick_col(df, ["Domestic HQ DUNS"])

    col_rev = pick_col(df, ["Revenue"])
    col_emp = pick_col(df, ["Employees Count", "Employees"])
    col_total_ship = pick_col(df, ["Total Number of Shipments", "Total Shipments"])
    col_matched_ship = pick_col(df, ["Number of Matched Shipments", "Matched Shipments"])
    col_weight = pick_col(df, ["Weight of Matching Shipments (kg)", "Weight", "kg"])
    col_value = pick_col(df, ["Value of Matching China Trade Data (USD)", "Value", "USD"])
    col_last = pick_col(df, ["Last Shipment Date of Matched Shipments", "Last Shipment Date", "Last Shipment"])

    col_url = pick_col(df, ["Panjiva URL", "URL"])
    col_sup = pick_col(df, ["Top 3 Suppliers", "Suppliers"])
    col_prod = pick_col(df, ["Top 5 Products", "Products"])

    col_phone = pick_col(df, ["Phone", "Telephone"])
    col_email = pick_col(df, ["Email", "E-mail"])
    col_web = pick_col(df, ["Website", "Web"])
    col_person = pick_col(df, ["Contact Person", "Contact"])

    # Validate essential fields
    if not col_buyer:
        raise Exception("Cannot find Buyer Name column (e.g., 'Buyer Name').")
    if not col_country:
        log("WARN: Cannot find Country column; will set as blank.")

    # Normalize + map to output
    rows = []
    for _, r in df.iterrows():
        buyer = safe_str(r.get(col_buyer, ""))
        if not buyer:
            continue

        last_date = parse_date(r.get(col_last)) if col_last else None
        last_days = days_since(last_date)

        row = {
            "org_name": buyer,
            "country": safe_str(r.get(col_country, "")) if col_country else "",
            "city": safe_str(r.get(col_city, "")) if col_city else "",
            "state_region": safe_str(r.get(col_state, "")) if col_state else "",
            "postal_code": safe_str(r.get(col_postal, "")) if col_postal else "",
            "route": safe_str(r.get(col_route, "")) if col_route else "",
            "full_address": safe_str(r.get(col_addr, "")) if col_addr else "",

            "global_hq": safe_str(r.get(col_globalhq, "")) if col_globalhq else "",
            "global_hq_address": safe_str(r.get(col_globalhq_addr, "")) if col_globalhq_addr else "",
            "global_hq_duns": safe_str(r.get(col_globalhq_duns, "")) if col_globalhq_duns else "",

            "domestic_hq": safe_str(r.get(col_dom_hq, "")) if col_dom_hq else "",
            "domestic_hq_address": safe_str(r.get(col_dom_hq_addr, "")) if col_dom_hq_addr else "",
            "domestic_hq_duns": safe_str(r.get(col_dom_hq_duns, "")) if col_dom_hq_duns else "",

            "revenue_usd": to_float(r.get(col_rev)) if col_rev else None,
            "employees": to_int(r.get(col_emp)) if col_emp else None,

            "total_shipments": to_int(r.get(col_total_ship)) if col_total_ship else None,
            "matched_shipments": to_int(r.get(col_matched_ship)) if col_matched_ship else None,
            "match_weight_kg": to_float(r.get(col_weight)) if col_weight else None,
            "match_value_usd": to_float(r.get(col_value)) if col_value else None,

            "last_matched_shipment_date": last_date.isoformat() if last_date else "",
            "panjiva_url": safe_str(r.get(col_url, "")) if col_url else "",

            "top_suppliers": safe_str(r.get(col_sup, "")) if col_sup else "",
            "top_products": safe_str(r.get(col_prod, "")) if col_prod else "",

            "phone": safe_str(r.get(col_phone, "")) if col_phone else "",
            "email": safe_str(r.get(col_email, "")) if col_email else "",
            "website": safe_str(r.get(col_web, "")) if col_web else "",
            "contact_person": safe_str(r.get(col_person, "")) if col_person else "",
        }

        row["last_days"] = last_days
        row["est_next_po_window"] = compute_window(last_days)
        row["signal_flags"] = compute_signals(row)
        row["icp_score"] = compute_icp_score(row)
        row["tier"] = classify_tier(row["icp_score"], last_days)

        # Optional notes
        row["notes"] = ""

        rows.append(row)

    out = pd.DataFrame(rows)
    log(f"Usable buyer rows: {len(out)}")

    if out.empty:
        os.makedirs(OUT_DIR, exist_ok=True)
        out.to_csv(OUT_CSV, index=False, encoding="utf-8-sig")
        log("Output empty pool written (no usable rows).")
        return

    # Dedup (conservative)
    out["__dedup_key"] = (
        out["org_name"].str.lower().str.strip() + "|" +
        out["country"].str.lower().str.strip() + "|" +
        out["website"].str.lower().str.strip()
    )
    out = out.drop_duplicates(subset=["__dedup_key"], keep="first").drop(columns=["__dedup_key"])

    # Sort by score desc then recency
    out["_last_days_sort"] = out["last_days"].fillna(99999)
    out = out.sort_values(by=["icp_score", "_last_days_sort"], ascending=[False, True]).drop(columns=["_last_days_sort"])

    # Optional top N
    if top_n and top_n > 0:
        out = out.head(top_n)
        log(f"Applied top_n={top_n}, remaining: {len(out)}")

    # Save
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(LOG_DIR, exist_ok=True)

    # Drop helper last_days from final export? Keep it (useful)
    final_cols = [
        "org_name","tier","icp_score","signal_flags","est_next_po_window",
        "country","city","state_region","postal_code","route","full_address",
        "global_hq","global_hq_address","global_hq_duns",
        "domestic_hq","domestic_hq_address","domestic_hq_duns",
        "revenue_usd","employees",
        "total_shipments","matched_shipments","match_weight_kg","match_value_usd",
        "last_matched_shipment_date","last_days",
        "top_suppliers","top_products",
        "phone","email","website","contact_person",
        "panjiva_url","notes"
    ]
    # Keep only existing columns
    final_cols = [c for c in final_cols if c in out.columns]
    out = out[final_cols]

    out.to_csv(OUT_CSV, index=False, encoding="utf-8-sig")
    try:
        out.to_excel(OUT_XLSX, index=False)
    except Exception as e:
        log(f"WARN: failed writing xlsx: {e}")

    log(f"Saved: {OUT_CSV}")
    log(f"Saved: {OUT_XLSX}")
    log(f"Top 5 preview:\n{out.head(5).to_string(index=False)}")


def main():
    parser = argparse.ArgumentParser(description="YiShen Radar - Panjiva Hot Pool Builder")
    parser.add_argument("--input", "-i", default=DEFAULT_INPUT, help="Input Panjiva excel/csv path")
    parser.add_argument("--sheet", "-s", default=None, help="Excel sheet name (optional)")
    parser.add_argument("--top", "-t", type=int, default=0, help="Keep only top N rows by icp_score (0=all)")
    args = parser.parse_args()

    build(args.input, sheet=args.sheet, top_n=args.top)


if __name__ == "__main__":
    main()
