<script>
(function(){
  const lang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  const map = {
    "es": "/lang/es/",
    "es-": "/lang/es/",
    "fr": "/lang/fr/",
    "fr-": "/lang/fr/",
    "ar": "/lang/ar/",
    "ar-": "/lang/ar/"
  };
  const hit = Object.keys(map).find(k => lang.startsWith(k));
  if(hit){
    // 不强制跳转，给用户选择权（合规友好）
    if(!localStorage.getItem("langChosen")){
      const banner = document.createElement("div");
      banner.style.cssText="position:fixed;bottom:0;left:0;right:0;background:#111;color:#fff;padding:12px;text-align:center;z-index:9999";
      banner.innerHTML = `We detected your language. <a style="color:#0ea5e9" href="${map[hit]}" onclick="localStorage.setItem('langChosen','1')">Switch to your language</a> · <a style="color:#aaa" href="#" onclick="localStorage.setItem('langChosen','1');this.parentNode.remove()">Stay</a>`;
      document.body.appendChild(banner);
    }
  }
})();
</script>
