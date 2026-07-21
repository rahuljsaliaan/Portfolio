import { useRef, type PointerEvent } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { MAGNETIC } from '@/lib/constants'
import { useEnv } from './useEnv'

/**
 * Magnetic pull toward the cursor within a proximity radius.
 * Uses motion values + springs (no React re-render per frame).
 * Disabled on touch / reduced-motion — returns no handlers so the element is static.
 *
 * Specify the element type at the call site, e.g. `useMagnetic<HTMLAnchorElement>()`.
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  strength: number = MAGNETIC.strength,
) {
  const ref = useRef<T>(null)
  const { reducedMotion, isTouch } = useEnv()
  const disabled = reducedMotion || isTouch

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: MAGNETIC.stiffness, damping: MAGNETIC.damping })
  const springY = useSpring(y, { stiffness: MAGNETIC.stiffness, damping: MAGNETIC.damping })

  const onPointerMove = (e: PointerEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const reach = MAGNETIC.radius + Math.max(rect.width, rect.height) / 2
    if (Math.hypot(dx, dy) < reach) {
      x.set(dx * strength)
      y.set(dy * strength)
    }
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return {
    ref,
    magneticProps: disabled ? {} : { onPointerMove, onPointerLeave: reset, onBlur: reset },
    style: disabled ? undefined : { x: springX, y: springY },
  }
}
