import type { LucideIcon } from 'lucide-react'

/** Every scroll target on the single page. */
export type SectionId =
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'achievements'
  | 'contact'

export interface NavItem {
  id: SectionId
  label: string
}

/** Eyebrow + title shown at the top of a section (mono eyebrow, display title). */
export interface SectionMeta {
  eyebrow: string
  title: string
  accent: Accent
}

/**
 * A run of text with an optional link. Lets prose that contains inline links
 * (e.g. "sister company of Oriv") live in data without embedding markup.
 */
export interface TextSegment {
  text: string
  href?: string
  external?: boolean
}
export type RichText = TextSegment[]

/* ------------------------------- Hero + About ------------------------------ */

export interface CtaLink {
  label: string
  target: SectionId
  variant: 'primary' | 'ghost'
}

export interface HeroContent {
  eyebrow: string
  name: string
  subhead: string
}

export interface AboutContent {
  lead: string
  paragraphs: RichText[]
}

/* --------------------------------- Skills ---------------------------------- */

export interface Skill {
  name: string
  /** 0–100, illustrative — drives the animated proficiency bar length only. */
  level?: number
}

export interface SkillCategory {
  id: string
  title: string
  icon: LucideIcon
  display: 'bars' | 'tags'
  /** the loudest, most-glowing card */
  highlight?: boolean
  skills: Skill[]
}

/** A single language's share of coding time (from WakaTime, or the fallback). */
export interface LanguageStat {
  name: string
  percent: number
  color?: string
}

/* ------------------------------- Experience -------------------------------- */

export interface TimelineEntry {
  id: string
  role: string
  company: string
  companyNote?: RichText
  period: string
  location?: string
  /** brighter node + "Current" chip */
  current?: boolean
  /** render a "Promoted ↑" connector down to the previous (older) entry */
  promotedFromPrevious?: boolean
  bullets: string[]
}

/* -------------------------------- Projects --------------------------------- */

export type Accent = 'cyan' | 'teal' | 'violet' | 'seafoam' | 'nebula'

export interface ImpactStat {
  value: string
  label: string
}

export interface CaseStudy {
  challenge: string
  approach: string
  architecture: string[]
  impact: ImpactStat[]
}

export interface Project {
  id: string
  title: string
  oneLiner: string
  tags: string[]
  badge: string
  accent: Accent
  caseStudy: CaseStudy
}

/* ------------------------------ Achievements ------------------------------- */

export interface Stat {
  value: number
  suffix?: string
  label: string
  real?: boolean
}

export interface AchievementChip {
  label: string
  icon: LucideIcon
  real?: boolean
}

/* -------------------------------- Contact ---------------------------------- */

export type BrandId = 'github' | 'linkedin' | 'x' | 'instagram' | 'stackoverflow' | 'codepen'

export interface Social {
  id: BrandId
  label: string
  handle: string
  href: string
}

export interface ContactContent {
  email: string
  blurb: string
  ctaLabel: string
  footer: string
  socials: Social[]
}

/* ---------------------------------- Site ----------------------------------- */

export interface SiteMeta {
  name: string
  role: string
  title: string
  description: string
  url: string
}
