import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { damp } from '@/lib/utils'

// Round soft particle that brightens + swells as the cursor's light passes over it.
// (The physical push is done in JS so it *advects* — particles stay where they're
// shoved instead of snapping back.)
const vertexShader = /* glsl */ `
  uniform vec2 uMouse;
  uniform float uSize;
  uniform float uAspect;
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    float d = distance(vec2(ndc.x * uAspect, ndc.y), vec2(uMouse.x * uAspect, uMouse.y));
    vGlow = smoothstep(0.45, 0.0, d);
    gl_PointSize = uSize * (1.0 + vGlow * 0.7) * (300.0 / -mv.z);
    gl_Position = clip;
  }
`
const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vGlow;
  void main() {
    float dd = length(gl_PointCoord - 0.5);
    if (dd > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, dd);
    gl_FragColor = vec4(uColor, soft * uOpacity * (1.0 + vGlow * 2.2));
  }
`

interface LayerProps {
  count: number
  color: string
  size: number
  opacity: number
  dir: 1 | -1 // +1 rises (bubbles), -1 sinks (dust)
  speedBase: number
  speedVar: number
  depthRef: MutableRefObject<number>
  mouseRef: MutableRefObject<THREE.Vector2>
  velRef: MutableRefObject<number>
}

function Layer({
  count,
  color,
  size,
  opacity,
  dir,
  speedBase,
  speedVar,
  depthRef,
  mouseRef,
  velRef,
}: LayerProps) {
  const ref = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const viewSize = useThree((s) => s.size)
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), dir: new THREE.Vector3() }), [])
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
  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: size },
      uAspect: { value: 1 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [size, color, opacity],
  )

  useFrame((state, delta) => {
    const pts = ref.current
    const mat = matRef.current
    if (!pts || !mat) return

    // smooth cursor (NDC) for the glow
    const um = mat.uniforms.uMouse.value as THREE.Vector2
    um.x = damp(um.x, mouseRef.current.x, 6, delta)
    um.y = damp(um.y, mouseRef.current.y, 6, delta)

    // project the cursor onto the z=0 plane for the world-space push
    const cam = state.camera
    tmp.v.set(um.x, um.y, 0.5).unproject(cam)
    tmp.dir.copy(tmp.v).sub(cam.position).normalize()
    tmp.v.copy(cam.position).addScaledVector(tmp.dir, -cam.position.z / tmp.dir.z)
    const mwx = tmp.v.x
    const mwy = tmp.v.y
    const vel = velRef.current

    const pos = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i)
      // steady drift
      y += dir * speeds[i] * delta
      x += Math.sin(t * 0.15 + i) * 0.0009
      // persistent liquid push: shove + swirl aside, and it stays (advection)
      if (vel > 0.002) {
        const dx = x - mwx
        const dy = y - mwy
        const dw = Math.sqrt(dx * dx + dy * dy) + 0.0001
        if (dw < 4) {
          const infl = 1 - dw / 4
          const s = infl * infl * vel * 4.5 * delta
          const nx = dx / dw
          const ny = dy / dw
          x += (nx * 0.7 - ny * 0.55) * s
          y += (ny * 0.7 + nx * 0.55) * s
        }
      }
      // wrap so the field stays populated after being pushed around
      if (y > 8) y = -8
      else if (y < -8) y = 8
      if (x > 12) x = -12
      else if (x < -12) x = 12
      pos.setX(i, x)
      pos.setY(i, y)
    }
    pos.needsUpdate = true

    mat.uniforms.uAspect.value = viewSize.width / viewSize.height
    mat.uniforms.uOpacity.value = damp(
      mat.uniforms.uOpacity.value,
      opacity * (1 - depthRef.current * 0.85),
      3,
      delta,
    )
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
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

/** Persistent bubbles (rising) + fine dust (sinking) across every section — they glow
 *  and are shoved aside (and stay) where the cursor moves, thinning out the deeper you sink. */
export function WaterParticles() {
  const depth = useRef(0)
  const mouse = useRef(new THREE.Vector2(0, 0))
  const vel = useRef(0)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      depth.current = max > 0 ? Math.min(1, window.scrollY / max) : 0
    }
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current.x = e.clientX
      last.current.y = e.clientY
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      )
      vel.current = Math.min(1, vel.current + Math.hypot(dx, dy) / 280)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  useFrame((_, delta) => {
    vel.current *= Math.exp(-delta * 3)
  })

  return (
    <>
      <Layer count={34} color="#78dcf2" size={0.38} opacity={0.26} dir={1} speedBase={0.12} speedVar={0.24} depthRef={depth} mouseRef={mouse} velRef={vel} />
      <Layer count={55} color="#bfeef0" size={0.24} opacity={0.13} dir={-1} speedBase={0.04} speedVar={0.08} depthRef={depth} mouseRef={mouse} velRef={vel} />
    </>
  )
}
