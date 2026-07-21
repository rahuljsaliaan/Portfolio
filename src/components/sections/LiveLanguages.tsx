import { m } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import type { LanguageStat } from '@/data/types'
import { useEnv } from '@/hooks/useEnv'
import { useWakatime, type WakatimeStatus } from '@/hooks/useWakatime'
import { EASE_LIQUID } from '@/lib/constants'
import { cn } from '@/lib/utils'

const SURFACE =
  'absolute inset-x-0 -top-0.5 h-1.5 rounded-full bg-current-cyan/90 shadow-[0_0_10px_var(--color-current-cyan)]'
const LIQUID = 'absolute inset-x-0 bottom-0 rounded-t-full bg-gradient-to-t from-biolume-teal to-current-cyan'

function LanguageTank({ lang, delay }: { lang: LanguageStat; delay: number }) {
  const { reducedMotion } = useEnv()
  const fill = Math.max(5, Math.min(100, lang.percent))
  return (
    <div className="flex w-14 flex-col items-center gap-2 sm:w-[4.5rem]">
      <div className="relative h-32 w-9 overflow-hidden rounded-full border border-current-cyan/20 bg-ocean-abyss/50 sm:h-40 sm:w-11">
        {reducedMotion ? (
          <div className={LIQUID} style={{ height: `${fill}%` }}>
            <div className={SURFACE} />
          </div>
        ) : (
          <m.div
            className={LIQUID}
            initial={{ height: 0 }}
            whileInView={{ height: `${fill}%` }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: EASE_LIQUID, delay }}
          >
            <div className={cn(SURFACE, 'animate-surface-bob')} />
          </m.div>
        )}
      </div>
      <span className="font-mono text-[11px] text-current-cyan">{Math.round(lang.percent)}%</span>
      <span className="max-w-[4.5rem] text-center font-mono text-[11px] leading-tight text-foam-white/85">
        {lang.name}
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status: WakatimeStatus }) {
  const live = status === 'live'
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-drift-gray">
      <span
        className={cn(
          'size-2 rounded-full',
          live
            ? 'animate-pulse bg-biolume-teal shadow-[0_0_8px_var(--color-biolume-teal)]'
            : 'bg-drift-gray/60',
        )}
      />
      {live ? 'live · WakaTime' : 'sample'}
    </span>
  )
}

/** Live coding-language mix as liquid-filling tanks. */
export function LiveLanguages() {
  const { languages, status } = useWakatime()
  return (
    <Reveal className="mb-6">
      <Card accent="cyan" className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-foam-white">Recently coding</h3>
          <StatusBadge status={status} />
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-7">
          {languages.map((lang, i) => (
            <LanguageTank key={lang.name} lang={lang} delay={i * 0.08} />
          ))}
        </div>
      </Card>
    </Reveal>
  )
}
