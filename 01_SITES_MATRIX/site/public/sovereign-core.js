(function(){
  const sid = "YS-" + Date.now() + "-" + Math.floor(Math.random()*9999);
  localStorage.setItem("YS_SOVEREIGN_ID", sid);
  console.log("SOVEREIGN ACTIVE:", sid);
})();
