import { useEffect, useState, type ReactNode } from 'react'
import { EnvContext } from './env-context'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const COARSE_POINTER_QUERY = '(pointer: coarse)'

/**
 * Single source of truth for reduced-motion / touch / page-visibility.
 * One set of listeners for the whole app; consumed via `useEnv()`.
 */
export function EnvProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )
  const [isTouch, setIsTouch] = useState(() => window.matchMedia(COARSE_POINTER_QUERY).matches)
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY)
    const coarse = window.matchMedia(COARSE_POINTER_QUERY)
    const onReduced = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    const onCoarse = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    const onVisibility = () => setPageVisible(!document.hidden)

    reduced.addEventListener('change', onReduced)
    coarse.addEventListener('change', onCoarse)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      reduced.removeEventListener('change', onReduced)
      coarse.removeEventListener('change', onCoarse)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <EnvContext.Provider value={{ reducedMotion, isTouch, pageVisible }}>
      {children}
    </EnvContext.Provider>
  )
}
