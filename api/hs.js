export default async function handler(req, res) {
  try {
    const qRaw = (req.query.q || "").toString().trim();
    const q = qRaw.replace(/[^\d.]/g, "");

    if (!q) {
      return res.status(400).json({ error: "Missing query ?q=7315" });
    }

    // ✅ V1: 内置情报库（先保证你全站真跑，0 bug）
    const intel = [
      { code: "7315", title: "Chain and parts of iron or steel", region: "GLOBAL", note: "Typical: lifting chain, welded chain, link chain. Extend with G80/G100 & compliance nodes." },
      { code: "9401", title: "Seats (chairs) and parts", region: "GLOBAL", note: "Office chair, gaming chair, parts. Extend: mesh chair 9401.30/9401.71 etc." },
      { code: "9402", title: "Medical, dental, veterinary furniture", region: "GLOBAL", note: "Hospital beds, examination chairs. Extend with FDA/CE/MDR gating logic." },
      { code: "4418", title: "Builders' joinery and carpentry of wood", region: "GLOBAL", note: "Doors, windows, frames; can map to bamboo/wood composites as needed." },
    ];

    const items = intel.filter(x => x.code.includes(q) || q.includes(x.code));

    // ✅ 未来可接：Trademo / ImportGenius / 自建数据库
    // const external = await fetch("https://...", { headers: { Authorization: `Bearer ${process.env.X_API_KEY}` } })

    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: "HS_INTERNAL_ERROR", detail: String(e?.message || e) });
  }
}
