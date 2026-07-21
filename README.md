# Rahul J — Portfolio

A single-page personal portfolio with an "Abyssal Neon" identity (Material Ocean deep-blue base +
bioluminescent neon), built to read as a senior AI-systems engineer. Heavy, purposeful motion
(a Three.js knowledge-graph hero drifting in deep water, custom cursor, scroll choreography) that
degrades gracefully and stays fast.

## Stack

- **React 18.3** + **Vite 6** + **TypeScript 5**
- **Tailwind CSS v4** (CSS-first `@theme`, via `@tailwindcss/vite`) + CSS-variable design tokens
- **framer-motion 11** — reveals, magnetic hovers, modal transitions, scroll progress
- **@react-three/fiber 8 + drei 9 + three 0.169** — the two Three.js scenes
- **lucide-react** (functional icons) + inline SVG brand marks
- Self-hosted variable fonts via **@fontsource-variable** (Space Grotesk / Inter / JetBrains Mono)
- No backend, no CMS — all content lives in typed `src/data/*.ts`. Deploys as a static site.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check (tsc -b) + production build to dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run typecheck  # tsc -b (no emit)
npm run format     # prettier
```

## Where the content lives

**All copy, skills, timeline, projects, stats, and links are in `src/data/`.** You can update the
whole site without touching a component. Dummy values are flagged with `// TODO: replace with real
value`. See **[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)** for a field-by-field guide.

Page-level SEO/meta (title, description, Open Graph) lives in `index.html`.

## Docs

- **[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)** — edit content & swap the dummy values (start here)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — folder structure, data flow, 3D & performance strategy
- **[docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)** — colors, type, surfaces, neon usage
- **[docs/ANIMATIONS.md](docs/ANIMATIONS.md)** — effect inventory, reduced-motion behavior, tuning

## Deploy

Static build — works on Vercel or Netlify with zero config:

- Build command: `npm run build`
- Output directory: `dist`

Before going live, replace the `og:url` and add a real `public/og-image.png` (see index.html TODOs),
and work through the `// TODO` markers in `src/data/`.

## Accessibility & performance

- Respects `prefers-reduced-motion` globally (static hero, native cursor, instant reveals).
- Full keyboard support; project modals trap focus, close on Esc, and restore focus to the trigger.
- Semantic landmarks + skip link; responsive down to 360px.
- three.js is lazy-loaded in its own chunk; initial JS is ~65 kB gzip. Run Lighthouse on the
  production preview (`npm run build && npm run preview`) to verify.

## License

See [LICENSE](LICENSE).
