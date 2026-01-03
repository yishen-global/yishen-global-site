(function(){
 var p=new URLSearchParams(location.search);
 window.__YISHEN_NET={
  country:p.get("country")||"GLOBAL",
  ref:(document.referrer?document.referrer:"DIRECT"),
  page:location.pathname,
  ts:Date.now()
 };
})();
