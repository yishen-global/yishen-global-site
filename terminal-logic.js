(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* =========================================================
   * GLOBAL FAIL-SAFE
   * ========================================================= */
  window.addEventListener("error", (e) => {
    console.error("[TERMINAL_CORE]", e.message);
  });
  window.addEventListener("unhandledrejection", (e) => {
    console.error("[TERMINAL_CORE_PROMISE]", e.reason);
  });

  const safeFetch = (url, opts = {}, timeout = 12000) =>
    Promise.race([
      fetch(url, opts),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("NETWORK_TIMEOUT")), timeout)
      )
    ]);

  // =========================================================
  // HS LOOKUP
  // =========================================================
  const hsInput = $("hs-input");
  const hsBtn = $("hs-search-btn");
  const hsStatus = $("hs-status");
  const hsResults = $("hs-results");

  function renderHS(items) {
    hsResults.innerHTML = "";
    if (!items || items.length === 0) {
      hsResults.innerHTML = `<div class="font-mono text-[10px] text-gray-500">> NO_MATCH. Try 7315 / 9401 / 9402 ...</div>`;
      return;
    }
    items.slice(0, 20).forEach((x) => {
      const div = document.createElement("div");
      div.className = "p-3 border border-white/5 bg-white/[0.02] rounded-sm";
      div.innerHTML = `
        <div class="flex items-center justify-between gap-3">
          <div class="font-mono text-[10px] text-[#0ea5e3] uppercase tracking-widest">HS ${escapeHtml(x.code || "")}</div>
          <div class="font-mono text-[9px] text-gray-600 uppercase">${escapeHtml(x.region || "GLOBAL")}</div>
        </div>
        <div class="mt-2 text-sm text-gray-300">${escapeHtml(x.title || "")}</div>
        <div class="mt-1 text-[10px] text-gray-500 font-mono leading-relaxed">${escapeHtml(x.note || "")}</div>
      `;
      hsResults.appendChild(div);
    });
  }

  async function hsSearch() {
    const q = (hsInput.value || "").trim();
    if (!q) return;
    hsStatus.textContent = "FETCHING_INTEL...";
    try {
      const r = await safeFetch(`/api/hs?q=${encodeURIComponent(q)}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "HS_API_ERROR");
      renderHS(data.items || []);
      hsStatus.textContent = "SYNC_OK";
    } catch (e) {
      hsStatus.textContent = "SYNC_FAIL";
      hsResults.innerHTML = `<div class="font-mono text-[10px] text-[#A11219]">> HS_LOOKUP_ERROR: ${escapeHtml(String(e.message || e))}</div>`;
    }
  }

  hsBtn?.addEventListener("click", hsSearch);
  hsInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") hsSearch(); });

  // =========================================================
  // AGENT
  // =========================================================
  const agentBtn = $("agent-run-btn");
  const taskInput = $("user-task");
  const agentOut = $("agent-output");

  function logAgent(line, color = "text-gray-400") {
    const div = document.createElement("div");
    div.className = color;
    div.textContent = line;
    agentOut.appendChild(div);
    agentOut.scrollTop = agentOut.scrollHeight;
  }

  async function runAgentReal() {
    const task = (taskInput.value || "").trim();
    if (!task) return;

    logAgent(`> INIT: ${task}`, "text-[#0ea5e3]");
    logAgent(`> ROUTING_TO_AGENT_NODE...`);

    try {
      const r = await safeFetch(`/api/agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "AGENT_API_ERROR");

      (data.logs || []).forEach((l) => logAgent(l, "text-gray-400"));
      if (data.result) logAgent(`> RESULT: ${data.result}`, "text-[#ffd700]");
    } catch (e) {
      logAgent(`> AGENT_ERROR: ${String(e.message || e)}`, "text-[#A11219]");
    }
  }

  agentBtn?.addEventListener("click", runAgentReal);
  taskInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") runAgentReal(); });

  // =========================================================
  // BRIEFING FORM
  // =========================================================
  const form = $("briefing-form");
  const status = $("form-status");
  const btn = $("briefing-btn");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());

    status.classList.remove("hidden");
    status.innerHTML = `<span class="text-[#0ea5e3]">> UPLOADING_ENCRYPTED_PACKET...</span>`;
    btn.disabled = true;
    btn.style.opacity = "0.6";

    try {
      const r = await safeFetch(`/api/briefing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "BRIEFING_API_ERROR");

      status.innerHTML = `<span class="text-[#ffd700]">> SUCCESS: ${escapeHtml(data.message || "MISSION_RECEIVED")}</span>`;

      setTimeout(() => {
        const id = (payload.interest_sector === "MEDICAL_PRECISION") ? "HS_9402" : "OFFICE_MESH_V4";
        window.location.href = `technical-passport.html?id=${encodeURIComponent(id)}`;
      }, 1200);

    } catch (err) {
      status.innerHTML = `<span class="text-[#A11219]">> FAIL: ${escapeHtml(String(err.message || err))}</span>`;
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  });

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
