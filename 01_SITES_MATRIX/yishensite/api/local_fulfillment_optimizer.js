const ROUTES = require("../data/warehouse_routes.json");

function pickWarehouse(country){
  const list = ROUTES[country];
  if (!list) return null;

  // 综合时效优先 + 成本权重
  return list.sort((a,b)=>{
    const scoreA = a.avgDays * a.cost;
    const scoreB = b.avgDays * b.cost;
    return scoreA - scoreB;
  })[0];
}

module.exports = { pickWarehouse };
