export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { name, email, interest_sector, message } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: "Missing required fields: name, email" });

    // ✅ 这里已经是真“入库点”
    // 你可以写到：
    // - Notion database
    // - HubSpot forms
    // - Airtable
    // - Google Sheet
    // - 发送邮件给你自己

    // 示例：先打印到 Vercel 日志（你可在 Vercel -> Functions -> Logs 查看）
    console.log("BRIEFING_INTAKE", { name, email, interest_sector, message, ts: new Date().toISOString() });

    return res.status(200).json({
      ok: true,
      message: "MISSION_RECEIVED_AND_LOGGED",
    });

  } catch (e) {
    return res.status(500).json({ error: "BRIEFING_INTERNAL_ERROR", detail: String(e?.message || e) });
  }
}
