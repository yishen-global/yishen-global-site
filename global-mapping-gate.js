/* ==========================================================
   YISHEN GLOBAL — GLOBAL MAPPING GATE V5.0
   Sovereign SKU Auto-Mapping Engine
   ----------------------------------------------------------
   功能：
   1. 扫描全站所有 [data-auto-sku] 节点
   2. 自动绑定 asset-ledger.json 中的主权 SKU
   3. 实时生成：HS / 名称 / 集群 / 主权进度条 / 跳转
   4. 实现一次建账 → 全站自动同步
========================================================== */

(function () {
  const log = (msg) => console.log("%c[MAPPING_GATE]", "color:#0ea5e3;font-weight:bold", msg);

  async function loadLedger() {
    const r = await fetch("/asset-ledger.json", { cache: "no-store" });
    if (!r.ok) throw new Error("LEDGER_NOT_FOUND");
    return r.json();
  }

  function render(el, sku) {
    const pct = sku.sov_score || 0;
    el.innerHTML = `
      <div class="mono text-[10px] text-[#0ea5e3] uppercase tracking-widest">
        HS ${sku.hs_code}
      </div>

      <div class="mt-2 text-white font-black italic uppercase">
        ${sku.name}
      </div>

      <div class="mt-1 text-[10px] text-gray-500 mono">
        CLUSTER: ${sku.cluster}
      </div>

      <div class="mt-3 h-[2px] bg-white/10">
        <div class="h-full bg-[#0ea5e3]" style="width:${pct}%"></div>
      </div>

      <a href="${sku.passport_url}"
         class="inline-block mt-4 px-4 py-2 bg-[#0ea5e3] text-black text-[10px] font-black italic rounded-sm">
         ACCESS_PASSPORT
      </a>
    `;
  }

  async function boot() {
    try {
      const ledger = await loadLedger();
      const nodes = document.querySelectorAll("[data-auto-sku]");
      let count = 0;

      nodes.forEach(el => {
        const id = el.dataset.autoSku;
        const sku = ledger.products.find(p => p.id === id);
        if (sku) {
          render(el, sku);
          count++;
        }
      });

      log(`SOVEREIGN_SKU_MAPPED: ${count}`);
    } catch (e) {
      console.error("[MAPPING_GATE_ERROR]", e);
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
