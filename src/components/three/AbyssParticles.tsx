import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PARTICLES } from '@/lib/constants'
import { damp } from '@/lib/utils'

// One THREE.Points, one BufferGeometry, one draw call. Drift + mouse parallax
// happen entirely in the vertex shader (uMouse uniform) — zero per-frame React.
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  attribute float aScale;
  varying float vDepth;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.2 + position.x * 0.5) * 0.15;
    p.x += cos(uTime * 0.15 + position.z * 0.5) * 0.15;
    float depth = clamp((p.z + 5.0) / 10.0, 0.0, 1.0);
    p.xy += uMouse * depth * 0.6;
    vDepth = depth;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * aScale * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vDepth;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorA, uColorB, vDepth);
    gl_FragColor = vec4(color, glow * 0.9);
  }
`

function pickCount() {
  const w = window.innerWidth
  if (w < 640) return PARTICLES.count.mobile
  if (w < 1024) return PARTICLES.count.tablet
  return PARTICLES.count.desktop
}

export function AbyssParticles() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const mouse = useRef(new THREE.Vector2(0, 0))
  const count = useMemo(() => pickCount(), [])

  const { positions, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      scales[i] = 0.5 + Math.random()
    }
    return { positions, scales }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 20 },
      uColorA: { value: new THREE.Color('#38F2E5') },
      uColorB: { value: new THREE.Color('#00BFA5') },
    }),
    [],
  )

  useFrame((state, delta) => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uTime.value += delta
    mouse.current.x = damp(mouse.current.x, state.pointer.x, 3, delta)
    mouse.current.y = damp(mouse.current.y, state.pointer.y, 3, delta)
    material.uniforms.uMouse.value.copy(mouse.current)
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
