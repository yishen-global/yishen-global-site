const WATCH = require("../data/competitor_watch.json");

function analyze(country, sku, publicSignals){
  const targets = (WATCH[country] && WATCH[country][sku]) || [];
  return targets.map(t => {
    const hit = t.weak.filter(w => publicSignals.includes(w));
    return { brand: t.brand, asin: t.asin, hit };
  }).filter(x => x.hit.length);
}
module.exports = { analyze };
