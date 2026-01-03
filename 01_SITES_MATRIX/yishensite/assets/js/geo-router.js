<script>
fetch("https://ipapi.co/json/")
.then(r=>r.json())
.then(d=>{
  const c = d.country_code;
  const map = {
    US:"/hub/office-chair/deals.html",
    CA:"/hub/office-chair/deals.html",
    MX:"/hub/office-chair/deals.html",
    AE:"/hub/sofa/deals.html",
    SA:"/hub/sofa/deals.html",
    EU:"/hub/standing-desk/deals.html"
  };
  if(map[c]) window.location.href = map[c];
});
</script>
