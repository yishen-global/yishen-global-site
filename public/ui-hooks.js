/**
 * =========================================================
 * YISHEN GLOBAL — UI HOOKS CORE
 * Version: 1.1.0 (POWER_PATCHED)
 * Role: Frontend Nervous System (Non-invasive)
 * =========================================================
 * - 内容零变更
 * - 功能零删减
 * - 只补：电源 / 安全 / 移动端 / SEO / Agent 通道
 * =========================================================
 */

(function () {
  "use strict";

  if (window.__UI_HOOKS_LOADED__) return;
  window.__UI_HOOKS_LOADED__ = true;

  /* --------------------------------------------------------- */
  const UI_STATE = {
    scrolled: false,
    viewport: {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    },
    lastInteraction: Date.now()
  };

  const throttle = (fn, wait = 100) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  };

  const qs = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* --------------------------------------------------------- */
  const onScroll = throttle(() => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (y > 20 && !UI_STATE.scrolled) {
      UI_STATE.scrolled = true;
      document.body.classList.add("ui-scrolled");
    }
    if (y <= 20 && UI_STATE.scrolled) {
      UI_STATE.scrolled = false;
      document.body.classList.remove("ui-scrolled");
    }
  }, 80);

  const onResize = throttle(() => {
    UI_STATE.viewport.width = window.innerWidth || document.documentElement.clientWidth;
    UI_STATE.viewport.height = window.innerHeight || document.documentElement.clientHeight;
  }, 150);

  const markInteraction = () => {
    UI_STATE.lastInteraction = Date.now();
  };

  /* --------------------------------------------------------- */
  const initDataUIHooks = () => {
    qsa("[data-ui]").forEach(el => {
      const type = el.getAttribute("data-ui");
      if (type === "hover-glow") {
        el.addEventListener("mouseenter", () => el.classList.add("ui-hover-glow"));
        el.addEventListener("mouseleave", () => el.classList.remove("ui-hover-glow"));
      }
      if (type === "pulse") {
        setInterval(() => el.classList.toggle("ui-pulse"), 3000);
      }
    });
  };

  const protectAnchors = () => {
    qsa("a[href='#'],a[href='']").forEach(a => {
      a.addEventListener("click", e => e.preventDefault());
    });
  };

  const imageFallback = () => {
    qsa("img").forEach(img => {
      if (img.complete && img.naturalWidth === 0) img.onerror();
      img.onerror = () => {
        img.style.opacity = "0.3";
        img.alt = "IMAGE_UNAVAILABLE";
      };
    });
  };

  /* --------------------------------------------------------- */
  window.UI_HOOKS = Object.freeze({
    getState: () => JSON.parse(JSON.stringify(UI_STATE)),
    markInteraction,
    version: "1.1.0"
  });

  /* --------------------------------------------------------- */
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("click", markInteraction, { passive: true });
  document.addEventListener("keydown", markInteraction, { passive: true });
  document.addEventListener("touchstart", markInteraction, { passive: true });

  document.addEventListener("DOMContentLoaded", () => {
    initDataUIHooks();
    protectAnchors();
    imageFallback();
  });

})();
