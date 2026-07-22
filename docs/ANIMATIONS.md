# Animations

Motion is tuned centrally in `src/lib/constants.ts` (durations, easings, particle counts, magnetic
radius, cursor springs, z-index scale). Adjust the "feel" there without touching components.

## Inventory

| Effect | Where | Reduced-motion behavior |
|---|---|---|
| Hero knowledge graph (drift, spin, cursor-tilt, signals, bubbles) | `three/HeroScene` + `KnowledgeGraph` | Not mounted; hero shows its static gradient |
| Fresnel icosahedron | `three/AchievementScene` | Not mounted; `SceneFallback` orb shows |
| Persistent liquid ocean (currents, cursor wake, scroll-descent) | `decor/OceanBackground` + `three/OceanScene` | Not mounted; static gradient shows |
| Recently-coding hours (count-up) | `sections/LiveLanguages` | Final hours shown instantly |
| Custom cursor (dot + trailing ring) | `cursor/CustomCursor` | Disabled (native cursor); also off on touch |
| Magnetic hovers | `hooks/useMagnetic` (Button, nav links, socials) | Disabled (no pull) |
| Section reveals (drift + fade, stagger) | `ui/Reveal` (`Reveal`/`Stagger`/`StaggerItem`) | Renders final state instantly |
| Clip-reveal headings | `layout/Section` | Static heading |
| Timeline alternating slide-in | `sections/Experience` | Static |
| Parallax depth (background blobs) | `decor/ParallaxBlobs` + `hooks/useParallax` | No drift |
| Scroll-progress bar | `layout/ScrollProgress` | Still tracks scroll (position, not autonomous) |
| Count-up stats | `hooks/useCountUp` | Shows final value instantly |
| Animated gradient name | `ui/GlowText` | Static gradient |
| Pulsing primary CTA | `animate-cta-pulse` utility | Static glow (base shadow remains) |
| Modal scale + fade | `ui/Modal` | Fade only (no scale/translate) |
| Nav active underline | `layout/Navbar` (`layoutId`) | Jumps instead of sliding |

## How reduced-motion is enforced

Three layers, because no single one covers everything:

1. **`MotionConfig reducedMotion="user"`** disables framer transform/layout animations — but **not**
   opacity. So components that must appear instantly gate on `useEnv().reducedMotion` and render the
   final state directly (`Reveal`, `Stagger`, `SkillBar`, `GlowText`, `Hero` scene).
2. **Global CSS** (`@media (prefers-reduced-motion: reduce)` in `index.css`) neutralizes CSS
   animations/transitions and disables smooth scroll.
3. **JS scrolling** (`scrollToSection`) checks the media query and uses `behavior: 'auto'`, since a
   programmatic `behavior: 'smooth'` ignores the CSS setting.

## Performance notes

- 3D: single `THREE.Points`/one draw call, vertex-shader parallax, ref mutations in `useFrame` (never
  `setState`), DPR cap + `PerformanceMonitor`/`AdaptiveDpr`, and `frameloop` paused off-screen/hidden
  via `useSceneActive`.
- framer-motion runs through `LazyMotion` with the lighter `m.*` primitives.
- Tune particle counts per breakpoint in `PARTICLES.count` (`constants.ts`).
