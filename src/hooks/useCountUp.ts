import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useEnv } from './useEnv'

/**
 * Counts up from 0 to `target` when the element scrolls into view (once).
 * Returns the final value instantly under reduced motion.
 */
export function useCountUp<T extends HTMLElement = HTMLDivElement>(target: number, duration = 1.6) {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const { reducedMotion } = useEnv()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setValue(target)
      return
    }
    let raf = 0
    let startTs: number | null = null
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts
      const progress = Math.min(1, (ts - startTs) / (duration * 1000))
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress) // easeOutExpo
      setValue(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reducedMotion, target, duration])

  return { ref, value }
}
