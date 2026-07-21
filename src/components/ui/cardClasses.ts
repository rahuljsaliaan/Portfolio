import type { Accent } from '@/data/types'
import { cn } from '@/lib/utils'

const ACCENT: Record<Accent, { border: string; hover: string }> = {
  cyan: {
    border: 'border-current-cyan/15',
    hover: 'hover:border-current-cyan/40 hover:shadow-[0_0_40px_-12px_var(--color-current-cyan)]',
  },
  teal: {
    border: 'border-biolume-teal/15',
    hover: 'hover:border-biolume-teal/40 hover:shadow-[0_0_40px_-12px_var(--color-biolume-teal)]',
  },
  violet: {
    border: 'border-jelly-violet/15',
    hover: 'hover:border-jelly-violet/40 hover:shadow-[0_0_40px_-12px_var(--color-jelly-violet)]',
  },
}

/** Shared "materialistic" surface classes — reusable for non-div elements (e.g. buttons). */
export function cardClasses(accent: Accent = 'cyan', interactive = false) {
  return cn(
    'relative rounded-2xl border bg-ocean-deep/70 backdrop-blur-sm transition-all duration-300',
    ACCENT[accent].border,
    interactive && ACCENT[accent].hover,
  )
}
