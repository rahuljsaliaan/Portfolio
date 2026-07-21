import type { Accent } from '@/data/types'

/** CSS variable per accent — for inline styles (gradients, glows). */
export const ACCENT_VAR: Record<Accent, string> = {
  cyan: 'var(--color-current-cyan)',
  teal: 'var(--color-biolume-teal)',
  violet: 'var(--color-jelly-violet)',
  seafoam: 'var(--color-seafoam)',
  nebula: 'var(--color-nebula)',
}

/** Text-color utility per accent (Tailwind needs literal class names). */
export const ACCENT_TEXT: Record<Accent, string> = {
  cyan: 'text-current-cyan',
  teal: 'text-biolume-teal',
  violet: 'text-jelly-violet',
  seafoam: 'text-seafoam',
  nebula: 'text-nebula',
}
