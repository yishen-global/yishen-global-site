// api/order_doc_pdf.js
import PDFDocument from "pdfkit";

function safe(v, d = "") {
  const s = String(v ?? d);
  return s.length > 500 ? s.slice(0, 500) : s;
}

function money(c, n) {
  return `${c} ${safe(n, "0")}`;
}

export default function handler(req, res) {
  const sku = safe(req.query.sku, "TBD");
  const qty = safe(req.query.qty, "1");
  const country = safe(req.query.country, "US");
  const currency = safe(req.query.currency, "USD");
  const unit = safe(req.query.unit, "0");
  const subtotal = safe(req.query.subtotal, "0");

  // 展开明细（用于 CI 条款 & buyer 信任）
  const exw = safe(req.query.exw, "0");
  const risk = safe(req.query.risk, "0");
  const importtax = safe(req.query.importtax, "0");
  const vat = safe(req.query.vat, "0");

  // 装箱字段（可从 rfq.js / bot 后续继续补齐）
  const cartons = safe(req.query.cartons, "TBD");
  const gw = safe(req.query.gw, "TBD");
  const nw = safe(req.query.nw, "TBD");
  const cbm = safe(req.query.cbm, "TBD");

  const company = "YISHEN GLOBAL";
  const sellerEmail = process.env.RFQ_EMAIL || "alex.yang@yishenglobal.net";
  const wa1 = process.env.WA_PRIMARY || "8618857277313";
  const wa2 = process.env.WA_SECONDARY || "8615968277867";

  // 可加：买家信息（没有就先留空）
  const buyer = safe(req.query.buyer, "Buyer: TBD");
  const shipTo = safe(req.query.shipto, `Ship To: ${country}`);

  const invNo = safe(req.query.invno, `YS-${Date.now()}`);
  const dateStr = new Date().toISOString().slice(0, 10);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="CI_PL_${invNo}.pdf"`);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.pipe(res);

  // ============ PAGE 1: CI ============
  doc.fontSize(16).text("COMMERCIAL INVOICE", { align: "center" });
  doc.moveDown(0.3);
  doc.fontSize(9).fillColor("#444").text(`${company} | ${sellerEmail} | WhatsApp: +${wa1} / +${wa2}`, { align: "center" });
  doc.fillColor("black");
  doc.moveDown(1);

  doc.fontSize(10);
  doc.text(`Invoice No: ${invNo}`);
  doc.text(`Date: ${dateStr}`);
  doc.moveDown(0.6);

  doc.text(buyer);
  doc.text(shipTo);
  doc.moveDown(0.8);

  // Items table (simple)
  doc.fontSize(11).text("Items", { underline: true });
  doc.moveDown(0.4);
  doc.fontSize(10);
  doc.text(`SKU: ${sku}`);
  doc.text(`Quantity: ${qty}`);
  doc.text(`Unit Price (Landed Est.): ${money(currency, unit)}`);
  doc.text(`Subtotal: ${money(currency, subtotal)}`);
  doc.moveDown(0.8);

  doc.fontSize(10).fillColor("#444").text(
    `Tax & Cost Breakdown (Est.):\n` +
    `EXW: ${money(currency, exw)}\n` +
    `Risk Add: ${money(currency, risk)}\n` +
    `Import Tax Add: ${money(currency, importtax)}\n` +
    `VAT Add: ${money(currency, vat)}\n`,
    { lineGap: 3 }
  );
  doc.fillColor("black");
  doc.moveDown(0.6);

  doc.fontSize(9).fillColor("#444").text(
    "Terms:\n" +
    "1) This document is generated for quick confirmation and record.\n" +
    "2) Final unit price depends on confirmed SKU specification, packaging and final address.\n" +
    "3) DDP availability depends on destination country and customs conditions.\n" +
    "4) Warranty & after-sales policy follow the confirmed PO terms.\n",
    { lineGap: 3 }
  );
  doc.fillColor("black");

  // “公司章 + 签名”（文本章）
  doc.moveDown(1);
  doc.fontSize(10).text("Seller Authorization", { underline: true });
  doc.moveDown(0.5);
  doc.text("Signature: ____________________________");
  doc.text("Name/Title: ____________________________");
  doc.moveDown(0.3);

  // Text seal box
  doc.rect(380, doc.y - 30, 160, 60).stroke();
  doc.fontSize(9).fillColor("#111").text("OFFICIAL SEAL", 400, doc.y - 22);
  doc.fontSize(10).text(company, 392, doc.y - 6);
  doc.fillColor("black");

  // New page
  doc.addPage();

  // ============ PAGE 2: PL ============
  doc.fontSize(16).text("PACKING LIST", { align: "center" });
  doc.moveDown(0.3);
  doc.fontSize(9).fillColor("#444").text(`${company} | ${sellerEmail} | WhatsApp: +${wa1} / +${wa2}`, { align: "center" });
  doc.fillColor("black");
  doc.moveDown(1);

  doc.fontSize(10).text(`Reference Invoice: ${invNo}`);
  doc.text(`Date: ${dateStr}`);
  doc.moveDown(0.8);

  doc.fontSize(11).text("Packing Details", { underline: true });
  doc.moveDown(0.4);
  doc.fontSize(10);
  doc.text(`SKU: ${sku}`);
  doc.text(`Qty: ${qty}`);
  doc.text(`Cartons: ${cartons}`);
  doc.text(`Net Weight (NW): ${nw}`);
  doc.text(`Gross Weight (GW): ${gw}`);
  doc.text(`CBM: ${cbm}`);
  doc.moveDown(0.8);

  doc.fontSize(9).fillColor("#444").text(
    "Notes:\n" +
    "1) Carton marks and dimensions can be provided upon request.\n" +
    "2) For Amazon/Warehouse delivery, label & palletization rules apply.\n" +
    "3) If you need ISTA 6A drop test proof / compliance pack, request it in WhatsApp.\n",
    { lineGap: 3 }
  );
  doc.fillColor("black");

  doc.end();
}
