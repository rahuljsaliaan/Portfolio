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
├── hooks/           # useEnv, useMagnetic, useParallax, useActiveSection, useCountUp, useSceneActive
├── components/
│   ├── layout/      # Navbar, ScrollProgress, Section, Footer, SkipLink
│   ├── ui/          # Button, Card, Tag, GlowText, Reveal, Modal, SkillBar, RichText
│   ├── icons/       # inline SVG brand marks + lookup map
│   ├── cursor/      # CustomCursor
│   ├── decor/       # ParallaxBlobs
│   ├── three/       # HeroScene, AbyssParticles, AchievementScene, SceneFallback, SceneBoundary
│   └── sections/    # Hero, About, Skills, Experience, Projects (+Modal/Detail), Achievements, Contact
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

- `AbyssParticles` — one `THREE.Points`, one `BufferGeometry`, one draw call. Drift + cursor parallax
  run in the **vertex shader** (a `uMouse` uniform damped from R3F's `state.pointer` in `useFrame`) —
  no per-frame React renders.
- `useSceneActive` flips each `<Canvas frameloop>` between `always` and `never` so rendering pauses
  when the scene is off-screen or the tab is hidden. DPR is capped (`[1, 1.75]`) with drei's
  `PerformanceMonitor` + `AdaptiveDpr`.

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
