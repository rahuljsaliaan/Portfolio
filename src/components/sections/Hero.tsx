import { lazy, Suspense } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { hero, heroCtas } from '@/data/hero'
import { Button } from '@/components/ui/Button'
import { GlowText } from '@/components/ui/GlowText'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SceneBoundary } from '@/components/three/SceneBoundary'
import { useEnv } from '@/hooks/useEnv'
import { Z } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'

const HeroScene = lazy(() =>
  import('@/components/three/HeroScene').then((m) => ({ default: m.HeroScene })),
)

/** Decorative deep-sea glow — also the fallback behind the 3D scene (added later). */
function HeroBackground() {
  return (
    <div aria-hidden={true} className="pointer-events-none absolute inset-0" style={{ zIndex: Z.decor }}>
      <div className="absolute left-1/4 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-current-cyan/10 blur-[120px]" />
      <div className="absolute right-1/4 top-1/2 h-[32rem] w-[32rem] rounded-full bg-jelly-violet/10 blur-[120px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ocean-abyss" />
    </div>
  )
}

export function Hero() {
  const { reducedMotion } = useEnv()
  return (
    <section id="hero" className="relative flex min-h-dvh items-center overflow-hidden">
      <HeroBackground />
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
