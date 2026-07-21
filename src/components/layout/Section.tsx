import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import type { SectionId } from '@/data/types'
import { sectionMeta } from '@/data/site'
import { useEnv } from '@/hooks/useEnv'
import { EASE_OUT_EXPO, MOTION } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: Exclude<SectionId, 'hero'>
  children: ReactNode
  className?: string
  containerClassName?: string
}

/** Landmark section with a consistent eyebrow + clip-revealed title, read from data. */
export function Section({ id, children, className, containerClassName }: SectionProps) {
  const meta = sectionMeta[id]
  return (
    <section id={id} className={cn('relative scroll-mt-24 py-24 sm:py-32', className)}>
      <div className={cn('mx-auto w-full max-w-6xl px-6', containerClassName)}>
        <SectionHeader eyebrow={meta.eyebrow} title={meta.title} />
        {children}
      </div>
    </section>
  )
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { reducedMotion } = useEnv()
  return (
    <header className="mb-12 sm:mb-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-current-cyan">
        {eyebrow}
      </p>
      {reducedMotion ? (
        <h2 className="font-display text-4xl font-bold text-foam-white sm:text-5xl">{title}</h2>
      ) : (
        <div className="overflow-hidden pb-1">
          <m.h2
            className="font-display text-4xl font-bold text-foam-white sm:text-5xl"
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
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
