/**
 * YISHEN GLOBAL – CRAWLER ENGINE v5 FINAL
 * Sovereign SKU Expansion & Index Mapping Core
 */

(async function () {
  const BASE = "/public/assets/data";
  const SKU_DB = `${BASE}/sku-database.json`;
  const INTEL = `${BASE}/intel-feed.json`;
  const MAP_API = "/api/sovereign-map";

  const $ = (id) => document.getElementById(id);

  async function loadJSON(url) {
    const r = await fetch(url);
    return r.ok ? r.json() : [];
  }

  const skuDB = await loadJSON(SKU_DB);
  const intel = await loadJSON(INTEL);

  // ===== Build Sovereign Index =====
  const sovereignIndex = skuDB.map(sku => ({
    id: sku.id,
    title: sku.title,
    hs: sku.hs,
    cluster: sku.cluster,
    url: `/technical-passport.html?id=${sku.id}`
  }));

  // ===== Push To API (optional) =====
  try {
    await fetch(MAP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sovereignIndex, intel })
    });
  } catch(e){}

  // ===== Inject Hidden Index For Bots =====
  const container = document.createElement("div");
  container.id = "sovereign-index";
  container.style.display = "none";
  container.innerHTML = sovereignIndex.map(i =>
    `<a href="${i.url}" data-hs="${i.hs}" data-cluster="${i.cluster}">${i.title}</a>`
  ).join("");

  document.body.appendChild(container);

  console.log(">> CRAWLER_ENGINE_ACTIVE | INDEX SIZE:", sovereignIndex.length);
})();
