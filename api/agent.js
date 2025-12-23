export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

  const { task } = req.body || {};
  const t = String(task || "").trim();
  if (!t) return res.status(400).json({ error: "EMPTY_TASK" });

  // 先做“通电版”agent：输出可执行步骤 + 选择的节点
  const logs = [
    `> AGENT_NODE: V5_INTEL_ROUTER`,
    `> TASK_RECEIVED: ${t}`,
    `> COLLISION: SIGNALS x SKU_LEDGER x HS_KNOWLEDGE`,
    `> OUTPUT_MODE: EXECUTABLE_STEPS`,
    `> DONE`
  ];

  const result = `ROUTE_OK | Suggest: run harvester -> rebuild sitemap -> deploy.`;
  res.status(200).json({ logs, result });
}
