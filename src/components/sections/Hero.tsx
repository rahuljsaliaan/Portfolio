import { lazy, Suspense } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { hero, heroCtas, heroFocus } from '@/data/hero'
import { Button } from '@/components/ui/Button'
import { GlowText } from '@/components/ui/GlowText'
import { RotatingText } from '@/components/ui/RotatingText'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SceneBoundary } from '@/components/three/SceneBoundary'
import { useEnv } from '@/hooks/useEnv'
import { Z } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'

const HeroScene = lazy(() =>
  import('@/components/three/HeroScene').then((m) => ({ default: m.HeroScene })),
)

export function Hero() {
  const { reducedMotion } = useEnv()
  return (
    <section id="hero" className="relative flex min-h-dvh items-center overflow-hidden">
      {!reducedMotion ? (
        <SceneBoundary>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </SceneBoundary>
      ) : null}
      <div
        className="relative mx-auto w-full max-w-6xl px-6 py-32"
        style={{ zIndex: Z.content }}
      >
        <Stagger className="max-w-4xl">
          <StaggerItem>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-current-cyan sm:text-sm">
              {hero.eyebrow}
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="font-display text-[clamp(3.5rem,10vw,6.5rem)] font-bold leading-[0.95] tracking-tight text-foam-white">
              <GlowText>{hero.name}</GlowText>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-drift-gray sm:text-xl">
              {hero.subhead}
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-5 font-mono text-sm text-drift-gray">
              <span className="text-drift-gray/80">{heroFocus.label} </span>
              <RotatingText items={heroFocus.areas} className="text-current-cyan text-glow-cyan" />
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {heroCtas.map((cta) => (
                <Button
                  key={cta.target}
                  variant={cta.variant}
                  onClick={() => scrollToSection(cta.target)}
                  icon={cta.variant === 'ghost' ? Mail : undefined}
                  iconRight={cta.variant === 'primary' ? ArrowRight : undefined}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </StaggerItem>
        </Stagger>

        <div className="mt-20 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-drift-gray">
          <span>Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-current-cyan to-transparent" />
        </div>
      </div>
    </section>
  )
}
