const { scan } = require("./price_guard_radar");
const { buildEnforce } = require("./price_guard_enforcer");

function dailyScan(channel, country, marketListings) {
  const alerts = scan(marketListings, channel, country);
  alerts.forEach(a => console.log(buildEnforce(a)));
}

module.exports = { dailyScan };
