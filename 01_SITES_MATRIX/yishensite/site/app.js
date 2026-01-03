(function(){
  // Active nav
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(href === current) a.classList.add('active');
  });

  // WhatsApp routing (primary + backup)
  window.YS = window.YS || {};
  YS.waPrimary = "8618857277313";
  YS.waBackup  = "8615968277867";

  window.openWA = function(message){
    const text = encodeURIComponent(message || "Hi YiShen Global, I need a fast quote (MOQ 500 / DDP supported).");
    const url1 = `https://wa.me/${YS.waPrimary}?text=${text}`;
    const url2 = `https://wa.me/${YS.waBackup}?text=${text}`;

    // Open primary
    window.open(url1, "_blank", "noopener");

    // also log backup
    console.log("WhatsApp backup:", url2);
  };
})();
