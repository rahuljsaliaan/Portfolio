import {
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { Accent } from '@/data/types'
import { ACCENT_VAR } from '@/lib/accents'
import { LiquidBlob } from './LiquidBlob'
import { useEnv } from '@/hooks/useEnv'
import { cn } from '@/lib/utils'

// Thin neon frame per accent — crisp at rest (tech), brighter on hover.
const ACCENT_BORDER: Record<Accent, { rest: string; hover: string }> = {
  cyan: { rest: 'border-current-cyan/15', hover: 'hover:border-current-cyan/50' },
  teal: { rest: 'border-biolume-teal/15', hover: 'hover:border-biolume-teal/50' },
  violet: { rest: 'border-jelly-violet/15', hover: 'hover:border-jelly-violet/50' },
  seafoam: { rest: 'border-seafoam/15', hover: 'hover:border-seafoam/50' },
  nebula: { rest: 'border-nebula/15', hover: 'hover:border-nebula/50' },
}

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'button' | 'li'
  accent?: Accent
  /**
   * A crisp translucent tech panel that blends with the ocean, with flowing
   * liquid light contained inside its frame. Interactive panels stay faint at
   * rest and sharpen (border + liquid gather + lift) on hover.
   */
  interactive?: boolean
  children?: ReactNode
}

export function Card({
  as = 'div',
  accent = 'cyan',
  interactive = false,
  className,
  children,
  style,
  ...rest
}: CardProps) {
  const { isTouch, reducedMotion } = useEnv()
  const [hovered, setHovered] = useState(false)
  const Comp = as as ElementType
  const reveal = interactive && !isTouch

  const classes = reveal
    ? cn(
        'group relative isolate overflow-hidden rounded-2xl border bg-ocean-deep/10 backdrop-blur-0 transition-all duration-500',
        ACCENT_BORDER[accent].rest,
        'hover:-translate-y-1 hover:bg-ocean-deep/25 hover:backdrop-blur-md',
        ACCENT_BORDER[accent].hover,
      )
    : cn(
        'group relative isolate overflow-hidden rounded-2xl border bg-ocean-deep/20 backdrop-blur-sm transition-all duration-500',
        ACCENT_BORDER[accent].rest,
      )

  const mergedStyle = { ...style, '--panel-accent': ACCENT_VAR[accent] } as CSSProperties

  return (
    <Comp
      className={cn(classes, className)}
      style={mergedStyle}
      {...rest}
      {...(as === 'button' ? { type: 'button' } : {})}
      onPointerEnter={reveal ? () => setHovered(true) : undefined}
      onPointerLeave={reveal ? () => setHovered(false) : undefined}
    >
      <LiquidBlob active={hovered} interactive={interactive} reduced={reducedMotion} />
      {children}
    </Comp>
  )
}
