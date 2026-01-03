<script>
fetch("https://ipapi.co/json/")
.then(r=>r.json())
.then(d=>{
  const currency = d.currency;
  document.querySelectorAll(".price").forEach(el=>{
    el.innerText = currency + " " + el.dataset.base;
  });
});
</script>
