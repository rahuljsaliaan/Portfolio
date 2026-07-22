import { BrainCircuit, GitBranch, Layers, Waves } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Principle {
  icon: LucideIcon
  title: string
  body: string
}

export const principles: Principle[] = [
  {
    icon: BrainCircuit,
    title: 'Intent over instructions',
    body: 'Systems should resolve goals, not follow brittle scripts — declarative intent that plans, pauses, injects facts, and resumes.',
  },
  {
    icon: Layers,
    title: 'Structure is leverage',
    body: 'Schema-first contracts, typed boundaries, and the right design patterns turn complexity into something you can reason about.',
  },
  {
    icon: GitBranch,
    title: 'Evaluate everything',
    body: 'If it ships without observability and evals, it ships blind. Measure, trace, and gate progression on quality.',
  },
  {
    icon: Waves,
    title: 'Depth over surface',
    body: 'Go to first principles. The problems worth solving live below the API surface — in how a system actually scales.',
  },
]
