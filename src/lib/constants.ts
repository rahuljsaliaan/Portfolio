// Central tuning knobs for motion, 3D, and layering. Keeping these here means
// the "feel" of the whole site can be adjusted without hunting through components.

/** framer-motion bezier easings (BezierDefinition tuples). */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1]
/** Gentle buoyant settle — the site's "liquid" feel. */
export const EASE_LIQUID: [number, number, number, number] = [0.34, 1.15, 0.5, 1]

export const MOTION = {
  duration: { fast: 0.3, base: 0.6, slow: 0.9 },
  reveal: { y: 24, stagger: 0.08, viewportAmount: 0.25 },
} as const

export const CURSOR = {
  ringSize: 38,
  dotSize: 6,
  ringStiffness: 260,
  ringDamping: 28,
  dotStiffness: 900,
  dotDamping: 40,
} as const

export const MAGNETIC = {
  radius: 90, // proximity (px) beyond the element's own half-size
  strength: 0.35,
  stiffness: 200,
  damping: 15,
} as const

export const PARTICLES = {
  count: { desktop: 3200, tablet: 2000, mobile: 900 },
  dprCap: 1.75,
} as const

/** Hero neural-network / knowledge-graph tuning. */
export const GRAPH = {
  nodes: { desktop: 58, tablet: 44, mobile: 30 },
  signals: 10,
  dprCap: 1.75,
  // cursor wake: how far it reaches, how hard it shoves, how fast it settles
  wake: { radius: 1.8, strength: 0.5, decay: 2.6 },
} as const

/** z-index scale — one place so nothing fights. */
export const Z = {
  decor: 5,
  content: 10,
  nav: 40,
  progress: 45,
  modal: 50,
  cursor: 60,
} as const
