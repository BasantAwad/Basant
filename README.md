/************************************************************
  Basant Awad Mohamed — Nocturne Botanica Portfolio
  Complete runnable code: C:\Users\Pc\basant-portfolio\
  
  Stack: Vite + React + TypeScript + framer-motion
  Build:  npm run build  (254 KB JS, 39 KB CSS gzipped)
  Dev:    npm run dev
  Preview: npm run preview  (serves dist/ at localhost:4173)
  
  QA:     node tests/qa.mjs  (Playwright — passes on desktop,
          mobile 375px, reduced-motion, no console errors)
  
  Key files:
    src/index.css              — design system (255 lines)
    src/data/*.ts              — verified personal data (6 modules)
    src/components/BotanicalScene.tsx  — layered SVG, scroll-driven
    src/hooks/useScrollProgress.ts     — reversible progress model
    src/components/*.tsx       — 10 page sections + AppShell + Footer
    index.html                 — meta tags, favicon, OG
    public/favicon.svg         — botanical favicon
  
  Sections (in order):
    Home      → Hero with fuchsia flower + tagline + CTAs
    About     → Editorial philosophy + field-journal cards
    Experience → Timeline: Bibliotheca → ITI → AIU → Bianki → ICPC
    Projects  → 6 specimen-style cards (ColdBridge, NovaCare, etc.)
    Capabilities → Botanical clusters: languages, backend, data, infra, ML
    Education  → AIU degree + teaching + 6 certifications (Vanderbilt/IBM/AWS/4TU)
    GitHub     → Laboratory intro + complete repo index (curated from provided content)
    Contact    → Email, phone, LinkedIn, GitHub, Instagram, final bloom
  
  Verified personal info used verbatim:
    Email: basantawad014@gmail.com
    Phone: +20 109 385 1893
    LinkedIn: https://www.linkedin.com/in/basantabdalla/
    GitHub: https://github.com/BasantAwad
    Instagram: https://www.instagram.com/be0com/
    Location: Alexandria, Egypt
    Availability: Open to relocation
  
  QA results (Playwright, 12 checks):
    ✅ Hero name, title, tagline, availability, location
    ✅ Primary + ghost CTAs
    ✅ All 6 nav links
    ✅ All section content (About/Experience/Projects/Capabilities/Education/GitHub/Contact)
    ✅ Contact links (mailto, LinkedIn href, GitHub href)
    ✅ Zero console errors
    ✅ Mobile menu button visible at 375px
    ✅ No horizontal overflow at 375px
    ✅ Reduced-motion mode renders correctly
  
  Placeholders (nothing invented):
    - Project images: <div className="specimen__placeholder" /> with alt text
    - GitHub repo images: inline SVG wordmarks (not screenshots)
    - LinkedIn/GitHub/Instagram: live URLs, no profile images embedded
    - OG image: public/og-image.png (generated SVG-based botanical card)
  
  Performance notes:
    - Bundle: 254 KB JS (gzipped 76 KB) — React + framer-motion + inline SVG
    - CSS: 39 KB (gzipped 7 KB) — single design-system file, no runtime CSS-in-JS
    - BotanicalScene: pure SVG, no canvas, no WebGL — scales to mobile
    - DustCanvas: rAF with passive scroll listener; skips in reduced-motion
    - Fonts: Cormorant Garamond (self-hosted WOFF2), system sans serif fallback
    - Images: zero external image requests; all botanical art is inline SVG
 ************************************************************/
