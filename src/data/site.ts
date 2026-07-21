import type { NavItem, SectionId, SectionMeta, SiteMeta } from './types'

export const site: SiteMeta = {
  name: 'Rahul J',
  role: 'Software Development Engineer 2',
  title: 'Rahul J — Software Development Engineer · Agentic AI',
  description:
    'SDE 2 building agentic AI systems — agent harnesses, LLM pipelines, and the architecture that scales them.',
  // TODO: replace with real deployed URL
  url: 'https://rahulj.dev',
}

/** Nav order (the hero is "home" and is reached via the logo / scroll-to-top). */
export const nav: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
]

/** Eyebrow + title for each section header. */
export const sectionMeta: Record<Exclude<SectionId, 'hero'>, SectionMeta> = {
  about: { eyebrow: 'WHO I AM', title: 'About', accent: 'seafoam' },
  skills: { eyebrow: 'WHAT I WORK WITH', title: 'Skills matrix', accent: 'cyan' },
  experience: { eyebrow: 'THE PATH SO FAR', title: 'Experience', accent: 'teal' },
  projects: { eyebrow: 'SELECTED WORK', title: 'Projects & case studies', accent: 'violet' },
  achievements: { eyebrow: 'BY THE NUMBERS', title: 'Achievements & stats', accent: 'nebula' },
  contact: { eyebrow: 'SAY HELLO', title: 'Get in touch', accent: 'seafoam' },
}

/** All sections top-to-bottom (includes hero) — used by the scroll-spy. */
export const sectionOrder: SectionId[] = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'achievements',
  'contact',
]

export const externalLinks = {
  oriv: 'https://oriv.io/',
  github: 'https://github.com/rahuljsaliaan',
} as const
