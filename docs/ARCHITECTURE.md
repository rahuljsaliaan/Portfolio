# Architecture

## Principles

- **Data / presentation split.** All content is in `src/data/*.ts` (typed via `types.ts`). Components
  are pure presentation and never hardcode copy.
- **Reusable motion.** Animation logic lives in custom hooks (`src/hooks`) and a few `ui` primitives,
  so effects are consistent and each respects reduced-motion in one place.
- **Graceful degradation.** Every effect has a defined fallback for reduced-motion, touch, and
  no-WebGL.

## Folder structure

```
src/
├── data/            # content + types (the single source of truth)
├── lib/             # constants (motion/particle/z tuning) + utils (cn, lerp, damp, scroll)
├── providers/       # EnvProvider (reduced-motion/touch/visibility) + MotionConfigProvider
├── hooks/           # useEnv, useMagnetic, useParallax, useActiveSection, useCountUp, useSceneActive, useWakatime
├── components/
│   ├── layout/      # Navbar, ScrollProgress, Section, Footer, SkipLink
│   ├── ui/          # Button, Card, Tag, GlowText, Reveal, Modal, SkillBar, RichText
│   ├── icons/       # inline SVG brand marks + lookup map
│   ├── cursor/      # CustomCursor
│   ├── decor/       # Atmosphere (depth gradient + caustics), ParallaxBlobs
│   ├── three/       # HeroScene, KnowledgeGraph, AchievementScene, SceneFallback, SceneBoundary
│   └── sections/    # Hero, About, Skills (+LiveLanguages), Experience, Projects (+Modal/Detail), Achievements, Contact
├── App.tsx          # providers + layout + section order
├── main.tsx         # root render + font imports
└── index.css        # Tailwind v4 @theme tokens, fonts, base, reduced-motion, neon utilities
```

## Providers

- **`EnvProvider`** computes `{ reducedMotion, isTouch, pageVisible }` once (one `matchMedia` +
  `visibilitychange` listener) and shares them via `useEnv()`. Components never call `matchMedia`
  themselves.
- **`MotionConfigProvider`** wraps the app in framer-motion's `LazyMotion` (features: `domMax`, so the
  nav's `layoutId` underline works) with `reducedMotion="user"`. Because of `strict`, components use
  the lighter `m.*` primitives — never `motion.*`.

## Three.js

Both scenes are **`React.lazy` + Suspense** and sit behind a **`SceneBoundary`** (a class error
boundary — `lazy`/Suspense only catch loading, not runtime/WebGL-context failures → falls back to
`SceneFallback`). They are skipped entirely under reduced-motion, so three.js never even loads for
those users.

- `KnowledgeGraph` (hero) — glowing nodes (a soft additive point shader with a depth fade) + edges
  that follow the nodes' buoyant float, plus bidirectional "signal" packets (the two-currents nod),
  a faint starfield, and rising bubbles. Two nested groups: continuous slow spin inside a
  cursor-tilt group (damped from `state.pointer`). Glow is faked with additive blending — **no
  postprocessing** — so the transparent canvas keeps showing the atmosphere behind it. A radial CSS
  mask on the canvas fades the graph into the abyss at the edges (no hard cut). Tune via `GRAPH` in
  `lib/constants.ts`.
- `AchievementScene` — a fresnel-glow icosahedron (custom `ShaderMaterial`).
- `useSceneActive` flips each `<Canvas frameloop>` between `always` and `never` so rendering pauses
  when the scene is off-screen or the tab is hidden. DPR is capped (`[1, 1.75]`) with drei's
  `PerformanceMonitor` + `AdaptiveDpr`.

## Live data (WakaTime)

`useWakatime` fetches a **public** WakaTime embed-JSON URL (configured in `src/data/wakatime.ts`)
client-side and renders it as liquid "tanks" in `LiveLanguages`. No API key is used (a static site
can't hold one safely), so it relies on a public share URL; it falls back to a curated language list
when the URL is empty or the fetch is blocked (e.g. CORS). See docs/CONTENT-GUIDE.md.

## Performance

- three/R3F/drei are isolated into a `three-vendor` chunk (Vite `manualChunks`) that only loads with
  the lazy scenes — initial JS stays ~65 kB gzip. The project-detail modal body is also code-split.
- LCP is the hero heading (plain DOM), not the canvas; the canvas container reserves height (the hero
  is `min-h-dvh`) so mounting the scene causes no layout shift.
- Fonts are self-hosted variable fonts, subset by `unicode-range` (only Latin downloads for English)
  with metric-override fallback faces for near-zero CLS.

## Build & deploy

`npm run build` runs `tsc -b` then `vite build` → static `dist/`. Deploy to any static host
(Vercel/Netlify: build `npm run build`, output `dist`). No environment variables or server needed.
