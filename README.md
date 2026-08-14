# Portfolio — PJ Phongsin

Personal portfolio site for PJ Phongsin, a software developer and AI/ML engineer
based in Melbourne. Single-page site plus a detail route per project, covering
ten projects including three peer-reviewed publications.

## Stack

- **React 19** + **TypeScript**, built with **Vite**
- **React Router** — home route plus a dynamic `/projects/:id` detail route
- **GSAP** (ScrollTrigger) for scroll-driven animation
- **Lenis** for smooth scrolling, driven from GSAP's ticker so the two stay in sync
- **Framer Motion** for the magnetic buttons and the carousel's drag handling
- CSS Modules with custom properties for theming — no CSS framework

## Running it

```bash
npm install
npm run dev      # dev server on :5173
npm run build    # typecheck + production build to dist/
npm run lint     # oxlint
npm run preview  # serve the production build locally
```

## How it's put together

- `src/data/` — all content lives here. Projects, experience, education and
  skills are data, not markup, so the pages are generated from a single source.
- `src/components/` — presentational components plus the animation primitives
  (`Reveal`, `MaskedText`, `ScreenCarousel`, `PointerGlow`).
- `src/lib/` — the scroll and animation hooks (`useLenis`, `useSlideIn`,
  `useScrollScale`) and the shared GSAP instance.
- `src/theme/` — light/dark theming. Dark is the default at `:root`; light lives
  under `[data-theme="light"]`, with a pre-paint script in `index.html` so the
  first paint never flashes the wrong mode.

Every animation respects `prefers-reduced-motion`, and colour choices were
checked against WCAG contrast ratios rather than picked by eye.

## Links

- [LinkedIn](https://www.linkedin.com/in/pj-phongsin)
- [GitHub](https://github.com/pj-phongsin)
