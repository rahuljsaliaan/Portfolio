import type { Accent } from '@/data/types'
import { cn } from '@/lib/utils'

// Frosted "liquid glass": a translucent, accent-tinted gradient over a strong
// backdrop blur, so the ocean shows through and the panel reads as submerged.
// Lit at the top (light from the surface), darker toward the bottom (depth).
const ACCENT: Record<Accent, { tint: string; border: string; hover: string }> = {
  cyan: {
    tint: 'from-current-cyan/[0.08]',
    border: 'border-current-cyan/15',
    hover: 'hover:border-current-cyan/45 hover:shadow-[0_16px_50px_-16px_var(--color-current-cyan)]',
  },
  teal: {
    tint: 'from-biolume-teal/[0.08]',
    border: 'border-biolume-teal/15',
    hover: 'hover:border-biolume-teal/45 hover:shadow-[0_16px_50px_-16px_var(--color-biolume-teal)]',
  },
  violet: {
    tint: 'from-jelly-violet/[0.08]',
    border: 'border-jelly-violet/15',
    hover: 'hover:border-jelly-violet/45 hover:shadow-[0_16px_50px_-16px_var(--color-jelly-violet)]',
  },
  seafoam: {
    tint: 'from-seafoam/[0.08]',
    border: 'border-seafoam/15',
    hover: 'hover:border-seafoam/45 hover:shadow-[0_16px_50px_-16px_var(--color-seafoam)]',
  },
  nebula: {
    tint: 'from-nebula/[0.08]',
    border: 'border-nebula/15',
    hover: 'hover:border-nebula/45 hover:shadow-[0_16px_50px_-16px_var(--color-nebula)]',
  },
}

/**
 * Shared liquid-glass surface classes. The `before` pseudo is a thin light line
 * across the top edge (surface light catching the panel).
 */
export function cardClasses(accent: Accent = 'cyan', interactive = false) {
  return cn(
    'relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-500',
    'bg-gradient-to-b to-ocean-deep/40',
    ACCENT[accent].tint,
    ACCENT[accent].border,
    'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-current-cyan/40 before:to-transparent',
    interactive && cn('hover:-translate-y-1', ACCENT[accent].hover),
  )
}
