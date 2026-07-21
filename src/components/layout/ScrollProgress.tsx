import { m, useScroll, useSpring } from 'framer-motion'
import { Z } from '@/lib/constants'

/** Thin neon bar fixed at the top of the viewport, scaled to scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return (
    <m.div
      aria-hidden={true}
      className="fixed inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-current-cyan via-biolume-teal to-jelly-violet shadow-[0_0_10px_var(--color-current-cyan)]"
      style={{ scaleX, zIndex: Z.progress }}
    />
  )
}
