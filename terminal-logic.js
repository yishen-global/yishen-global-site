/**
 * =========================================================
 * YISHEN GLOBAL — TERMINAL ENGINE (PATCHED LEGACY FULL)
 * ---------------------------------------------------------
 * Status: DEPRECATED / SAFE PATCHED
 * Role: Backward-compatible terminal engine
 *
 * NOTICE:
 * - This file is patched for SAFE POWER-ON
 * - It will be REMOVED after migration
 * - Canonical version:
 *   assets/js/terminal-engine.v5.safe.js
 * =========================================================
 */

console.warn(
  "[YISHEN] Legacy terminal-engine.js loaded. " +
  "Please migrate to assets/js/terminal-engine.v5.safe.js"
);

/* ==========================================
   1. STATIC INTELLIGENCE DATABASE (SAFE)
   ========================================== */

const ASSET_CERT_MAP = {
    bifma: { url: "assets/docs/bifma-test-report.pdf", title: "BIFMA_STRUCTURAL_PROTOCOL_V5", sector: "OFFICE" },
    ul: { url: "assets/docs/ul-safety-cert.pdf", title: "UL_FIRE_SAFETY_VALIDATED", sector: "SAFETY" },
    ista: { url: "assets/docs/ista-6a-report.pdf", title: "ISTA_TRANSPORT_SURVIVABILITY", sector: "LOGISTICS" },
    en131: { url: "assets/docs/en131-ladder-cert.pdf", title: "EN131_LADDER_SAFETY_STANDARD", sector: "INFRA" },
    iso13485: { url: "assets/docs/iso13485-medical.pdf", title: "ISO_13485_MEDICAL_PRECISION", sector: "MEDICAL" },
    form_e: { url: "assets/docs/form-e-asean.pdf", title: "ASEAN_FORM_E_DUTY_EXEMPTION", sector: "GLOBAL_TRADE" }
};

const GLOBAL_HS_DB = [
    { code: "9402.1000", desc: "Medical Precision Seating - ISO 13485 Certified", market: "ASEAN/GLOBAL" },
    { code: "7315.8200", desc: "Marine Chains (G80/G100) - Brazil AD Exemption Ready", market: "LATAM" },
    { code: "7616.9910", desc: "Aluminum Ladders - US AD/CVD Offset Protocol", market: "NORTH_AMERICA" },
    { code: "9401.3100", desc: "Ergo Seating - BIFMA X5.1 Kinetic Matrix", market: "GLOBAL" },
    { code: "9403.1000", desc: "Dual-Motor Lifting Systems - UL 962 Logic", market: "EUROPE/NA" },
    { code: "4418.7500", desc: "Carbon-Negative Bamboo - CBAM Hedge Ready", market: "EUROPE" }
];

/* ==========================================
   2. TERMINAL CORE (PATCHED SAFE)
   ========================================== */

class SovereignTerminal {
    constructor() {
        // DOM handles (SAFE)
        this.barFill = document.getElementById('bar-fill');
        this.loadingScreen = document.getElementById('loading-screen');
        this.hsInput = document.getElementById('hs-input');
        this.hsResults = document.getElementById('hs-results');
        this.taskInput = document.getElementById('user-task');
        this.agentOutput = document.getElementById('agent-output');

        this.isProcessing = false;
        this.init();
    }

