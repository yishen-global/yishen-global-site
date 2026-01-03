function buildEnforce(alert) {
  return {
    sku: alert.sku,
    channel: alert.channel,
    country: alert.country,
    action: "REPRICE_UP",
    target: alert.minAllowed,
    reason: "PROFIT_SHIELD_VIOLATION"
  };
}

module.exports = { buildEnforce };
