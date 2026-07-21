import type { TimelineEntry } from './types'
import { externalLinks } from './site'

const auxifyNote = [
  { text: 'sister company of ' },
  { text: 'Oriv', href: externalLinks.oriv, external: true },
]

// Newest first — display order matches DOM order for correct tab sequence.
export const experience: TimelineEntry[] = [
  {
    id: 'sde2-auxify',
    role: 'Software Development Engineer 2',
    company: 'Auxify',
    companyNote: auxifyNote,
    period: 'Jul 2026 — Present', // REAL — promoted July 2026
    location: 'Mangalore, India',
    current: true,
    promotedFromPrevious: true,
    // TODO: refine bullets
    bullets: [
      'Leads design of an agentic AI harness SDK — intent-driven agent orchestration across the stack.',
      'Owns the architecture for resumable, multi-turn agent workflows and their evaluation.',
    ],
  },
  {
    id: 'sde-auxify',
    role: 'Software Development Engineer',
    company: 'Auxify',
    companyNote: auxifyNote,
    // TODO: adjust start month to actual joining date
    period: '2023 — Jun 2026',
    location: 'Mangalore, India',
    // TODO: refine bullets
    bullets: [
      'Built LLM extraction pipelines with DSPy and staged validation gates.',
      'Designed event-driven microservices with schema-first contracts.',
      'Shipped React/TypeScript product surfaces end to end.',
    ],
  },
  {
    // TODO: dummy early role — remove this entry entirely if not applicable
    id: 'early-role',
    role: 'Software Engineering Intern',
    company: 'Placeholder Company',
    period: '2022 — 2023',
    location: 'Remote',
    bullets: ['Placeholder: contributed to internal tooling and full-stack product features.'],
  },
]
