/* ============================================================
   YISHEN GLOBAL — HQ CORE GATE
   Version: 5.0 Sovereign Edition
   Function: Global AI Commerce Mother Bus
   Status: LIVE POWER CORE
============================================================ */

(function () {

  const CFG = {
    version: "5.0",
    intelFeedUrl: "/assets/data/intel-feed.json",

    endpoints: {
      hs: {
        method: "GET",
        url: "/api/hs?q=9401"
      },
      agent: {
        method: "POST",
        url: "/api/agent",
        body: { task: "PING" }
      },
      briefing: {
        method: "POST",
        url: "/api/briefing",
        body: { company: "PING", interest_sector: "OFFICE" }
      }
    },

    retry: { times: 2, gapMs: 800 },
    timeoutMs: 6500
  };

  const HQ = {
    online: false,
    intel: [],

    async boot() {
      console.log("⚡ HQ CORE GATE BOOTING...");
      try {
        await this.syncIntel();
        await this.pingNodes();
        this.online = true;
        document.body.classList.add("hq-online");
        console.log("%cHQ CORE ONLINE", "color:#0ea5e3;font-weight:bold");
      } catch (e) {
        console.error("HQ CORE BOOT FAIL", e);
      }
    },

    async syncIntel() {
      const r = await fetch(CFG.intelFeedUrl);
      const j = await r.json();
      this.intel = j.items || [];
      console.log("INTEL SYNCED:", this.intel.length, "signals");
    },

    async pingNodes() {
      for (let k in CFG.endpoints) {
        const ep = CFG.endpoints[k];
        await this.call(ep.method, ep.url, ep.body || null);
        console.log("NODE OK:", k);
      }
    },

    async call(method, url, body = null, retry = 0) {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), CFG.timeoutMs);

      try {
        const r = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : null,
          signal: controller.signal
        });
        clearTimeout(t);
        return await r.json();
      } catch (e) {
        clearTimeout(t);
        if (retry < CFG.retry.times) {
          await new Promise(r => setTimeout(r, CFG.retry.gapMs));
          return this.call(method, url, body, retry + 1);
        }
        throw e;
      }
    }
  };

  document.addEventListener("DOMContentLoaded", () => HQ.boot());

})();
