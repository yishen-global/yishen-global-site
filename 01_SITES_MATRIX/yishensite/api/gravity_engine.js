const ELASTIC = require("../data/price_elasticity.json");
const { calcPrice } = require("./dtc_pricing_engine");

function gravityPrice(sku, country, channel="AMAZON") {
  const fair = calcPrice(sku, country, channel);
  const e = (ELASTIC[country] && ELASTIC[country][sku]) || ELASTIC.GLOBAL;
  const mid = fair * ((e.safeBand[0] + e.safeBand[1]) / 2);
  return Math.round(mid);
}

module.exports = { gravityPrice };
