import type { AboutContent, CtaLink, HeroContent } from './types'
import { externalLinks } from './site'

export const hero: HeroContent = {
  eyebrow: 'SOFTWARE DEVELOPMENT ENGINEER 2 · AGENTIC AI',
  name: 'Rahul J',
  subhead:
    'I build agentic AI systems — intent-driven agent harnesses, LLM pipelines, and the architecture that scales them.',
}

export const heroCtas: CtaLink[] = [
  { label: 'View my work', target: 'projects', variant: 'primary' },
  { label: 'Get in touch', target: 'contact', variant: 'ghost' },
]

export const heroFocus = {
  label: 'Currently thinking about',
  areas: [
    'agent harness design',
    'LLM pipelines',
    'knowledge graphs',
    'retrieval & RAG',
    'system design',
  ],
}

export const about: AboutContent = {
  // TODO: tune this line — it sets the tone (depth, systems, the long arc of intelligence)
  lead: 'I think in systems and depth — how structure becomes intelligence, and where that long arc is heading.',
  paragraphs: [
    [
      {
        text: 'I’m a software engineer working on agentic AI at a professional level — designing intent-driven agent harnesses and LLM workflow systems with frameworks like LangChain, LangGraph, and DSPy, alongside custom in-house harness architecture.',
      },
    ],
    [
      {
        text: 'Under that sits a strong full-stack foundation — TypeScript/React, Python, Go, and Node — and a focus on scaling systems through design patterns, microservices, and deliberate system design.',
      },
    ],
    [
      { text: 'Based in Mangalore, India. I’m an SDE 2 at Auxify, a sister company of ' },
      { text: 'Oriv', href: externalLinks.oriv, external: true },
      { text: '.' },
    ],
  ],
}
