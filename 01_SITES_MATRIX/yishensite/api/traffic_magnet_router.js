function route(intent, category){
  if (intent === "compare") return `/hub/${category}/review`;
  if (intent === "buy") return `/hub/${category}/best-deals`;
  if (intent === "learn") return `/hub/${category}/pillar`;
  return `/hub/${category}/use-cases`;
}
module.exports = { route };
