import { lazy, Suspense } from 'react'
import { useEnv } from '@/hooks/useEnv'
import { SceneBoundary } from '@/components/three/SceneBoundary'

const OceanScene = lazy(() =>
  import('@/components/three/OceanScene').then((m) => ({ default: m.OceanScene })),
)

// The base gradient is always present: the pre-load look, the reduced-motion
// fallback, and the no-WebGL fallback (via SceneBoundary).
const GRADIENT =
  'radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--color-current-cyan) 9%, transparent), transparent 55%), linear-gradient(180deg, #08181f 0%, #05101a 46%, #02080e 100%)'

/** One continuous liquid ocean fixed behind every section. */
export function OceanBackground() {
  const { reducedMotion } = useEnv()
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }} aria-hidden={true}>
      <div className="absolute inset-0" style={{ background: GRADIENT }} />
      {reducedMotion ? null : (
        <SceneBoundary>
          <Suspense fallback={null}>
            <div className="absolute inset-0 animate-ocean-in">
              <OceanScene />
            </div>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  )
}
