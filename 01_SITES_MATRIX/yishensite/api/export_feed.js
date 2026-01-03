const { generateFeed } = require("./platform_feed_generator");
const fs = require("fs");
const path = require("path");

function exportCSV(channel, country) {
  const data = generateFeed(channel, country);
  let csv = "SKU,Channel,Country,Price,Currency\n";

  data.forEach(d => {
    const currency = country === "US" ? "USD" :
                     country === "EU" ? "EUR" :
                     country === "AE" ? "AED" : "USD";
    csv += `${d.sku},${d.channel},${d.country},${d.price},${currency}\n`;
  });

  const dir = path.join(__dirname, "../feeds");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.writeFileSync(path.join(dir, `${channel}_${country}.csv`), csv);
  console.log("FEED GENERATED:", `${channel}_${country}.csv`);
}

// Example auto run
exportCSV("AMAZON", "US");
exportCSV("WAYFAIR", "US");
exportCSV("NOON", "AE");

module.exports = { exportCSV };
