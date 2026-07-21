import { m } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'ghost'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  href?: string
  external?: boolean
  icon?: LucideIcon
  iconRight?: LucideIcon
  className?: string
  ariaLabel?: string
}

const VARIANT: Record<ButtonVariant, string> = {
  // base shadow keeps a static glow under reduced motion (when the pulse is disabled)
  primary:
    'bg-current-cyan font-semibold text-ocean-abyss shadow-[0_0_22px_-8px_var(--color-current-cyan)] animate-cta-pulse hover:brightness-110',
  ghost:
    'border border-current-cyan/40 text-foam-white hover:border-current-cyan hover:text-current-cyan hover:shadow-[0_0_28px_-10px_var(--color-current-cyan)]',
}

/**
 * Magnetic CTA. The interactive element (button/anchor) lives inside a magnetic
 * wrapper div, so a single useMagnetic<HTMLDivElement>() works for both tags.
 */
export function Button({
  children,
  variant = 'primary',
  onClick,
  href,
  external,
  icon: Icon,
  iconRight: IconRight,
  className,
  ariaLabel,
}: ButtonProps) {
  const { ref, magneticProps, style } = useMagnetic<HTMLDivElement>()

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm transition-[filter,color,border-color,box-shadow] duration-300',
    VARIANT[variant],
    className,
  )
  const inner = (
    <>
      {Icon ? <Icon className="size-4" aria-hidden={true} /> : null}
      {children}
      {IconRight ? <IconRight className="size-4" aria-hidden={true} /> : null}
    </>
  )

  return (
    <m.div ref={ref} {...magneticProps} style={style} className="inline-flex">
      {href ? (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer noopener' : undefined}
          aria-label={ariaLabel}
          className={classes}
        >
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={ariaLabel} className={classes}>
          {inner}
        </button>
      )}
    </m.div>
  )
}
