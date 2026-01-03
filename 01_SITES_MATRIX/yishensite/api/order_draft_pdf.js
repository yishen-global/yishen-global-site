import PDFDocument from "pdfkit";

function safe(v, d = "") {
  const s = String(v ?? d);
  return s.length > 200 ? s.slice(0, 200) : s;
}

export default function handler(req, res) {
  const sku = safe(req.query.sku, "TBD");
  const qty = safe(req.query.qty, "1");
  const country = safe(req.query.country, "US");
  const currency = safe(req.query.currency, "USD");
  const unit = safe(req.query.unit, "0");
  const subtotal = safe(req.query.subtotal, "0");
  const lang = safe(req.query.lang, "en");

  const company = "YISHEN GLOBAL";
  const email = process.env.RFQ_EMAIL || "alex.yang@yishenglobal.net";
  const wa1 = process.env.WA_PRIMARY || "8618857277313";
  const wa2 = process.env.WA_SECONDARY || "8615968277867";

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="Order_Draft_${sku}.pdf"`);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.pipe(res);

  doc.fontSize(18).text("ORDER DRAFT / PROFORMA (AUTO)", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#444")
    .text(`${company}  |  Email: ${email}  |  WhatsApp: +${wa1} / +${wa2}`, { align: "center" });
  doc.fillColor("black");
  doc.moveDown(1);

  doc.fontSize(12).text("Buyer / Delivery");
  doc.fontSize(11).text(`Country: ${country}`);
  doc.moveDown(0.6);

  doc.fontSize(12).text("Items");
  doc.moveDown(0.3);

  doc.fontSize(11)
    .text(`SKU: ${sku}`)
    .text(`Qty: ${qty}`)
    .text(`Unit Price (est.): ${currency} ${unit}`)
    .text(`Subtotal (est.): ${currency} ${subtotal}`);
  doc.moveDown(0.8);

  doc.fontSize(11).text("Notes");
  doc.fontSize(10).fillColor("#444")
    .text("1) This is an auto-generated draft for quick confirmation.\n2) Final pricing depends on SKU specification, packaging, and exact delivery address.\n3) DDP availability depends on country and channel.", { lineGap: 4 });
  doc.fillColor("black");
  doc.moveDown(1);

  doc.fontSize(11).text("Confirmation");
  doc.fontSize(10).fillColor("#444")
    .text("Reply CONFIRM on WhatsApp to lock production slot and we will send the final invoice & packing details.", { lineGap: 4 });
  doc.fillColor("black");

  doc.end();
}
