import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { AbyssParticles } from './AbyssParticles'
import { useSceneActive } from '@/hooks/useSceneActive'
import { PARTICLES } from '@/lib/constants'

/**
 * Lazy-loaded hero particle field. Renders only while on-screen and the tab is
 * visible (frameloop pause), caps DPR, and adapts DPR down under load.
 */
export function HeroScene() {
  const { ref, active } = useSceneActive()
  return (
    <div ref={ref} className="absolute inset-0" style={{ zIndex: 6 }} aria-hidden={true}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, PARTICLES.dprCap]}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor>
          <AbyssParticles />
        </PerformanceMonitor>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
