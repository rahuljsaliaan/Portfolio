import { useEnv } from '@/hooks/useEnv'
import { cn } from '@/lib/utils'

/** Subtle caustic light — static fractal noise tinted cyan, drifting via cheap transform. */
function Caustics({ animate }: { animate: boolean }) {
  return (
    <svg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={cn(
        'absolute inset-0 h-full w-full opacity-[0.05] mix-blend-screen',
        animate && 'animate-caustic-drift',
      )}
    >
      <filter id="caustic-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01 0.018"
          numOctaves="2"
          seed="8"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.22  0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0.6 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#caustic-noise)" />
    </svg>
  )
}

/**
 * Fixed backmost atmosphere: a surface-light → abyss depth gradient plus a faint
 * caustic shimmer. Sits behind the parallax blobs and all content.
 */
export function Atmosphere() {
  const { reducedMotion } = useEnv()
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: -2 }} aria-hidden={true}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--color-current-cyan) 8%, transparent), transparent 55%), linear-gradient(180deg, #12172a 0%, #0f111a 46%, var(--color-abyss-deep) 100%)',
        }}
      />
      <Caustics animate={!reducedMotion} />
    </div>
  )
}
