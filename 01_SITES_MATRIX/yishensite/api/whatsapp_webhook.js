import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const SESS = {}; // 先用内存；上线建议换 KV/Redis

function readJSON(p) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), p), "utf8"));
}

async function sendWhatsApp(to, text) {
  // TODO: 替换为你的 WhatsApp API 发送逻辑
  // 例如 Twilio: client.messages.create({ from, to, body: text })
  console.log("WA SEND =>", to, text);
}

export default async function handler(req, res) {
  const i18n = readJSON("data/rfq_i18n.json");

  // 你服务商的 webhook payload 可能不同，这里按常见字段
  const from = String(req.body?.from || "").trim();
  const text = String(req.body?.text || "").trim();

  if (!from) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!SESS[from]) SESS[from] = { step: 0, sku: "", qty: "", country: "", lang: "en" };
  const s = SESS[from];

  // 语言自动识别：如果用户输入含阿语字符/俄语字符，或前缀 "AR:" "RU:" "ES:"
  const t = text.toLowerCase();
  if (t.startsWith("ar:")) s.lang = "ar";
  else if (t.startsWith("ru:")) s.lang = "ru";
  else if (t.startsWith("es:")) s.lang = "es";
  else if (t.startsWith("en:")) s.lang = "en";

  const L = i18n[s.lang] || i18n["en"];

  // 确认指令 → 直接回 PDF（通常你会在这里生成“最终版”，此处先发草稿）
  const confirmWords = ["confirm", "confirmar", "تأكيد", "подтвердить"];
  if (confirmWords.includes(t)) {
    const pdf = `/api/order_draft_pdf?sku=${encodeURIComponent(s.sku || "TBD")}&qty=${encodeURIComponent(s.qty || "1")}&country=${encodeURIComponent(s.country || "US")}&currency=USD&unit=0&subtotal=0&lang=${s.lang}`;
    await sendWhatsApp(from, `${L.pdf_ready}\n${pdf}`);
    s.step = 0; s.sku=""; s.qty=""; s.country="";
    res.status(200).json({ ok: true });
    return;
  }

  if (s.step === 0) {
    await sendWhatsApp(from, L.need_sku);
    s.step = 1;
    res.status(200).json({ ok: true });
    return;
  }

  if (s.step === 1) {
    s.sku = text.replace(/^([a-z]{2}:)/i, "").trim();
    await sendWhatsApp(from, L.need_qty);
    s.step = 2;
    res.status(200).json({ ok: true });
    return;
  }

  if (s.step === 2) {
    s.qty = text.replace(/^([a-z]{2}:)/i, "").trim();
    await sendWhatsApp(from, L.need_country);
    s.step = 3;
    res.status(200).json({ ok: true });
    return;
  }

  if (s.step === 3) {
    s.country = text.replace(/^([a-z]{2}:)/i, "").trim().toUpperCase();

    // 调用你的 RFQ 报价 API → 返回 whatsappLink + pdfUrl
    const url = `${process.env.SITE_ORIGIN || ""}/api/rfq?sku=${encodeURIComponent(s.sku)}&qty=${encodeURIComponent(s.qty)}&country=${encodeURIComponent(s.country)}&lang=${encodeURIComponent(s.lang)}`;
    const r = await fetch(url);
    const j = await r.json();

    const msg =
      `${L.quote_title}\n` +
      `SKU: ${j.sku}\nQty: ${j.qty}\nCountry: ${j.country}\n` +
      `Unit: ${j.currency} ${j.unit_price}\nSubtotal: ${j.currency} ${j.subtotal}\n\n` +
      `${L.cta_pay}\n${L.disclaimer}\n\n` +
      `${L.pdf_ready}\n${j.pdfUrl}`;

    await sendWhatsApp(from, msg);

    // reset
    s.step = 0; s.sku=""; s.qty=""; s.country="";
    res.status(200).json({ ok: true });
    return;
  }

  res.status(200).json({ ok: true });
}
