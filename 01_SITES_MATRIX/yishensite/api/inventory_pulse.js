const THRESH = require("../data/inventory_threshold.json");

function checkPulse(stock, dailySales, country="GLOBAL"){
  const min = THRESH[country]?.minDays || THRESH.GLOBAL.minDays;
  const daysLeft = stock / dailySales;

  if (daysLeft < min){
    return {
      alert: true,
      action: "REORDER_NOW",
      daysLeft: Math.round(daysLeft)
    };
  }
  return { alert:false, daysLeft: Math.round(daysLeft) };
}

module.exports = { checkPulse };
