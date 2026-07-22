import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getCircleTexture } from './circleTexture'
import { damp } from '@/lib/utils'

interface LayerProps {
  count: number
  color: string
  size: number
  opacity: number
  dir: 1 | -1 // +1 rises (bubbles), -1 sinks (dust)
  speedBase: number
  speedVar: number
  depthRef: MutableRefObject<number>
}

function Layer({ count, color, size, opacity, dir, speedBase, speedVar, depthRef }: LayerProps) {
  const ref = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const circle = useMemo(() => getCircleTexture(), [])
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      speeds[i] = speedBase + Math.random() * speedVar
    }
    return { positions, speeds }
  }, [count, speedBase, speedVar])

  useFrame((state, delta) => {
    const pts = ref.current
    if (!pts) return
    const pos = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + dir * speeds[i] * delta
      if (dir > 0 && y > 8) y = -8
      else if (dir < 0 && y < -8) y = 8
      pos.setY(i, y)
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.15 + i) * 0.0009)
    }
    pos.needsUpdate = true
    // thin out the deeper you sink
    if (matRef.current) {
      matRef.current.opacity = damp(
        matRef.current.opacity,
        opacity * (1 - depthRef.current * 0.85),
        3,
        delta,
      )
    }
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={circle}
        size={size}
        sizeAttenuation
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

/** Persistent bubbles (rising) + fine dust (sinking) across every section, thinning with depth. */
export function WaterParticles() {
  const depth = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      depth.current = max > 0 ? Math.min(1, window.scrollY / max) : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      <Layer count={38} color="#7ff2e5" size={0.11} opacity={0.34} dir={1} speedBase={0.12} speedVar={0.24} depthRef={depth} />
      <Layer count={90} color="#bfeef0" size={0.08} opacity={0.2} dir={-1} speedBase={0.04} speedVar={0.08} depthRef={depth} />
    </>
  )
}
