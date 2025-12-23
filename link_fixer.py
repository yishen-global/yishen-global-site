import os, re

# =========================================================
# YISHEN GLOBAL — LINK_FIXER V5.0_PATCHED_PRODUCTION_SAFE
# Mission: 全站链接主权校准 + iOS / Vercel 兼容修复
# =========================================================

TARGET_FILES = [
    'index.html',
    'genesis.html',
    'site-architecture.html',
    'clusters.html',
    'resources.html',
    'tactical-briefing.html',
    'operational-systems.html'
]

class LinkFixer:

    def __init__(self):
        self.patch_count = 0

    def boot(self):
        print(">>> LINK_FIXER: STARTING PRODUCTION SAFE PATCH...")
        for f in TARGET_FILES:
            if os.path.isfile(f):
                self.patch_file(f)
            else:
                print(f"! Missing: {f}")
        print(f">>> DONE: {self.patch_count} files patched.")

    def patch_file(self, filename):
        with open(filename,'r',encoding='utf-8') as f:
            html = f.read()

        # PATCH 1: only lowercase internal html href, ignore http(s)
        html = re.sub(
            r'href="(?!https?:\/\/)([^"]+\.html)"',
            lambda m: f'href="{m.group(1).lower()}"',
            html
        )

        # PATCH 2: Safe preventDefault injection (only when function exists)
        for fn in ['verifyCert','runAgent','previewResource']:
            html = re.sub(
                rf'onclick="{fn}\(',
                f'onclick="event.preventDefault();{fn}(',
                html
            )

        # PATCH 3: Asset path normalization
        html = html.replace('src="icons/', 'src="assets/icons/')
        html = html.replace('src="products/', 'src="assets/products/')
        html = html.replace('href="icons/', 'href="assets/icons/')
        html = html.replace('href="products/', 'href="assets/products/')

        # PATCH 4: Legacy SKU pages → technical-passport
        html = html.replace('sku-detail.html', 'technical-passport.html')

        # PATCH 5: iOS passive touch compatibility
        if '</body>' in html and 'LINK_FIXER_MOBILE_PATCH' not in html:
            html = html.replace('</body>', '''
<script id="LINK_FIXER_MOBILE_PATCH">
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('touchstart',()=>{}, {passive:true});
});
</script>
</body>''')

        with open(filename,'w',encoding='utf-8') as f:
            f.write(html)

        self.patch_count += 1
        print(f"✓ Patched: {filename}")

if __name__ == "__main__":
    LinkFixer().boot()
