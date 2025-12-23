/**
 * =========================================================
 * YISHEN GLOBAL — HQ CORE GATE (SOVEREIGN FRONTEND GATE)
 * File: public/hq-core-gate.js
 * Version: 1.0.0
 *
 * Goals:
 * - 不改你现有业务逻辑：只“门禁 + 探活 + 降级”
 * - 统一全站 API 端点健康检查（/api/hs /api/agent /api/briefing）
 * - 统一 intel-feed 注入状态（public/assets/data/intel-feed.json）
 * - 给 terminal-logic.js 提供可读的电力状态（避免 SYNC_FAIL）
 * - 为未来 Agent/AI 行为接口预留
 * =========================================================
 */

(function () {
  "use strict";

  // -----------------------------
  // CONFIG
  // -----------------------------
  const CFG = {
    version: "1.0.0",
    // 你站点的静态文件 / 数据文件
    intelFeedUrl: "/assets/data/intel-feed.json",
    // 可选：如果你有 health 端点，改成 /api/health
    healthUrl: "/api/health",
    // 需要通电的端点
    endpoints: {
      hs: { method: "GET", url: "/api/hs?q=9401" },
      agent: { method: "POST", url: "/api/agent", body: { task: "ping" } },
      briefing: { method: "POST", url: "/api/briefing", body: { company: "PING", interest_sector: "FURNITURE" } }
    },
    timeoutMs: 6500,
    retry: { times: 1, gapMs: 450 },
    debug: false
  };

  // -----------------------------
  // STATE (PUBLIC)
  // -----------------------------
  const STATE = {
    bootedAt: new Date().toISOString(),
    online: navigator.onLine,
    intel: { ok: false, items: 0, updatedAt: null, url: CFG.intelFeedUrl },
    api: {
      ok: false,
      health: null,
      hs: null,
      agent: null,
      briefing: null
    },
    lastError: null
  };

  // -----------------------------
  // UTILS
  // -----------------------------
  const log = (...args) => CFG.debug && console.log("[HQ_CORE_GATE]", ...args);
  const warn = (...args) => console.warn("[HQ_CORE_GATE]", ...args);

  function $(sel, ctx = document) { return ctx.querySelector(sel); }
  function $all(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

  function withTimeout(promise, ms, tag = "TIMEOUT") {
    let t;
    const timeout = new Promise((_, rej) => {
      t = setTimeout(() => rej(new Error(tag)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
  }

  async function safeFetch(url, opts = {}) {
    const r = await withTimeout(fetch(url, opts), CFG.timeoutMs, "FETCH_TIMEOUT");
    // 某些静态资源可能 304/206 等，这里只要 ok 即可
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      throw new Error(`HTTP_${r.status} ${txt?.slice(0, 120) || ""}`.trim());
    }
    return r;
  }

  async function tryN(fn, times = 1) {
    let lastErr = null;
    for (let i = 0; i <= times; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        if (i < times) await new Promise(res => setTimeout(res, CFG.retry.gapMs));
      }
    }
    throw lastErr;
  }

  function setAttr(el, name, val) {
    if (!el) return;
    el.setAttribute(name, String(val));
  }

  function setText(el, val) {
    if (!el) return;
    el.textContent = String(val);
  }

  // -----------------------------
  // UI STATUS BEACON (OPTIONAL)
  // 你页面若有这些元素，会自动写入状态：
  //  - #hq-status
  //  - [data-hq="intel-status"]
  //  - [data-hq="api-status"]
  // -----------------------------
  function paintStatus() {
    const hq = $("#hq-status");
    if (hq) {
      const ok = STATE.api.ok && STATE.intel.ok;
      hq.className = ok ? "text-[#0ea5e3]" : "text-[#A11219]";
      hq.textContent = ok ? "HQ_CORE: ONLINE" : "HQ_CORE: DEGRADED";
    }

    $all("[data-hq='intel-status']").forEach(el => {
      const ok = STATE.intel.ok;
      el.className = ok ? "text-[#0ea5e3]" : "text-[#A11219]";
      el.textContent = ok
        ? `INTEL: OK (${STATE.intel.items})`
        : "INTEL: OFFLINE";
    });

    $all("[data-hq='api-status']").forEach(el => {
      const ok = STATE.api.ok;
      el.className = ok ? "text-[#0ea5e3]" : "text-[#A11219]";
      el.textContent = ok ? "API: OK" : "API: DEGRADED";
    });
  }

  // -----------------------------
  // INTEL FEED
  // -----------------------------
  async function loadIntelFeed() {
    const r = await safeFetch(CFG.intelFeedUrl, { method: "GET", cache: "no-store" });
    const data = await r.json();

    // 兼容多种结构：
    // { updated_at, items: [...] } 或 { items: [...] } 或直接 [...]
    const items = Array.isArray(data) ? data : (data.items || []);
    STATE.intel.ok = true;
    STATE.intel.items = items.length;
    STATE.intel.updatedAt = data.updated_at || data.updatedAt || null;

    // 给全站暴露 intel 快取（给任何页面用）
    window.__INTEL_FEED__ = { items, meta: STATE.intel };
    log("intel-feed loaded:", STATE.intel);
  }

  // -----------------------------
  // API HEALTH CHECK
  // -----------------------------
  async function checkHealth() {
    try {
      // 如果你没做 /api/health，这个会失败但不致命
      const r = await safeFetch(CFG.healthUrl, { method: "GET", cache: "no-store" });
      const data = await r.json().catch(() => ({}));
      STATE.api.health = { ok: true, data };
      return true;
    } catch (e) {
      STATE.api.health = { ok: false, error: String(e.message || e) };
      return false;
    }
  }

  async function checkEndpoint(name, def) {
    const opts = { method: def.method, headers: {} };

    if (def.method === "POST") {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(def.body || {});
    }

    const r = await safeFetch(def.url, { ...opts, cache: "no-store" });
    // 尝试读 json，否则只认为可达
    const data = await r.json().catch(() => null);
    STATE.api[name] = { ok: true, data };
    return true;
  }

  async function checkAPIs() {
    // 先探活 health（可选）
    await checkHealth();

    const names = Object.keys(CFG.endpoints);
    const results = [];

    for (const n of names) {
      try {
        await tryN(() => checkEndpoint(n, CFG.endpoints[n]), CFG.retry.times);
        results.push(true);
      } catch (e) {
        STATE.api[n] = { ok: false, error: String(e.message || e) };
        results.push(false);
      }
    }

    STATE.api.ok = results.every(Boolean);
    log("api status:", STATE.api);
  }

  // -----------------------------
  // HARDEN / DEGRADE
  // - 如果 API 不通：禁用 terminal 的按钮/输入，显示“离线模式”
  // -----------------------------
  function applyDegradeMode() {
    const degraded = !(STATE.api.ok);

    // 给 body 打标识，方便你 CSS 做不同电力状态
    document.body.classList.toggle("hq-degraded", degraded);
    document.body.classList.toggle("hq-online", !degraded);

    // 终端相关（如果页面有这些 id，就自动接管）
    const hsBtn = $("#hs-search-btn");
    const agentBtn = $("#agent-run-btn");
    const briefingBtn = $("#briefing-btn");

    if (degraded) {
      [hsBtn, agentBtn, briefingBtn].forEach(btn => {
        if (!btn) return;
        btn.disabled = true;
        btn.style.opacity = "0.45";
        btn.style.cursor = "not-allowed";
      });

      // 让用户看懂：不是“你错了”，是“端点没通电”
      const hsStatus = $("#hs-status");
      const agentOut = $("#agent-output");
      const formStatus = $("#form-status");

      setText(hsStatus, "POWER_OFF (API)");
      if (agentOut) {
        agentOut.innerHTML = "";
        const div = document.createElement("div");
        div.className = "text-[#A11219]";
        div.textContent = "> HQ_GATE: API_OFFLINE. Deploy Vercel endpoints to activate Agent/HS/Briefing.";
        agentOut.appendChild(div);
      }
      if (formStatus) {
        formStatus.classList.remove("hidden");
        formStatus.innerHTML = `<span class="text-[#A11219]">> HQ_GATE: BRIEFING_ENDPOINT_OFFLINE</span>`;
      }
    } else {
      // 恢复按钮（不影响你原逻辑）
      [hsBtn, agentBtn, briefingBtn].forEach(btn => {
        if (!btn) return;
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
      });
    }
  }

  // -----------------------------
  // PUBLIC API
  // -----------------------------
  window.HQ_CORE_GATE = {
    version: CFG.version,
    config: CFG,
    getState: () => JSON.parse(JSON.stringify(STATE)),
    // 手动重启门禁（例如你改了端点后）
    reboot: async () => {
      await boot(true);
      return window.HQ_CORE_GATE.getState();
    }
  };

  // -----------------------------
  // BOOT
  // -----------------------------
  async function boot(force = false) {
    try {
      // 防重复
      if (STATE._booted && !force) return;
      STATE._booted = true;

      // online watcher
      STATE.online = navigator.onLine;
      window.addEventListener("online", () => { STATE.online = true; paintStatus(); });
      window.addEventListener("offline", () => { STATE.online = false; paintStatus(); });

      // 1) intel feed
      try {
        await tryN(loadIntelFeed, CFG.retry.times);
      } catch (e) {
        STATE.intel.ok = false;
        STATE.lastError = `INTEL_FEED_FAIL: ${String(e.message || e)}`;
        warn(STATE.lastError);
      }

      // 2) apis
      await checkAPIs();

      // 3) paint + degrade
      paintStatus();
      applyDegradeMode();

      // 4) 给页面标记一个“电力状态”
      setAttr(document.documentElement, "data-hq", STATE.api.ok ? "online" : "degraded");
      setAttr(document.documentElement, "data-hq-ver", CFG.version);
      log("boot complete.");

    } catch (e) {
      STATE.lastError = String(e.message || e);
      warn("BOOT_FAIL:", STATE.lastError);
      paintStatus();
      applyDegradeMode();
    }
  }

  document.addEventListener("DOMContentLoaded", () => boot(false));
})();
