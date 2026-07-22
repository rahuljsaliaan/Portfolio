import { useEffect, useId, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useEnv } from '@/hooks/useEnv'
import { EASE_LIQUID } from '@/lib/constants'
import { cn } from '@/lib/utils'

/**
 * Cycles through phrases. The text is run through an animated turbulence +
 * displacement filter so it constantly wavers as if seen through water, and each
 * swap emerges from / dissolves back into the murk on a slow buoyant ease.
 */
export function RotatingText({
  items,
  interval = 2800,
  className,
}: {
  items: string[]
  interval?: number
  className?: string
}) {
  const { reducedMotion } = useEnv()
  const [index, setIndex] = useState(0)
  const fid = 'ripple' + useId().replace(/:/g, '')

  useEffect(() => {
    if (reducedMotion || items.length <= 1) return
    const id = window.setInterval(() => setIndex((p) => (p + 1) % items.length), interval)
    return () => window.clearInterval(id)
  }, [reducedMotion, items.length, interval])

  if (reducedMotion) return <span className={className}>{items[0]}</span>

  return (
    <span
      className={cn('relative inline-block align-bottom', className)}
      style={{ filter: `url(#${fid})` }}
    >
      <svg aria-hidden={true} className="pointer-events-none absolute size-0">
        <filter id={fid} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="7" result="noise">
            <animate
              attributeName="baseFrequency"
              dur="16s"
              values="0.012 0.028; 0.02 0.02; 0.012 0.028"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <AnimatePresence mode="wait">
        <m.span
          key={index}
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: EASE_LIQUID }}
          className="relative inline-block"
        >
          {items[index]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}
