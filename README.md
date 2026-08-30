# Nocturne Botanica — Basant Awad Mohamed

A cinematic, single-page portfolio for a backend software engineer, built with React, TypeScript, and Vite. The experience combines a midnight botanical visual system with scroll-driven SVG growth, responsive layout, and accessible motion behavior.

## Highlights

- Layered inline SVG botanical scene that grows and reverses with scroll progress.
- Framer Motion and custom `requestAnimationFrame` behavior for choreographed transitions and subtle particle motion.
- Mobile-first navigation and layout with no horizontal overflow at narrow widths.
- `prefers-reduced-motion` support that keeps the content and final visual state usable without animation.
- Data-driven sections for experience, projects, capabilities, education, and GitHub repositories.

## Stack

| Layer | Technology |
| --- | --- |
| Application | React 19, TypeScript, Vite |
| Motion | Framer Motion, custom `requestAnimationFrame`, CSS transitions |
| Visual system | Inline SVG, layered botanical illustration, self-hosted typography |
| Quality | Playwright checks for desktop, mobile, reduced motion, links, and console errors |

## Run locally

```bash
npm install
npm run dev
npm run build
npm run preview
```

Run the browser checks with `node tests/qa.mjs` after installing the required Playwright browser.

## Structure

The `src/data` modules hold editable content; `src/components` contains the page sections and visual scene; `src/hooks/useScrollProgress.ts` owns scroll progress; and `tests/qa.mjs` covers the main interaction and accessibility expectations.

## Deployment

The project is prepared for GitHub Pages at [basantawad.github.io/Basant](https://basantawad.github.io/Basant/).
