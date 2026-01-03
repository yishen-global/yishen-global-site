(function(){
 function s(){return window.__YISHEN_NET||{};}
 var links=document.querySelectorAll("a");
 for(var i=0;i<links.length;i++){
  (function(a){
   var h=a.getAttribute("href")||"";
   if(h.indexOf("wa.me")===0||h.indexOf("mailto:")===0||h.indexOf("tel:")===0||
      h.indexOf("linkedin.com")>-1||h.indexOf("x.com")>-1||
      h.indexOf("youtube.com")>-1||h.indexOf("facebook.com")>-1||h.indexOf("instagram.com")>-1){
    a.addEventListener("click",function(e){
     var net=s();
     var payload={href:h,country:net.country,ref:net.ref,page:net.page,ts:Date.now()};
     if(navigator.sendBeacon){navigator.sendBeacon("/api/lead",JSON.stringify(payload));}
     if(h.indexOf("wa.me")>-1){
      e.preventDefault();
      var msg=encodeURIComponent("CONFIRM from "+net.country+" | "+net.page+" | ref="+net.ref);
      location.href=h.split("?")[0]+"?text="+msg;
     }
    });
   }
  })(links[i]);
 }
})();
