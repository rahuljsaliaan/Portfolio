import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Accent, SectionId } from '@/data/types'
import { sectionMeta } from '@/data/site'
import { useEnv } from '@/hooks/useEnv'
import { ACCENT_TEXT, ACCENT_VAR } from '@/lib/accents'
import { EASE_OUT_EXPO, MOTION } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: Exclude<SectionId, 'hero'>
  children: ReactNode
  className?: string
  containerClassName?: string
}

/** Landmark section: a per-accent "current" divider, an accent-tinted header glow,
 *  and a title that surfaces into focus from the murk. */
export function Section({ id, children, className, containerClassName }: SectionProps) {
  const meta = sectionMeta[id]
  return (
    <section id={id} className={cn('relative scroll-mt-24 py-24 sm:py-32', className)}>
      <CurrentDivider accent={meta.accent} />
      <div className={cn('mx-auto w-full max-w-6xl px-6', containerClassName)}>
        <SectionHeader eyebrow={meta.eyebrow} title={meta.title} accent={meta.accent} />
        {children}
      </div>
    </section>
  )
}

/** A soft, accent-coloured "current" line that draws itself in as the section scrolls into view. */
function CurrentDivider({ accent }: { accent: Accent }) {
  const { reducedMotion } = useEnv()
  const lineStyle = {
    background: `linear-gradient(90deg, transparent, ${ACCENT_VAR[accent]}, transparent)`,
    boxShadow: `0 0 12px ${ACCENT_VAR[accent]}`,
  }
  return (
    <div
      aria-hidden={true}
      className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
    >
      {reducedMotion ? (
        <div className="h-px w-2/3 max-w-3xl opacity-50" style={lineStyle} />
      ) : (
        <m.div
          className="h-px w-2/3 max-w-3xl origin-center"
          style={lineStyle}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.5 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
        />
      )}
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string
  title: string
  accent: Accent
}) {
  const { reducedMotion } = useEnv()
  return (
    <header className="relative mb-12 sm:mb-16">
      <div
        aria-hidden={true}
        className="pointer-events-none absolute -left-4 -top-8 h-28 w-72 rounded-full blur-3xl"
        style={{ background: ACCENT_VAR[accent], opacity: 0.1 }}
      />
      <p
        className={cn(
          'relative mb-3 font-mono text-xs uppercase tracking-[0.3em]',
          ACCENT_TEXT[accent],
        )}
      >
        {eyebrow}
      </p>
      {reducedMotion ? (
        <h2 className="relative font-display text-4xl font-bold text-foam-white sm:text-5xl">
          {title}
        </h2>
      ) : (
        <div className="relative overflow-hidden pb-1">
          <m.h2
            className="font-display text-4xl font-bold text-foam-white sm:text-5xl"
            initial={{ y: '110%', opacity: 0, filter: 'blur(8px)' }}
            whileInView={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: MOTION.duration.slow, ease: EASE_OUT_EXPO }}
          >
            {title}
          </m.h2>
        </div>
      )}
    </header>
  )
}
