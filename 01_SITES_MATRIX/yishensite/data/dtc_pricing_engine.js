const SKU = require("../data/sku_matrix_v3_1_master.json");
const PROFIT = require("../data/profit_shield.json");
const CHANNEL = require("../data/channel_shield.json");

function calcPrice(skuCode, country, channel="DTC") {
  const sku = SKU[skuCode];
  const base = sku.baseExport;
  const c = CHANNEL[channel];
  const p = PROFIT.COUNTRY_OVERRIDES[country] || PROFIT.GLOBAL;

  let price = base * c.margin * p.logistics_risk * p.currency_buffer;
  price = price / (1 - c.platformFee);

  return Math.round(price);
}

module.exports = { calcPrice };
