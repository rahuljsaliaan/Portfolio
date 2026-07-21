import { m, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEnv } from '@/hooks/useEnv'
import { EASE_OUT_EXPO, MOTION } from '@/lib/constants'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/** Single element: drift + fade in once when scrolled into view. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { reducedMotion } = useEnv()
  if (reducedMotion) return <div className={className}>{children}</div>
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: MOTION.reveal.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: MOTION.reveal.viewportAmount }}
      transition={{ duration: MOTION.duration.base, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </m.div>
  )
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: MOTION.reveal.stagger } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: MOTION.reveal.y },
  show: { opacity: 1, y: 0, transition: { duration: MOTION.duration.base, ease: EASE_OUT_EXPO } },
}

/** Container that staggers its <StaggerItem> children into view. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const { reducedMotion } = useEnv()
  if (reducedMotion) return <div className={className}>{children}</div>
  return (
    <m.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: MOTION.reveal.viewportAmount }}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const { reducedMotion } = useEnv()
  if (reducedMotion) return <div className={className}>{children}</div>
  return (
    <m.div className={className} variants={itemVariants}>
      {children}
    </m.div>
  )
}
