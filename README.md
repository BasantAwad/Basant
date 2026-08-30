# Nocturne Botanica — Basant Awad Mohamed

A cinematic, single-page portfolio for Basant Awad Mohamed (Backend Software Engineer, Alexandria, Egypt). Built with React, TypeScript, and Vite, with a layered botanical SVG system that grows through the page as the visitor scrolls.

**Live preview:** `npm run preview` (serves `dist/` after `npm run build`).

---

## Stack

| Layer        | Choice                           |
|--------------|----------------------------------|
| Build        | Vite 8 + React 19 + TypeScript   |
| Animation    | framer-motion + custom rAF layer |
| Typography   | Cormorant Garamond (self-hosted) |
| Botanical art| Inline SVG (no canvas/WebGL)     |
| Images       | None (zero external image requests) |

Bundle (gzipped): ~76 KB JS, ~7 KB CSS.

---

## Getting started

```bash
npm install
npm run dev        # dev server with HMR
npm run build      # production build → dist/
npm run preview    # serves dist/ (used in QA)
```

Run the Playwright QA suite (requires `npm install playwright` and a Chromium install):

```bash
npx playwright install chromium
node tests/qa.mjs
```

---

## What's in the repo

```
src/
  index.css           # design system: palette, spacing, typography, fonts
  main.tsx            # entry point
  App.tsx             # root component (wires AppShell)
  components/
    AppShell.tsx      # section order + layout shell
    Navigation.tsx    # fixed nav + animated mobile menu
    HeroSection.tsx   # fuchsia hero flower + tagline + CTAs
    AboutSection.tsx  # editorial philosophy + field-journal cards
    ExperienceSection.tsx   # timeline: Bibliotheca → ITI → AIU → Bianki → ICPC
    ProjectArchive.tsx      # 6 specimen-style project cards
    CapabilityMap.tsx       # botanical clusters (languages/backend/data/infra/ML)
    EducationSection.tsx    # degree + teaching + certifications
    GitHubLaboratory.tsx    # laboratory intro + complete repo index
    ContactSection.tsx      # email/phone/LinkedIn/GitHub/Instagram + final bloom
    Footer.tsx             # specimen number + copyright
    BotanicalScene.tsx      # layered SVG, scroll-driven growth
    DustCanvas.tsx          # subtle spore particles (rAF, respects reduced-motion)
  hooks/
    useScrollProgress.ts    # reversible progress model, reduced-motion aware
  data/
    personal.ts       # name, title, contact, socials, nav, intro copy
    experience.ts     # work/education timeline entries
    projects.ts       # project catalog
    capabilities.ts   # skills grouped into clusters
    education.ts      # degree, teaching, certifications
    github.ts         # curated repo list
public/
  favicon.svg         # botanical favicon
  og-image.png        # Open Graph card (botanical, generated)
tests/
  qa.mjs              # Playwright QA (desktop + 375px mobile + reduced-motion)
```

---

## Sections (in viewport order)

1. **Home** — Hero with the fuchsia flower, tagline, availability, location, two CTAs.
2. **About** — Editorial philosophy, what kind of backend work Basant does, engineering interests.
3. **Experience** — Timeline from Bibliotheca Alexandrina through ITI, AIU, Bianki Modern School, and AIU ICPC.
4. **Projects** — Six specimen cards: ColdBridge, Nexus FS, AIOps, NovaCare, FitCoach Pro, Finance Data Pipeline.
5. **Capabilities** — Botanical clusters covering languages, backend, data, infrastructure, ML/AI, tools, and practices.
6. **Education** — Al Alamein International University (Software Engineering), teaching experience, six certifications.
7. **GitHub** — Laboratory intro plus a complete index of curated repos.
8. **Contact** — Email, phone, LinkedIn, GitHub, Instagram, and a final botanical bloom.

---

## Verified personal information (source of truth)

These values are used verbatim — no invented facts, no exaggerated titles.

| Field       | Value                                              |
|-------------|----------------------------------------------------|
| Name        | Basant Awad Mohamed                                |
| Title       | Backend Software Engineer                          |
| Location    | Alexandria, Egypt                                  |
| Availability| Open to relocation                                 |
| Email       | basantawad014@gmail.com                            |
| Phone       | +20 109 385 1893                                  |
| LinkedIn    | https://www.linkedin.com/in/basantabdalla/         |
| GitHub      | https://github.com/BasantAwad                      |
| Instagram   | https://www.instagram.com/be0com/                  |

---

## Visual concept

**Nocturne Botanica / A Garden in Progress** — a mysterious midnight greenhouse where a single anatomically realistic fuchsia flower emerges from darkness and grows through scroll. Botanical layers map to content: roots → principles, stem → experience, leaves → capabilities, blooms → completed projects. The growth is reversible and respects `prefers-reduced-motion`.

---

## Design decisions

- **Inline SVG only.** The botanical scene is pure SVG, not canvas or WebGL — legible, accessible, scales to mobile, no external image requests.
- **Data-driven content.** Every section reads from typed data modules (`src/data/*.ts`), so placeholders are visible and content can be edited in one place.
- **No invented facts.** Career timeline, projects, education, and certifications come from the provided brief. Project cards use placeholder `<div>`s for images (with alt text), not fake screenshots.
- **Reduced motion.** The scroll engine freezes at the final state when `prefers-reduced-motion: reduce` is set; the dust canvas skips animation entirely.
- **Mobile first.** Navigation collapses to an animated menu; sections reflow; no horizontal overflow at 375px.

---

## QA checklist (automated)

The Playwright suite (`tests/qa.mjs`) checks:

- Page title and hero content (name, title, tagline, availability, location)
- Primary and ghost CTAs
- All six nav links
- Each section's required content
- Contact link hrefs (mailto, LinkedIn, GitHub)
- Zero console errors
- Mobile menu button visible at 375px
- No horizontal overflow at 375px
- Reduced-motion mode still renders the page

---

## Deployment

Built for GitHub Pages at `https://basantawad.github.io/Basant/`. The `main` branch is the source of truth; a deployment workflow or manual `npm run build && gh-pages -d dist` can publish `dist/`.

---

## License

Personal portfolio — content and code belong to Basant Awad Mohamed.
