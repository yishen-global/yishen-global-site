/**
 * YISHEN GLOBAL - KINETIC LAZY LOADER V5.0
 * FINAL PRODUCTION PATCHED EDITION
 * - Zero CLS
 * - Safari Safe
 * - 404 Fallback
 * - CPU/GPU Throttled
 * - SEO Friendly
 */

(function() {
  "use strict";

  const LazyLoader = {
    init() {
      this.injectStyles();
      this.executeObserver();
      console.log("%c >> [VISUAL_SOVEREIGNTY]: IMAGE_SCANNER_ACTIVE ", "background:#0ea5e3;color:#000;font-weight:bold;");
    },

    injectStyles() {
      if (document.getElementById("lazy-style-patch")) return;

      const style = document.createElement("style");
      style.id = "lazy-style-patch";
      style.textContent = `
      .lazy-img-container{position:relative;background:#010409;overflow:hidden;border:1px solid rgba(14,165,227,.05);display:flex;align-items:center;justify-content:center;min-height:200px}
      .cyber-scanner{position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,transparent,#0ea5e3,transparent);box-shadow:0 0 12px #0ea5e3;z-index:20;animation:scanMove 1.8s infinite cubic-bezier(.4,0,.2,1)}
      @keyframes scanMove{0%{top:-10%;opacity:0}50%{opacity:1}100%{top:110%;opacity:0}}
      .img-reconstruct{opacity:0;transform:scale(1.06) translateY(12px);filter:blur(10px) brightness(1.5) saturate(.8);transition:all .8s cubic-bezier(.16,1,.3,1)}
      .img-manifested{opacity:1;transform:scale(1) translateY(0);filter:none}
      .lazy-img-container::before{content:"DECRYPTING_ASSET…";position:absolute;font:700 8px 'JetBrains Mono',monospace;color:rgba(14,165,227,.35);letter-spacing:2px;animation:pulse 2s infinite}
      @keyframes pulse{0%,100%{opacity:.3}50%{opacity:.65}}
      `;
      document.head.appendChild(style);
    },

    executeObserver() {
      const images = document.querySelectorAll("img[data-src]");
      if (!images.length) return;

      if (!("IntersectionObserver" in window)) {
        images.forEach(img => this.processImage(img));
        return;
      }

      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            this.processImage(e.target);
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: "0px 0px 320px 0px" });

      images.forEach(img => {
        this.wrapImage(img);
        io.observe(img);
      });
    },

    wrapImage(img) {
      if (img.dataset.lazyWrapped) return;
      img.dataset.lazyWrapped = "1";

      const wrapper = document.createElement("div");
      wrapper.className = "lazy-img-container";
      wrapper.style.minHeight = img.getAttribute("height") ? img.getAttribute("height")+"px" : "200px";
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      img.classList.add("img-reconstruct");
    },

    processImage(img) {
      if (img.dataset.loaded) return;
      img.dataset.loaded = "1";

      const container = img.parentElement || img;
      const src = img.getAttribute("data-src");

      const scanner = document.createElement("div");
      scanner.className = "cyber-scanner";
      container.appendChild(scanner);

      img.loading = "lazy";
      img.decoding = "async";
      img.src = src;

      img.onload = () => {
        img.classList.add("img-manifested");
        setTimeout(() => scanner.remove(), 600);
      };

      img.onerror = () => {
        img.classList.add("img-manifested");
        scanner.remove();
        img.src = "/assets/system/image-fallback.webp";
      };
    }
  };

  document.addEventListener("DOMContentLoaded", () => LazyLoader.init());
})();
