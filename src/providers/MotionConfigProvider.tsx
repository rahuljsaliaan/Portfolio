import { LazyMotion, MotionConfig, domMax } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * - LazyMotion(domMax): loads the full feature set (incl. layout animations for
 *   the nav underline) once, so components can use the lighter `m.*` primitives.
 * - `strict` makes `motion.*` throw, enforcing `m.*` everywhere (smaller bundle).
 * - reducedMotion="user": framer respects prefers-reduced-motion for transforms.
 *   (Opacity/clip still animate — components gate those via useEnv().reducedMotion.)
 */
export function MotionConfigProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
