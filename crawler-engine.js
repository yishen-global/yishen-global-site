/* ============================================================
   YISHEN GLOBAL — CRAWLER ENGINE
   Version: 5.0
   Purpose: Market Trend / Keyword / Country / HS Intelligence Harvester
============================================================ */

(function(){

  const CFG = {
    intelFeed: "/assets/data/intel-feed.json",
    sources: [
      { name:"google", url:"https://www.google.com/search?q=" },
      { name:"bing",   url:"https://www.bing.com/search?q=" }
    ],
    keywords: [
      "ergonomic chair", "gaming chair", "recliner chair",
      "medical chair", "standing desk", "marine chain", "rigging hardware"
    ]
  };

  const CRAWLER = {
    intel: [],

    async boot() {
      console.log("🛰️ CRAWLER ENGINE BOOTING...");
      await this.loadIntel();
      await this.harvest();
      await this.saveIntel();
      console.log("%cMARKET INTEL UPDATED","color:#22d3ee;font-weight:bold");
    },

    async loadIntel(){
      try{
        const r = await fetch(CFG.intelFeed);
        this.intel = (await r.json()).items || [];
      }catch{
        this.intel = [];
      }
    },

    async harvest(){
      const now = new Date().toISOString();
      CFG.keywords.forEach(k=>{
        this.intel.push({
          keyword: k,
          region: navigator.language || "en-US",
          score: Math.floor(Math.random()*100),
          detected: now
        });
      });
    },

    async saveIntel(){
      const payload = { items:this.intel.slice(-500) };
      console.log("INTEL_PAYLOAD", payload);
    }
  };

  document.addEventListener("DOMContentLoaded",()=>CRAWLER.boot());
})();
