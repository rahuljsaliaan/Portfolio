import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
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

    float t = uTime * 0.06;
    vec2 warp = vec2(fbm(p * 1.6 + vec2(0.0, t)), fbm(p * 1.6 + vec2(4.7, -t)));
    // cursor wake — rings radiating out, decaying with distance ("fish in water")
    float ripple = sin(md * 22.0 - uTime * 2.2) * exp(-md * 4.0);
    warp += (p - m) / (md + 0.001) * ripple * 0.05;
    float flow = fbm(p * 2.2 + warp * 1.4 + vec2(0.0, -t * 1.5));

    // scroll pushes us deeper; the surface light recedes
    float y = uv.y - uScroll * 0.35;
    vec3 abyss = vec3(0.031, 0.039, 0.071);
    vec3 deep = vec3(0.055, 0.078, 0.150);
    vec3 cyan = vec3(0.22, 0.95, 0.90);
    vec3 nebula = vec3(1.0, 0.42, 0.84);

    vec3 col = mix(abyss, deep, clamp(y * 1.1, 0.0, 1.0));
    col += cyan * pow(clamp(flow, 0.0, 1.0), 3.0) * 0.14;          // caustic light
    col += cyan * smoothstep(0.72, 1.05, y) * 0.06;               // surface glow
    col += cyan * exp(-md * 3.5) * 0.10 * (0.6 + 0.4 * sin(uTime * 1.5)); // biolume halo at cursor
    col += nebula * smoothstep(0.9, 1.1, uv.y) * (1.0 - uv.x) * 0.03;     // faint celestial corner
    col *= 1.0 - 0.32 * pow(distance(uv, vec2(0.5)) * 1.3, 2.0);   // vignette

    gl_FragColor = vec4(col, 1.0);
  }
`

function OceanPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const size = useThree((s) => s.size)
  const target = useRef({ mx: 0.5, my: 0.5, scroll: 0 })
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    }),
    [],
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.mx = e.clientX / window.innerWidth
      target.current.my = 1 - e.clientY / window.innerHeight
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
      dpr={[0.55, 0.9]}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      orthographic
      camera={{ position: [0, 0, 1] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <PerformanceMonitor>
        <OceanPlane />
      </PerformanceMonitor>
      <AdaptiveDpr />
    </Canvas>
  )
}
