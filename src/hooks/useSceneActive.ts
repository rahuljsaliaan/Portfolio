import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useEnv } from './useEnv'

/**
 * Drives a Canvas `frameloop`: render only while the scene is on-screen AND the
 * tab is visible. Attach `ref` to the scene wrapper; feed `active` to frameloop.
 */
export function useSceneActive() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.05 })
  const { pageVisible } = useEnv()
  return { ref, active: inView && pageVisible }
}
