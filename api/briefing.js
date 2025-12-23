export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

  const payload = req.body || {};
  // 这里只做“接单回执”，不存数据库，保证你站先通电
  res.status(200).json({
    message: "MISSION_RECEIVED | BRIEFING_PACKET_ACCEPTED",
    received: {
      interest_sector: payload.interest_sector || "UNKNOWN",
      country: payload.country || "UNKNOWN",
      buyer_type: payload.buyer_type || "UNKNOWN"
    }
  });
}
