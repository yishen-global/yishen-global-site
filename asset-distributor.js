/* =======================================================
   YISHEN GLOBAL — ASSET DISTRIBUTOR V5.0
   Sovereign Intelligence Asset Routing Engine
======================================================= */

(async function () {
  const log = (m) => console.log("%c[ASSET_DISTRIBUTOR]", "color:#0ea5e3", m);

  async function loadLedger() {
    const r = await fetch("/asset-ledger.json");
    return r.json();
  }

  async function distribute() {
    const ledger = await loadLedger();
    const products = ledger.products || [];

    products.forEach(p => {
      const block = document.querySelector(`[data-sku="${p.id}"]`);
      if (!block) return;

      block.innerHTML = `
        <div class="font-mono text-[10px] text-[#0ea5e3] uppercase tracking-widest">HS ${p.hs_code}</div>
        <h4 class="mt-2 text-white font-bold italic uppercase">${p.name}</h4>
        <div class="text-[10px] text-gray-500 mt-1">Cert: ${p.certifications.join(", ")}</div>
        <div class="mt-3 h-[2px] bg-white/10">
          <div class="h-full bg-[#0ea5e3]" style="width:${p.sov_score}%"></div>
        </div>
        <a href="${p.passport_url}" class="inline-block mt-4 px-4 py-2 bg-[#0ea5e3] text-black text-xs font-black italic">
          ACCESS_PASSPORT
        </a>
      `;
    });

    log("SKU assets distributed.");
  }

  document.addEventListener("DOMContentLoaded", distribute);
})();
