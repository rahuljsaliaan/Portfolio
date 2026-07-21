import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TagVariant = 'tag' | 'chip' | 'status'

interface TagProps {
  children: ReactNode
  variant?: TagVariant
  icon?: LucideIcon
  className?: string
}

const VARIANTS: Record<TagVariant, string> = {
  tag: 'border-current-cyan/20 bg-current-cyan/5 text-foam-white/90',
  chip: 'border-jelly-violet/30 bg-jelly-violet/10 text-foam-white',
  status: 'border-current-cyan/50 bg-current-cyan/10 text-current-cyan neon-ring',
}

/** Mono pill — skill tag, achievement chip, or a glowing status marker. */
export function Tag({ children, variant = 'tag', icon: Icon, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs tracking-wide',
        VARIANTS[variant],
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" aria-hidden={true} /> : null}
      {children}
    </span>
  )
}
