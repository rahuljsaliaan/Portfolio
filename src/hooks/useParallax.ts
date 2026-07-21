import { useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { useEnv } from './useEnv'

/**
 * Scroll-driven vertical parallax for a decorative layer.
 * Returns a motion value (`y`) — no re-renders. Flattened under reduced motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(distance = 80) {
  const ref = useRef<T>(null)
  const { reducedMotion } = useEnv()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [distance, -distance])
  return { ref, y }
}
