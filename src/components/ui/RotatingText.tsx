import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useEnv } from '@/hooks/useEnv'
import { EASE_OUT_EXPO } from '@/lib/constants'
import { cn } from '@/lib/utils'

/** Cycles through phrases with a blur-fade — a subtle "thinking" ticker. */
export function RotatingText({
  items,
  interval = 2600,
  className,
}: {
  items: string[]
  interval?: number
  className?: string
}) {
  const { reducedMotion } = useEnv()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion || items.length <= 1) return
    const id = window.setInterval(() => setIndex((p) => (p + 1) % items.length), interval)
    return () => window.clearInterval(id)
  }, [reducedMotion, items.length, interval])

  if (reducedMotion) return <span className={className}>{items[0]}</span>

  return (
    <span className={cn('relative inline-block align-bottom', className)}>
      <AnimatePresence mode="wait">
        <m.span
          key={index}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="inline-block"
        >
          {items[index]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}
