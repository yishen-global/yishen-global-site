# YiShen Global V5.0  
## System Architecture & Technical Sovereignty  
**Audience:** CTO / Technical Due Diligence  
**Status:** Production-Grade Architecture

---

## 1. Design Objective

This system is not designed for content publishing.

It is designed to:
- eliminate cross-border uncertainty
- survive regulatory volatility
- scale without rewriting architecture
- keep evidence verifiable at every layer

---

## 2. Architectural Philosophy

Key principle:

> Determinism beats optimization.

The system prioritizes:
- predictable behavior
- explainable routing
- auditability over abstraction

---

## 3. Frontend Strategy

- Static-first (HTML + Tailwind CDN)
- Zero build dependency for core pages
- GPU-accelerated micro-interactions
- Latency-tolerant rendering

Reason:
Frontend must remain stable under:
- weak networks
- cross-border latency
- restrictive IT environments (procurement offices)

---

## 4. Backend API Layer (/api)

API responsibilities are strictly limited to:
- HS intelligence
- Agent task execution
- Secure form intake

No business logic is duplicated on frontend.

---

## 5. Evidence & Passport Engine

`technical-passport.html` acts as:
- a dynamic evidence renderer
- parameter-driven proof engine

This replaces static PDFs with contextual proof delivery.

---

## 6. Security & Governance

- No client-side secrets
- Evidence paths are immutable
- All critical logic server-side

---

## 7. Scalability Path

System scales by:
- adding clusters
- adding HS mappings
- adding evidence nodes

Not by rewriting pages.

---

## CTO Conclusion

This architecture is built to be:
- boring to maintain
- hard to break
- expensive to imitate
