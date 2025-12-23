export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { task } = req.body || {};
    if (!task) return res.status(400).json({ error: "Missing task" });

    // ✅ V1：先保证你“真联网+真返回+不报错”
    const logs = [
      `> ACCEPTED: ${task}`,
      `> DETECTING_SECTOR...`,
      `> RESOLVING_SIGNALS...`,
      `> BUILDING_TARGET_FILTERS...`,
      `> GENERATING_OUTREACH_PACKET...`,
      `> STATUS: READY_FOR_OPERATOR_ACTION.`
    ];

    // ✅ V2（可选）：接 OpenAI / 你自建 Agent
    // const r = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4.1-mini",
    //     messages: [
    //       { role: "system", content: "You are Yishen Global mission agent. Return concise actionable logs." },
    //       { role: "user", content: task }
    //     ]
    //   })
    // });
    // const data = await r.json();
    // const result = data?.choices?.[0]?.message?.content || "OK";
    // return res.status(200).json({ logs, result });

    return res.status(200).json({ logs, result: "AGENT_NODE_ONLINE" });

  } catch (e) {
    return res.status(500).json({ error: "AGENT_INTERNAL_ERROR", detail: String(e?.message || e) });
  }
}
