const { calcPrice } = require("./dtc_pricing_engine");
const SKU = require("../data/sku_matrix_v3_1_master.json");

function generateFeed(channel, country) {
  return Object.keys(SKU).map(code => {
    return {
      sku: code,
      channel,
      country,
      price: calcPrice(code, country, channel),
      currency: country === "US" ? "USD" : "LOCAL"
    };
  });
}

module.exports = { generateFeed };
