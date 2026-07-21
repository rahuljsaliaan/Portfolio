import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEnv } from '@/hooks/useEnv'
import { cn } from '@/lib/utils'

/** Animated neon gradient sweep — used for the hero name. Static under reduced motion. */
export function GlowText({ children, className }: { children: ReactNode; className?: string }) {
  const { reducedMotion } = useEnv()
  return (
    <m.span
      className={cn(
        'bg-gradient-to-r from-current-cyan via-jelly-violet to-biolume-teal bg-clip-text text-transparent',
        className,
      )}
      style={{ backgroundSize: '220% 100%' }}
      animate={reducedMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={reducedMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </m.span>
  )
}
