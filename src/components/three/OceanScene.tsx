import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { WaterParticles } from './WaterParticles'
import { useEnv } from '@/hooks/useEnv'
import { damp } from '@/lib/utils'

// Fullscreen quad — the vertex outputs clip space directly (camera ignored).
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Deep-water gradient + flowing (domain-warped) currents + a cursor wake, all
// deepening as you scroll. This is the continuous "ocean" behind every section.
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uMouseVel;
  varying vec2 vUv;

  float hash(vec2 p){ p = fract(p * vec2(233.34, 851.73)); p += dot(p, p + 23.45); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = rot * p * 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);
    float md = distance(p, m);

    float t = uTime * 0.05;
    vec2 warp = vec2(fbm(p * 1.6 + vec2(0.0, t)), fbm(p * 1.6 + vec2(4.7, -t)));
    // cursor: a small, soft disturbance — deep water barely shows it
    float ripple = sin(md * 16.0 - uTime * 2.0) * exp(-md * 5.5);
    warp += (p - m) / (md + 0.001) * ripple * (0.02 + uMouseVel * 0.3);
    vec2 tang = vec2(-(p.y - m.y), p.x - m.x);
    warp += tang * exp(-md * 4.5) * uMouseVel * 0.22;
    float flow = fbm(p * 2.2 + warp * 1.4 + vec2(0.0, -t * 1.5));

    // scroll pushes us deeper; the surface light recedes
    // depth: 0 near the surface (top of page) → 1 in the abyss (scrolled down)
    float depth = clamp(uScroll, 0.0, 1.0);
    float light = 1.0 - depth * 0.88; // how much sunlight still reaches this depth

    vec3 abyssCol = vec3(0.003, 0.026, 0.038); // near-black deep ocean
    vec3 midCol = vec3(0.008, 0.08, 0.095);    // dark teal-green
    vec3 cyan = vec3(0.24, 0.95, 0.84);
    vec3 surface = vec3(0.32, 0.92, 0.74);

    vec3 col = mix(abyssCol, midCol, clamp(uv.y * 1.15, 0.0, 1.0));
    // caustics — clearly-moving light (this is what makes the water feel alive),
    // thinning out the deeper you sink
    col += cyan * pow(clamp(flow, 0.0, 1.0), 3.0) * 0.26 * light;
    float caustic2 = fbm(p * 3.6 + warp * 2.0 + vec2(t * 1.2, -t));
    col += cyan * pow(clamp(caustic2, 0.0, 1.0), 5.0) * 0.16 * light;
    // god rays from the surface, fading with depth
    float rays = 0.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i) * 1.7;
      float pos = 0.5 + sin(uTime * 0.05 + fi) * 0.4 + (fi - 3.4) * 0.14;
      rays += smoothstep(0.09, 0.0, abs(uv.x - pos + (1.0 - uv.y) * 0.12));
    }
    col += cyan * rays * smoothstep(0.05, 1.0, uv.y) * 0.05 * light;
    // surface sunlight, receding as you descend
    col += surface * smoothstep(0.72, 1.12, uv.y) * 0.1 * light;
    // small biolume halo around the cursor
    col += cyan * exp(-md * 5.0) * (0.06 + uMouseVel * 0.12) * (0.6 + 0.4 * sin(uTime * 1.0));
    // sink into darkness as you scroll down — drowning into the deep
    col *= mix(1.0, 0.26, depth);
    col *= 1.0 - 0.42 * pow(distance(uv, vec2(0.5)) * 1.3, 2.0);   // deep vignette

    gl_FragColor = vec4(col, 1.0);
  }
`

function OceanPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const size = useThree((s) => s.size)
  const target = useRef({ mx: 0.5, my: 0.5, scroll: 0, vel: 0, lastX: 0, lastY: 0 })
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uMouseVel: { value: 0 },
    }),
    [],
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - target.current.lastX
      const dy = e.clientY - target.current.lastY
      target.current.lastX = e.clientX
      target.current.lastY = e.clientY
      target.current.mx = e.clientX / window.innerWidth
      target.current.my = 1 - e.clientY / window.innerHeight
      target.current.vel = Math.min(1, target.current.vel + Math.hypot(dx, dy) / 180)
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target.current.scroll = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useFrame((_, delta) => {
    const mat = matRef.current
    if (!mat) return
    mat.uniforms.uTime.value += delta
    ;(mat.uniforms.uResolution.value as THREE.Vector2).set(size.width, size.height)
    const um = mat.uniforms.uMouse.value as THREE.Vector2
    um.x = damp(um.x, target.current.mx, 3, delta)
    um.y = damp(um.y, target.current.my, 3, delta)
    mat.uniforms.uScroll.value = damp(mat.uniforms.uScroll.value, target.current.scroll, 4, delta)
    target.current.vel *= Math.exp(-delta * 3.5)
    mat.uniforms.uMouseVel.value = damp(mat.uniforms.uMouseVel.value, target.current.vel, 8, delta)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

/** Persistent full-viewport ocean. Low DPR + adaptive; pauses when the tab is hidden. */
export function OceanScene() {
  const { pageVisible } = useEnv()
  return (
    <Canvas
      frameloop={pageVisible ? 'always' : 'never'}
      dpr={[0.55, 0.95]}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <PerformanceMonitor>
        <OceanPlane />
        <WaterParticles />
      </PerformanceMonitor>
      <AdaptiveDpr />
    </Canvas>
  )
}
