const SKU = require("../data/sku_matrix_v3_1_master.json");
const PROFIT = require("../data/profit_shield.json");
const FLOOR = require("../data/price_floor.json");
const { calcPrice } = require("./dtc_pricing_engine");

function scan(listings, channel, country) {
  const alerts = [];

  listings.forEach(item => {
    const fair = calcPrice(item.sku, country, channel);
    const floorRatio = FLOOR.COUNTRY_FLOOR[country] || FLOOR.GLOBAL.minDiscount;
    const minAllowed = Math.round(fair * floorRatio);

    if (item.price < minAllowed) {
      alerts.push({
        sku: item.sku,
        channel,
        country,
        marketPrice: item.price,
        minAllowed,
        action: "VIOLATION"
      });
    }
  });

  return alerts;
}

module.exports = { scan };
