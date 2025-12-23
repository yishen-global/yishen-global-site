/* ============================================================
   YISHEN GLOBAL — GLOBAL MAPPING GATE
   Version: 5.0
   Purpose: Global Market / Tariff / HS / SKU Sovereign Router
============================================================ */

(function(){

  const CFG = {
    skuDB: "/assets/data/sku-database.json",
    intelFeed: "/assets/data/intel-feed.json",
    sitemapPing: "/sitemap.xml"
  };

  const MAP = {
    skus: [],
    intel: [],

    async boot() {
      console.log("🌍 GLOBAL MAPPING GATE BOOTING...");
      await this.loadData();
      this.mountGeoRouter();
      console.log("%cGLOBAL MAPPING ONLINE","color:#22d3ee;font-weight:bold");
    },

    async loadData() {
      const s = await fetch(CFG.skuDB);
      const i = await fetch(CFG.intelFeed);
      this.skus = (await s.json()).items || [];
      this.intel = (await i.json()).items || [];
      console.log("SKUs:",this.skus.length,"INTEL:",this.intel.length);
    },

    mountGeoRouter() {
      document.querySelectorAll("[data-sku]").forEach(el=>{
        const sku = el.dataset.sku;
        const record = this.skus.find(x=>x.sku===sku);
        if(!record) return;

        const geo = navigator.language || "en-US";
        const region = geo.split("-")[1] || "US";

        const best = record.routes.find(r=>r.regions.includes(region)) || record.routes[0];
        el.href = best.url;
        el.dataset.hs = record.hs;
      });
    }
  };

  document.addEventListener("DOMContentLoaded",()=>MAP.boot());
})();
