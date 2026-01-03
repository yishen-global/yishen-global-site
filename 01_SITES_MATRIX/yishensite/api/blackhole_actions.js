import fs from "fs";
import path from "path";
import { getFX, convert } from "./fx.js";

function read(p){ return JSON.parse(fs.readFileSync(path.join(process.cwd(),p),"utf8")); }

export async function runBlackhole(country, sku){
  const watch = read("data/competitor_watch.json");
  const shield = read("data/country_shield.json")[country] || {};

  const targets = watch[country]?.[sku] || [];
  if(!targets.length) return { status:"NO_COMPETITOR_SIGNAL" };

  let actions = [];

  for(const c of targets){
    if(c.weak.includes("highPrice")){
      actions.push({ action:"PRICE_UNDERCUT", percent:3 });
    }
    if(c.weak.includes("slowShip")){
      actions.push({ action:"FAST_DDP_TAG" });
    }
    if(c.weak.includes("lowStock")){
      actions.push({ action:"INVENTORY_PUSH" });
    }
    if(c.weak.includes("lowRating")){
      actions.push({ action:"REVIEW_BOOST" });
    }
  }

  return {
    sku,
    country,
    risk: shield.risk || 1,
    actions,
    executeAt: new Date().toISOString()
  };
}
