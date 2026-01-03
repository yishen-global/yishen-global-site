const TARGET = require("../data/review_velocity.json");

function reviewPulse(orders, reviews, country="GLOBAL"){
  const rate = reviews / orders;
  const target = TARGET[country]?.targetRate || TARGET.GLOBAL.targetRate;

  return {
    rate: Number(rate.toFixed(3)),
    target,
    status: rate < target ? "UNDER_TARGET" : "OK",
    action: rate < target ? "TRIGGER_FOLLOWUP_FLOW" : "HOLD"
  };
}

module.exports = { reviewPulse };