    init() {
        // Boot sequence
        window.addEventListener('load', () => this.executeBootSequence());

        // HS search
        if (this.hsInput && this.hsResults) {
            this.hsInput.addEventListener('input', e =>
                this.searchHSCode(e.target.value)
            );
        }

        // Command execution
        if (this.taskInput && this.agentOutput) {
            this.taskInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') this.executeTask();
            });
        }

        this.initGlowEngine();
        this.applyFractureDefense();
    }

    executeBootSequence() {
        if (this.barFill) this.barFill.style.width = '100%';

        if (this.loadingScreen) {
            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    console.log(
                        "%c> YISHEN_TERMINAL_LEGACY_PATCH_READY",
                        "background:#0ea5e3;color:#000;font-weight:bold;"
                    );
                }, 700);
            }, 2000);
        }
    }

    searchHSCode(query) {
        if (!this.hsResults || !Array.isArray(GLOBAL_HS_DB)) return;
        if (!query) {
            this.hsResults.innerHTML = '';
            return;
        }

        const q = query.toLowerCase();
        const filtered = GLOBAL_HS_DB.filter(i =>
            i.code.includes(q) || i.desc.toLowerCase().includes(q)
        );

        this.hsResults.innerHTML = filtered.length
            ? filtered.map(i => `
                <div class="p-3 bg-white/5 border-b border-white/5 flex justify-between items-center hover:bg-[#0ea5e3]/10 transition-all cursor-pointer"
                     onclick="window.location.href='technical-passport.html?id=${encodeURIComponent(i.code)}'">
                    <div class="flex flex-col">
                        <span class="text-[#0ea5e3] font-mono text-xs font-bold">${i.code}</span>
                        <span class="text-[9px] text-gray-400 uppercase mt-1">${i.desc}</span>
                    </div>
                    <span class="text-[8px] font-mono text-gray-500 bg-white/5 px-2 py-1">${i.market}</span>
                </div>
            `).join('')
            : `<div class="p-4 text-[10px] font-mono text-gray-600 italic">// NO_MATCH_IN_DATABASE</div>`;
    }

    async executeTask() {
        if (!this.taskInput || !this.agentOutput) return;
        if (!this.taskInput.value || this.isProcessing) return;

        this.isProcessing = true;
        const cmd = this.taskInput.value.toUpperCase();

        this.agentOutput.innerHTML =
            `<span class="text-[#0ea5e3] animate-pulse">> EXECUTING: ${cmd}</span>`;

        await this.delay(600);
        this.print("> SCANNING_GLOBAL_NODES...");
        await this.delay(800);
        this.print("> CROSSCHECKING_TRADE_PROTOCOLS...");
        await this.delay(1000);

        this.agentOutput.innerHTML = `
            <div class="mt-4 p-3 border-l-2 border-[#ffd700] bg-[#ffd700]/5">
                <div class="text-[#ffd700] font-bold text-[10px]">MISSION_COMPLETE</div>
                <div class="text-gray-400 text-[9px] font-mono leading-relaxed">
                    COMMAND: ${cmd}<br>
                    STATUS: STABLE<br>
                    RESULT: FRICTION_NEUTRALIZED
                </div>
            </div>
        `;

        this.taskInput.value = "";
        this.isProcessing = false;
    }

    previewResource(key) {
        const asset = ASSET_CERT_MAP[key];
        const modal = document.getElementById('asset-modal');
        const iframe = document.getElementById('preview-frame');
        const title = document.getElementById('preview-title');

        if (!asset || !modal || !iframe || !title) return;

        iframe.src = asset.url;
        title.innerText = `// TECHNICAL_PASSPORT: ${asset.title}`;
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    applyFractureDefense() {
        document.querySelectorAll("img").forEach(img => {
            img.addEventListener("error", () => {
                img.src = 'assets/products/placeholder-node.webp';
                img.style.opacity = "0.5";
                img.classList.add('grayscale');
            });
        });
    }

    initGlowEngine() {
        const glow = document.getElementById('cursor-glow');
        if (!glow || !window.matchMedia('(hover: hover)').matches) return;

        document.addEventListener('mousemove', e => {
            requestAnimationFrame(() => {
                glow.style.left = `${e.clientX}px`;
                glow.style.top = `${e.clientY}px`;
            });
        });
    }

    print(msg) {
        if (!this.agentOutput) return;
        const div = document.createElement('div');
        div.className = 'mt-1 opacity-60 font-mono text-[9px] text-white';
        div.innerText = msg;
        this.agentOutput.appendChild(div);
        this.agentOutput.scrollTop = this.agentOutput.scrollHeight;
    }

    delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
}

/* ==========================================
   3. SAFE INSTANTIATION
   ========================================== */

const TerminalEngine = new SovereignTerminal();

window.previewResource = key => TerminalEngine.previewResource(key);
window.runAgent = () => TerminalEngine.executeTask();
window.closePreview = () => {
    const modal = document.getElementById('asset-modal');
    const iframe = document.getElementById('preview-frame');
    if (!modal || !iframe) return;
    modal.style.display = 'none';
    modal.classList.add('hidden');
    iframe.src = '';
    document.body.style.overflow = 'auto';
};
