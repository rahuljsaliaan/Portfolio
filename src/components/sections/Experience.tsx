import { m } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { cardClasses } from '@/components/ui/cardClasses'
import { RichTextView } from '@/components/ui/RichText'
import { Tag } from '@/components/ui/Tag'
import { experience } from '@/data/experience'
import type { TimelineEntry } from '@/data/types'
import { useEnv } from '@/hooks/useEnv'
import { EASE_OUT_EXPO, MOTION } from '@/lib/constants'
import { cn } from '@/lib/utils'

function EntryCard({ entry }: { entry: TimelineEntry }) {
  return (
    <div
      className={cn(
        cardClasses(entry.current ? 'cyan' : 'teal'),
        'p-6 text-left',
        entry.current && 'shadow-[0_0_40px_-16px_var(--color-current-cyan)]',
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-current-cyan">{entry.period}</span>
        {entry.current ? <Tag variant="status">Current</Tag> : null}
      </div>
      <h3 className="font-display text-xl font-semibold text-foam-white">{entry.role}</h3>
      <p className="mt-1 text-sm text-drift-gray">
        <span className="text-foam-white/90">{entry.company}</span>
        {entry.companyNote ? (
          <>
            {' · '}
            <RichTextView segments={entry.companyNote} />
          </>
        ) : null}
      </p>
      {entry.location ? (
        <p className="mt-0.5 font-mono text-xs text-drift-gray">{entry.location}</p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {entry.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-drift-gray">
            <span
              aria-hidden={true}
              className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-current-cyan"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Experience() {
  const { reducedMotion } = useEnv()

  return (
    <Section id="experience">
      <ol className="relative mx-auto max-w-4xl">
        {/* neon spine */}
        <span
          aria-hidden={true}
          className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-current-cyan via-biolume-teal to-transparent md:left-1/2 md:-translate-x-1/2"
        />

        {experience.map((entry, i) => {
          const side = i % 2 === 0 ? 'right' : 'left'
          const slotClass =
            side === 'right'
              ? 'md:col-start-2 md:pl-10'
              : 'md:col-start-1 md:row-start-1 md:flex md:justify-end md:pr-10'

          const reveal = reducedMotion
            ? {}
            : {
                initial: { opacity: 0, x: side === 'left' ? -40 : 40, y: 16 },
                whileInView: { opacity: 1, x: 0, y: 0 },
                viewport: { once: true, amount: 0.4 },
                transition: { duration: MOTION.duration.base, ease: EASE_OUT_EXPO },
              }

          return (
            <li key={entry.id} className="relative mb-14 last:mb-0 md:grid md:grid-cols-2 md:gap-10">
              {/* spine node */}
              <span
                aria-hidden={true}
                className={cn(
                  'absolute left-4 top-2 z-10 -translate-x-1/2 rounded-full md:left-1/2',
                  entry.current
                    ? 'size-4 animate-cta-pulse bg-current-cyan shadow-[0_0_16px_var(--color-current-cyan)]'
                    : 'size-3 bg-biolume-teal shadow-[0_0_10px_var(--color-biolume-teal)]',
                )}
              />

              <div className={cn('pl-12 md:pl-0', slotClass)}>
                <m.div className="md:max-w-md" {...reveal}>
                  <EntryCard entry={entry} />
                </m.div>
              </div>

              {/* promotion connector to the (older) role below */}
              {entry.promotedFromPrevious ? (
                <span className="absolute -bottom-9 left-4 z-10 -translate-x-1/2 md:left-1/2">
                  <Tag variant="chip" icon={ArrowUp}>
                    Promoted
                    <span className="sr-only"> to this role from the one below</span>
                  </Tag>
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
