const { gravityPrice } = require("./gravity_engine");

function dailyTune(listings) {
  return listings.map(i => ({
    sku: i.sku,
    recommendPrice: gravityPrice(i.sku, i.country, i.channel)
  }));
}
module.exports = { dailyTune };
