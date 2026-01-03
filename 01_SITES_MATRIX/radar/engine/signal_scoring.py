def score_row(r):
    score = 0.6
    flags = []

    if r['value_growth'] > 0.15:
        score += 0.15
        flags.append("value_upgrade")

    if r['supplier_changed']:
        score += 0.15
        flags.append("supplier_switch")

    if r['new_hs_added']:
        score += 0.1
        flags.append("category_expand")

    return {
        "org_name": r['importer'],
        "country": r['country'],
        "hs_focus": r['hs_code'],
        "icp_score": round(score,3),
        "signal_flags": ",".join(flags),
        "est_next_po_window": "30-60 days"
    }
