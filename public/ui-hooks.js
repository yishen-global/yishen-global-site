/**
 * =========================================================
 * YISHEN GLOBAL — UI HOOKS CORE
 * Version: 1.0.0
 * Role: Frontend Nervous System (Non-invasive)
 * =========================================================
 * - 不依赖任何框架
 * - 不修改现有逻辑
 * - 只监听、协调、增强
 * - 为未来 AI / Agent / 行为识别 预留接口
 * =========================================================
 */

(function () {
  "use strict";

  /* ---------------------------------------------------------
   * GLOBAL STATE
   * --------------------------------------------------------- */
  const UI_STATE = {
    scrolled: false,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    lastInteraction: Date.now()
  };

  /* ---------------------------------------------------------
   * UTILS
   * --------------------------------------------------------- */
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

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------
   * SCROLL HOOK
   * 用于：
   * - 导航状态
   * - 未来：滚动行为分析
   * --------------------------------------------------------- */
  const onScroll = throttle(() => {
    const y = window.scrollY || document.documentElement.scrollTop;

    if (y > 20 && !UI_STATE.scrolled) {
      UI_STATE.scrolled = true;
      document.body.classList.add("ui-scrolled");
    }

    if (y <= 20 && UI_STATE.scrolled) {
      UI_STATE.scrolled = false;
      document.body.classList.remove("ui-scrolled");
    }
  }, 80);

  /* ---------------------------------------------------------
   * VIEWPORT HOOK
   * --------------------------------------------------------- */
  const onResize = throttle(() => {
    UI_STATE.viewport.width = window.innerWidth;
    UI_STATE.viewport.height = window.innerHeight;
  }, 150);

  /* ---------------------------------------------------------
   * INTERACTION TRACKER（轻量）
   * 为未来 Buyer / Agent 行为判断预留
   * --------------------------------------------------------- */
  const markInteraction = () => {
    UI_STATE.lastInteraction = Date.now();
  };

  /* ---------------------------------------------------------
   * DATA ATTR HOOKS
   * data-ui="hover-glow"
   * data-ui="pulse"
   * --------------------------------------------------------- */
  const initDataUIHooks = () => {
    qsa("[data-ui]").forEach(el => {
      const type = el.getAttribute("data-ui");

      if (type === "hover-glow") {
        el.addEventListener("mouseenter", () => {
          el.classList.add("ui-hover-glow");
        });
        el.addEventListener("mouseleave", () => {
          el.classList.remove("ui-hover-glow");
        });
      }

      if (type === "pulse") {
        setInterval(() => {
          el.classList.toggle("ui-pulse");
        }, 3000);
      }
    });
  };

  /* ---------------------------------------------------------
   * ANCHOR SAFETY HOOK
   * 防止 # 空链接误跳
   * --------------------------------------------------------- */
  const protectAnchors = () => {
    qsa("a[href='#']").forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
      });
    });
  };

  /* ---------------------------------------------------------
   * IMAGE FALLBACK（防 404 / 防白屏）
   * --------------------------------------------------------- */
  const imageFallback = () => {
    qsa("img").forEach(img => {
      img.onerror = () => {
        img.style.opacity = "0.3";
        img.alt = "IMAGE_UNAVAILABLE";
      };
    });
  };

  /* ---------------------------------------------------------
   * PUBLIC API（给未来 Agent / AI 用）
   * --------------------------------------------------------- */
  window.UI_HOOKS = {
    getState: () => ({ ...UI_STATE }),
    markInteraction,
    version: "1.0.0"
  };

  /* ---------------------------------------------------------
   * INIT
   * --------------------------------------------------------- */
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("click", markInteraction);
  document.addEventListener("keydown", markInteraction);

  document.addEventListener("DOMContentLoaded", () => {
    initDataUIHooks();
    protectAnchors();
    imageFallback();
  });

})();
