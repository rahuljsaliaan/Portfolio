import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { TechGlyph } from '@/components/ui/TechGlyph'
import type { LanguageStat } from '@/data/types'
import { useCountUp } from '@/hooks/useCountUp'
import { useWakatime, type WakatimeStatus } from '@/hooks/useWakatime'
import { techIcon } from '@/lib/techIcons'
import { cn } from '@/lib/utils'

function LanguageStatTile({ lang }: { lang: LanguageStat }) {
  const { ref, value } = useCountUp<HTMLDivElement>(lang.hours)
  const icon = techIcon(lang.name)
  return (
    <div className="flex min-w-[5rem] flex-col items-center gap-2 text-center">
      {icon ? (
        <TechGlyph icon={icon} className="size-7" />
      ) : (
        <span
          aria-hidden={true}
          className="size-4 rounded-full"
          style={{ backgroundColor: lang.color ?? 'var(--color-current-cyan)' }}
        />
      )}
      <div
        ref={ref}
        className="font-mono text-2xl font-bold text-current-cyan text-glow-cyan sm:text-3xl"
      >
        <span aria-hidden={true}>{value}</span>
        <span className="ml-0.5 text-sm font-normal text-drift-gray">h</span>
        <span className="sr-only">{lang.hours} hours</span>
      </div>
      <div className="font-mono text-xs text-foam-white/85">{lang.name}</div>
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

/** "Recently coding" — logo + hours invested per language (never a percentage/loader). */
export function LiveLanguages() {
  const { languages, status } = useWakatime()
  return (
    <Reveal className="mb-6">
      <Card accent="cyan" className="p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-foam-white">Recently coding</h3>
          <StatusBadge status={status} />
        </div>
        <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-7 sm:gap-x-12">
          {languages.map((lang) => (
            <LanguageStatTile key={lang.name} lang={lang} />
          ))}
        </div>
      </Card>
    </Reveal>
  )
}
