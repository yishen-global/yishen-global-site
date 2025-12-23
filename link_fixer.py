import os
import re

# =========================================================
# YISHEN GLOBAL - LINK_FIXER_V5.0.FINAL_POWER_PATCHED
# 目标：只修电源层，不动任何业务内容
# =========================================================

class LinkFixer:
    def __init__(self):
        self.target_files = [
            'index.html', 'genesis.html', 'architectures.html', 
            'clusters.html', 'resources.html', 'tactical-briefing.html',
            'site-architecture.html', 'operational-systems.html'
        ]
        self.patch_count = 0

    def boot(self):
        print(">>> [POWER_PATCH]: LINK_SYSTEM_POWER_ON...")
        for filename in self.target_files:
            if os.path.isfile(filename):
                self.repair_file(filename)
            else:
                print(f"! [WARNING]: {filename} not found.")
        print(f">>> [OK]: {self.patch_count} power patches injected.")

    def repair_file(self, filename):
        with open(filename,'r',encoding='utf-8') as f:
            content = f.read()

        # ⚡ PATCH_01：只改内部 html，不碰 http/https CDN
        content = re.sub(
            r'href="(?!https?:\/\/)([^"]+\.html)"',
            lambda m: f'href="{m.group(1).lower()}"',
            content
        )

        # ⚡ PATCH_02：只在函数已存在时加 preventDefault
        for fn in ['verifyCert','runAgent','previewResource']:
            content = re.sub(
                rf'onclick="{fn}\(',
                f'onclick="event.preventDefault();{fn}(',
                content
            )

        # ⚡ PATCH_03：资产路径通电（不改任何业务结构）
        content = content.replace('src="icons/', 'src="assets/icons/')
        content = content.replace('src="products/', 'src="assets/products/')
        content = content.replace('href="icons/', 'href="assets/icons/')
        content = content.replace('href="products/', 'href="assets/products/')

        # ⚡ PATCH_04：旧 SKU 页安全转向
        content = content.replace('sku-detail.html', 'technical-passport.html')

        # ⚡ PATCH_05：iOS / Safari 触摸通电（只插一次）
        if '</body>' in content and 'LINK_FIXER_MOBILE_PATCH' not in content:
            content = content.replace('</body>', '''
<script id="LINK_FIXER_MOBILE_PATCH">
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('touchstart',()=>{}, {passive:true});
});
</script>
</body>''')

        with open(filename,'w',encoding='utf-8') as f:
            f.write(content)

        self.patch_count += 1
        print(f"✓ POWER_PATCHED: {filename}")

if __name__ == "__main__":
    LinkFixer().boot()
