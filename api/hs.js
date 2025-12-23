export default function handler(req, res) {
  const q = String(req.query.q || "").trim();

  const DB = [
    { code: "9401.31", region: "US/EU", title: "Swivel seats with adjustable height (office chairs, mesh chairs)", note: "Typical office/gaming mesh chair classification. Verify exact materials & mechanisms." },
    { code: "7315.82", region: "GLOBAL", title: "Weldless iron/steel chain (alloy / lifting / marine)", note: "Common for G80/G100 lifting chain & rigging. Confirm grade and end-use." },
    { code: "9402.10", region: "GLOBAL", title: "Medical, surgical, dental or veterinary furniture", note: "Medical chairs, treatment chairs. Confirm ISO13485 documentation if applicable." },
    { code: "7616.99", region: "US/EU", title: "Other articles of aluminum", note: "Infrastructure MRO items / ladders might map here depending on structure & standard." }
  ];

  const items = DB.filter(x => x.code.includes(q) || (x.title || "").toLowerCase().includes(q.toLowerCase()));
  res.status(200).json({ items });
}
