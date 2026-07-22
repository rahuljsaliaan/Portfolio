import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { KnowledgeGraph } from './KnowledgeGraph'
import { useSceneActive } from '@/hooks/useSceneActive'
import { GRAPH } from '@/lib/constants'

// Fades the canvas into the abyss toward the edges so the graph never "cuts".
const MASK = 'radial-gradient(ellipse 74% 74% at 64% 46%, #000 50%, transparent 92%)'

/**
 * Lazy-loaded hero: a knowledge graph drifting in deep water. Renders only while
 * on-screen and the tab is visible, caps DPR, and adapts DPR down under load.
 */
export function HeroScene() {
  const { ref, active } = useSceneActive()
  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{ zIndex: 6, maskImage: MASK, WebkitMaskImage: MASK }}
      aria-hidden={true}
    >
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, GRAPH.dprCap]}
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor>
          <KnowledgeGraph />
        </PerformanceMonitor>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
