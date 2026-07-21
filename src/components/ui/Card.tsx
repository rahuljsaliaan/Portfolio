import {
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react'
import type { Accent } from '@/data/types'
import { ACCENT_VAR } from '@/lib/accents'
import { useEnv } from '@/hooks/useEnv'
import { cn } from '@/lib/utils'

const ACCENT_HOVER: Record<Accent, string> = {
  cyan: 'hover:border-current-cyan/50 hover:shadow-[0_18px_60px_-18px_var(--color-current-cyan)]',
  teal: 'hover:border-biolume-teal/50 hover:shadow-[0_18px_60px_-18px_var(--color-biolume-teal)]',
  violet: 'hover:border-jelly-violet/50 hover:shadow-[0_18px_60px_-18px_var(--color-jelly-violet)]',
  seafoam: 'hover:border-seafoam/50 hover:shadow-[0_18px_60px_-18px_var(--color-seafoam)]',
  nebula: 'hover:border-nebula/50 hover:shadow-[0_18px_60px_-18px_var(--color-nebula)]',
}

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'button' | 'li'
  accent?: Accent
  /**
   * Hover-reveal "liquid glass": barely there at rest (content floats in the
   * ocean), then a frosted membrane + a cursor-following glow pool materialise
   * on hover. On touch / non-interactive it's a calm persistent glass instead.
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
  const ref = useRef<HTMLElement>(null)
  const { isTouch } = useEnv()
  const Comp = as as ElementType
  const reveal = interactive && !isTouch

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--lx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--ly', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  const classes = reveal
    ? cn(
        // rest: no chrome at all — content just floats in the ocean
        'group relative overflow-hidden rounded-2xl border border-transparent bg-transparent backdrop-blur-0 transition-all duration-500',
        // hover: the "liquid glass" card materialises
        'hover:-translate-y-1 hover:bg-ocean-deep/45 hover:backdrop-blur-md',
        ACCENT_HOVER[accent],
      )
    : cn(
        // non-interactive panels: a faint glass that blends, still legible
        'group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ocean-deep/15 backdrop-blur-sm transition-all duration-500',
        interactive && cn('hover:-translate-y-1', ACCENT_HOVER[accent]),
      )

  const mergedStyle = { ...style, '--panel-accent': ACCENT_VAR[accent] } as CSSProperties

  return (
    <Comp
      ref={ref}
      className={cn(classes, className)}
      style={mergedStyle}
      {...rest}
      {...(as === 'button' ? { type: 'button' } : {})}
      onPointerMove={reveal ? onPointerMove : undefined}
    >
      {reveal ? <span aria-hidden={true} className="liquid-glow" /> : null}
      <span
        aria-hidden={true}
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current-cyan/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </Comp>
  )
}
