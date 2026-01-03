// api/fx.js
let CACHE = {
  base: "USD",
  ts: 0,
  ttlMs: 1000 * 60 * 60, // 1h cache
  rates: { USD: 1 }
};

// 兜底静态汇率（你可手动更新，确保“永不挂”）
const FALLBACK = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
  JPY: 156,
  RUB: 92
};

async function fetchRates(base = "USD") {
  // Open ER API 示例： https://open.er-api.com/v6/latest/USD
  const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
  const r = await fetch(url, { method: "GET" });
  if (!r.ok) throw new Error("FX fetch failed");
  const j = await r.json();
  if (!j || !j.rates) throw new Error("FX invalid");
  return { base: j.base_code || base, rates: j.rates };
}

export async function getFX(base = "USD") {
  const now = Date.now();
  if (CACHE.base === base && now - CACHE.ts < CACHE.ttlMs && CACHE.rates?.USD) {
    return { base: CACHE.base, rates: CACHE.rates, cached: true };
  }
  try {
    const data = await fetchRates(base);
    CACHE = { ...CACHE, base: data.base, rates: data.rates, ts: now };
    return { base: CACHE.base, rates: CACHE.rates, cached: false };
  } catch (e) {
    // 失败就兜底：保证系统不断线
    return { base, rates: FALLBACK, cached: true, fallback: true };
  }
}

export function convert(amount, toCurrency, rates) {
  const fx = Number(rates?.[toCurrency] || 1);
  const v = Number(amount) * fx;
  return Math.round((v + Number.EPSILON) * 100) / 100;
}
