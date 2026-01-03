// api/rfq.js
import fs from "fs";
import path from "path";
import { getFX, convert } from "./fx.js";

function readJSON(p) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), p), "utf8"));
}
function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}
function pickCurrency(country, shield) {
  if (shield?.currency) return shield.currency;
  if (country === "AE" || country === "UAE") return "AED";
  if (country === "SA" || country === "KSA") return "SAR";
  if (country === "UK") return "GBP";
  if (country === "JP") return "JPY";
  if (country === "RU") return "RUB";
  if (country === "DE" || country === "FR" || country === "ES" || country === "IT" || country === "EU") return "EUR";
  return "USD";
}

function tierDiscount(q) {
  if (q >= 1000) return 0.88;
  if (q >= 500) return 0.91;
  if (q >= 300) return 0.93;
  if (q >= 100) return 0.95;
  return 1.0;
}

export default async function handler(req, res) {
  const sku = String(req.query.sku || "").trim();
  const qty = Math.max(1, Number(req.query.qty || 1));
  const country = String(req.query.country || "US").trim().toUpperCase();
  const lang = String(req.query.lang || "en").trim().toLowerCase();

  const shieldDB = readJSON("data/country_shield.json");
  const i18n = readJSON("data/rfq_i18n.json");

  // 先用 query 传入 basePriceUSD；后续你可以从 sku_matrix 找 basePrice
  const basePriceUSD = Number(req.query.basePriceUSD || 59);

  const shield = shieldDB[country] || shieldDB["US"] || { vat: 0, importTax: 0.025, risk: 1.04, currency: "USD" };
  const currency = pickCurrency(country, shield);

  // ---- 1) EXW + 折扣
  const disc = tierDiscount(qty);
  const exw_unit_usd = round2(basePriceUSD * disc);

  // ---- 2) 风险因子 / 进口税 / VAT
  const risk = Number(shield.risk || 1.04);
  const importTax = Number(shield.importTax || 0);
  const vat = Number(shield.vat || 0);

  // 我们把每一项“展开”：
  const risk_add_usd = round2(exw_unit_usd * (risk - 1));
  const import_add_usd = round2((exw_unit_usd + risk_add_usd) * importTax);
  const vat_add_usd = round2((exw_unit_usd + risk_add_usd + import_add_usd) * vat);

  const landed_unit_usd = round2(exw_unit_usd + risk_add_usd + import_add_usd + vat_add_usd);
  const subtotal_usd = round2(landed_unit_usd * qty);

  // ---- 3) 实时汇率换算
  const fx = await getFX("USD");
  const exw_unit = convert(exw_unit_usd, currency, fx.rates);
  const landed_unit = convert(landed_unit_usd, currency, fx.rates);
  const subtotal = convert(subtotal_usd, currency, fx.rates);

  const breakdown = {
    currency,
    fx_cached: !!fx.cached,
    fx_fallback: !!fx.fallback,
    exw_unit_usd,
    risk_factor: risk,
    importTax,
    vat,
    lines_usd: {
      exw: exw_unit_usd,
      risk_add: risk_add_usd,
      import_tax_add: import_add_usd,
      vat_add: vat_add_usd,
      landed: landed_unit_usd
    }
  };

  const L = i18n[lang] || i18n["en"];
  const whatsappTo = process.env.WA_PRIMARY || "8618857277313";
  const email = process.env.RFQ_EMAIL || "alex.yang@yishenglobal.net";

  // 正式 PDF（CI+PL 两页合并）
  const pdfUrl =
    `/api/order_doc_pdf?` +
    `sku=${encodeURIComponent(sku || "TBD")}` +
    `&qty=${qty}` +
    `&country=${encodeURIComponent(country)}` +
    `&currency=${encodeURIComponent(currency)}` +
    `&unit=${encodeURIComponent(landed_unit)}` +
    `&subtotal=${encodeURIComponent(subtotal)}` +
    `&exw=${encodeURIComponent(exw_unit)}` +
    `&risk=${encodeURIComponent(convert(risk_add_usd, currency, fx.rates))}` +
    `&importtax=${encodeURIComponent(convert(import_add_usd, currency, fx.rates))}` +
    `&vat=${encodeURIComponent(convert(vat_add_usd, currency, fx.rates))}` +
    `&lang=${encodeURIComponent(lang)}`;

  const waText =
    `${L.quote_title}\n` +
    `SKU: ${sku || "(TBD)"}\nQty: ${qty}\nCountry: ${country}\n\n` +
    `EXW: ${currency} ${exw_unit}\n` +
    `Risk(${risk}): +${currency} ${convert(risk_add_usd, currency, fx.rates)}\n` +
    `ImportTax(${Math.round(importTax*100)}%): +${currency} ${convert(import_add_usd, currency, fx.rates)}\n` +
    `VAT(${Math.round(vat*100)}%): +${currency} ${convert(vat_add_usd, currency, fx.rates)}\n` +
    `--------------------------------\n` +
    `Landed Unit: ${currency} ${landed_unit}\nSubtotal: ${currency} ${subtotal}\n\n` +
    `${L.cta_pay}\n` +
    `PDF (CI+PL): ${pdfUrl}\n` +
    `${L.disclaimer}\n` +
    `Email: ${email}`;

  const whatsappLink = `https://wa.me/${whatsappTo}?text=${encodeURIComponent(waText)}`;

  res.status(200).json({
    ok: true,
    sku,
    qty,
    country,
    lang,
    currency,
    unit_price: landed_unit,
    subtotal,
    breakdown,
    pdfUrl,
    whatsappLink
  });
}
