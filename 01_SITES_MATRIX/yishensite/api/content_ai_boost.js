const CONTENT = require("../data/content_variants.json");

function pickVariant(sku, performanceLog){
  const pool = CONTENT[sku];
  const best = performanceLog.sort((a,b)=>b.cr-a.cr)[0];
  return best || {
    title: pool.titles[0],
    bullets: pool.bullets[0],
    video: pool.videos[0]
  };
}

module.exports = { pickVariant };
