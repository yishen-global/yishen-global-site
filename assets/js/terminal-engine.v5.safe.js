/**
 * ============================================================
 * YISHEN GLOBAL — TERMINAL ENGINE V5 SAFE
 * Sovereign Command Interface (Client Layer)
 * Version: 5.0.0
 * ============================================================
 */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const Terminal = {
    boot() {
      this.bindHS();
      this.bindAgent();
      this.bindBriefing();
      this.systemPulse();
      console.log("%c[TERMINAL_V5]: ONLINE", "color:#0ea5e3;font-weight:bold;");
    },

    systemPulse() {
      setInterval(() => {
        document.body.classList.toggle("terminal-pulse");
      }, 3000);
    },

    // HS INTEL
    bindHS() {
      const input = $("hs-input");
      const btn = $("hs-search-btn");
      const out = $("hs-results");
      const stat = $("hs-status");

      async function query() {
        const q = input.value.trim();
        if (!q) return;
        stat.textContent = "SYNC_INTEL...";
        try {
          const r = await fetch(`/api/hs?q=${encodeURIComponent(q)}`);
          const j = await r.json();
          if (!r.ok) throw j.error;
          out.innerHTML = "";
          j.items.forEach(x => {
            const d = document.createElement("div");
            d.className = "hs-card";
            d.innerHTML = `<b>${x.code}</b> — ${x.title}`;
            out.appendChild(d);
          });
          stat.textContent = "INTEL_OK";
        } catch (e) {
          stat.textContent = "INTEL_FAIL";
        }
      }

      btn.onclick = query;
      input.onkeydown = e => e.key === "Enter" && query();
    },

    // AGENT EXEC
    bindAgent() {
      const btn = $("agent-run-btn");
      const input = $("user-task");
      const out = $("agent-output");

      btn.onclick = async () => {
        const task = input.value.trim();
        if (!task) return;
        out.innerHTML += `> ${task}<br/>`;
        try {
          const r = await fetch("/api/agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task })
          });
          const j = await r.json();
          out.innerHTML += j.result + "<br/>";
        } catch {
          out.innerHTML += "AGENT_FAIL<br/>";
        }
      };
    },

    // BRIEFING
    bindBriefing() {
      const form = $("briefing-form");
      const status = $("form-status");
      const btn = $("briefing-btn");

      form?.addEventListener("submit", async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        status.textContent = "TRANSMITTING...";
        btn.disabled = true;
        try {
          const r = await fetch("/api/briefing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
          const j = await r.json();
          status.textContent = j.message || "RECEIVED";
        } catch {
          status.textContent = "FAIL";
          btn.disabled = false;
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => Terminal.boot());
})();
