import { lazy, Suspense } from 'react'
import { Section } from '@/components/layout/Section'
import { Card } from '@/components/ui/Card'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { SceneBoundary } from '@/components/three/SceneBoundary'
import { SceneFallback } from '@/components/three/SceneFallback'
import { achievementChips, stats } from '@/data/achievements'
import type { Accent, Stat } from '@/data/types'
import { useCountUp } from '@/hooks/useCountUp'
import { useEnv } from '@/hooks/useEnv'

const STAT_ACCENTS: Accent[] = ['cyan', 'seafoam', 'teal', 'violet']

const AchievementScene = lazy(() =>
  import('@/components/three/AchievementScene').then((m) => ({ default: m.AchievementScene })),
)

function StatCard({ stat, accent }: { stat: Stat; accent: Accent }) {
  const { ref, value } = useCountUp<HTMLDivElement>(stat.value)
  const suffix = stat.suffix ?? ''
  return (
    <Card accent={accent} interactive className="h-full p-6">
      <div
        ref={ref}
        className="font-mono text-4xl font-bold text-current-cyan text-glow-cyan sm:text-5xl"
      >
        {/* animating value hidden from SR; final value announced once */}
        <span aria-hidden={true}>
          {value}
          {suffix}
        </span>
        <span className="sr-only">
          {stat.value}
          {suffix}
        </span>
      </div>
      <p className="mt-2 text-sm text-drift-gray">{stat.label}</p>
    </Card>
  )
}

export function Achievements() {
  const { reducedMotion } = useEnv()
  return (
    <Section id="achievements">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Stagger className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((stat, i) => (
              <StaggerItem key={stat.label} className="h-full">
                <StatCard stat={stat} accent={STAT_ACCENTS[i % STAT_ACCENTS.length]} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-3">
              {achievementChips.map((chip) => (
                <Tag key={chip.label} variant="chip" icon={chip.icon}>
                  {chip.label}
                </Tag>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Second 3D moment — fresnel icosahedron, lazy + gracefully degrading. */}
        <div className="relative mx-auto aspect-square w-52 sm:w-64">
          <div className="absolute inset-0 rounded-full bg-current-cyan/10 blur-3xl" aria-hidden={true} />
          {reducedMotion ? (
            <SceneFallback />
          ) : (
            <SceneBoundary fallback={<SceneFallback />}>
              <Suspense fallback={<SceneFallback />}>
                <AchievementScene />
              </Suspense>
            </SceneBoundary>
          )}
        </div>
      </div>
    </Section>
  )
}
