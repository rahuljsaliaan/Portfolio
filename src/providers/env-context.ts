import { createContext } from 'react'

/** Global environment signals, computed once and shared (no per-component matchMedia). */
export interface EnvState {
  /** user prefers reduced motion */
  reducedMotion: boolean
  /** primary pointer is coarse (touch) — disables cursor + magnetic effects */
  isTouch: boolean
  /** document is currently visible — used to pause 3D render loops */
  pageVisible: boolean
}

export const EnvContext = createContext<EnvState | null>(null)
