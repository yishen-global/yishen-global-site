# YiShen Autonomous Quote Engine
# quote.py

def generate_quote(data):
    product = data.get("product", "UNKNOWN")
    qty = int(data.get("qty", 1))
    country = data.get("country", "UNKNOWN")

    base_price = {
        "LIFTING_CHAIN": 15,
        "G80_RIGGING": 25,
        "GAMING_CHAIR": 79,
        "WPC_FLOOR": 18
    }

    shipping_factor = {
        "SAUDI": 1.4,
        "GERMANY": 1.3,
        "AUSTRALIA": 1.35,
        "USA": 1.25
    }

    unit_price = base_price.get(product.upper(), 20)
    ship = shipping_factor.get(country.upper(), 1.5)

    total = unit_price * qty * ship

    return {
        "product": product,
        "qty": qty,
        "country": country,
        "unit_price": unit_price,
        "shipping_factor": ship,
        "total_price_usd": round(total, 2),
        "auto_terms": "DDP Door to Door",
        "valid_days": 7
    }
