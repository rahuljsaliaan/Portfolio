import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GRAPH } from '@/lib/constants'
import { damp } from '@/lib/utils'

// Node palette: mostly current-cyan, with living teal/seafoam and occasional
// violet / nebula-magenta pops (celestial). Core colour stays cyan.
const NODE_COLORS = [
  new THREE.Color('#38F2E5'),
  new THREE.Color('#5EF2C9'),
  new THREE.Color('#00BFA5'),
  new THREE.Color('#B388FF'),
  new THREE.Color('#FF6BD6'),
]
function pickColor(r: number) {
  if (r < 0.5) return NODE_COLORS[0]
  if (r < 0.72) return NODE_COLORS[1]
  if (r < 0.86) return NODE_COLORS[2]
  if (r < 0.96) return NODE_COLORS[3]
  return NODE_COLORS[4]
}
function nodeCount() {
  const w = window.innerWidth
  if (w < 640) return GRAPH.nodes.mobile
  if (w < 1024) return GRAPH.nodes.tablet
  return GRAPH.nodes.desktop
}

// Soft additive glow point, with a depth fade so far nodes dissolve (no hard cut).
const nodeVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uNear;
  uniform float uFar;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFade = 1.0 - clamp((-mv.z - uNear) / (uFar - uNear), 0.0, 1.0);
    gl_PointSize = aSize * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const nodeFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = pow(smoothstep(0.5, 0.0, d), 1.6);
    gl_FragColor = vec4(vColor, glow * vFade);
  }
`

interface GraphData {
  count: number
  basePositions: Float32Array
  positions: Float32Array
  sizes: Float32Array
  colors: Float32Array
  phases: Float32Array
  freqs: Float32Array
  amps: Float32Array
  edges: Uint16Array
  edgeCount: number
  edgePositions: Float32Array
  signals: { a: number; b: number; t: number; speed: number }[]
}

function buildGraph(count: number): GraphData {
  const clusters = [
    [-2.3, 0.7, 0.2],
    [2.1, -0.5, -0.7],
    [0.1, 1.7, 0.5],
    [0.5, -1.9, 0.3],
  ]
  const basePositions = new Float32Array(count * 3)
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const freqs = new Float32Array(count)
  const amps = new Float32Array(count)
  const pts: THREE.Vector3[] = []

  for (let i = 0; i < count; i++) {
    const c = clusters[i % clusters.length]
    const x = c[0] + (Math.random() - 0.5) * 2.6
    const y = c[1] + (Math.random() - 0.5) * 2.3
    const z = c[2] + (Math.random() - 0.5) * 1.8
    basePositions[i * 3] = x
    basePositions[i * 3 + 1] = y
    basePositions[i * 3 + 2] = z
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    pts.push(new THREE.Vector3(x, y, z))
    const col = pickColor(Math.random())
    colors[i * 3] = col.r
    colors[i * 3 + 1] = col.g
    colors[i * 3 + 2] = col.b
    sizes[i] = 0.6 + Math.random() * 1.0
    phases[i] = Math.random() * Math.PI * 2
    freqs[i] = 0.35 + Math.random() * 0.4
    amps[i] = 0.12 + Math.random() * 0.16
  }

  // connect each node to its 2–3 nearest neighbours
  const edgeList: number[] = []
  const seen = new Set<string>()
  for (let i = 0; i < count; i++) {
    const d: [number, number][] = []
    for (let j = 0; j < count; j++) if (j !== i) d.push([j, pts[i].distanceToSquared(pts[j])])
    d.sort((a, b) => a[1] - b[1])
    const k = 2 + (Math.random() < 0.35 ? 1 : 0)
    for (let n = 0; n < Math.min(k, d.length); n++) {
      const j = d[n][0]
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!seen.has(key)) {
        seen.add(key)
        edgeList.push(i, j)
      }
    }
  }
  const edges = Uint16Array.from(edgeList)
  const edgeCount = edgeList.length / 2
  const edgePositions = new Float32Array(edgeCount * 6)
  for (let e = 0; e < edgeCount; e++) {
    const a = edges[e * 2] * 3
    const b = edges[e * 2 + 1] * 3
    const o = e * 6
    edgePositions[o] = basePositions[a]
    edgePositions[o + 1] = basePositions[a + 1]
    edgePositions[o + 2] = basePositions[a + 2]
    edgePositions[o + 3] = basePositions[b]
    edgePositions[o + 4] = basePositions[b + 1]
    edgePositions[o + 5] = basePositions[b + 2]
  }

  // signal packets — half travel each direction (the two-currents duality)
  const signals = Array.from({ length: GRAPH.signals }, (_, i) => {
    const e = Math.floor(Math.random() * edgeCount)
    return {
      a: edges[e * 2],
      b: edges[e * 2 + 1],
      t: Math.random(),
      speed: (0.18 + Math.random() * 0.22) * (i % 2 === 0 ? 1 : -1),
    }
  })

  return { count, basePositions, positions, sizes, colors, phases, freqs, amps, edges, edgeCount, edgePositions, signals }
}

function GraphBody() {
  const data = useMemo(() => buildGraph(nodeCount()), [])
  const nodesRef = useRef<THREE.Points>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const signalsRef = useRef<THREE.Points>(null)
  const signalPositions = useMemo(() => new Float32Array(data.signals.length * 3), [data])
  const uniforms = useMemo(() => ({ uNear: { value: 8 }, uFar: { value: 22 } }), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const { positions, basePositions, phases, freqs, amps, count } = data

    for (let i = 0; i < count; i++) {
      const o = i * 3
      const ph = phases[i]
      const f = freqs[i]
      const a = amps[i]
      positions[o] = basePositions[o] + Math.sin(t * f + ph) * a
      positions[o + 1] = basePositions[o + 1] + Math.cos(t * f * 0.9 + ph) * a
      positions[o + 2] = basePositions[o + 2] + Math.sin(t * f * 0.7 + ph * 1.3) * a
    }
    if (nodesRef.current) {
      ;(nodesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    }

    const ep = data.edgePositions
    for (let e = 0; e < data.edgeCount; e++) {
      const a = data.edges[e * 2] * 3
      const b = data.edges[e * 2 + 1] * 3
      const o = e * 6
      ep[o] = positions[a]
      ep[o + 1] = positions[a + 1]
      ep[o + 2] = positions[a + 2]
      ep[o + 3] = positions[b]
      ep[o + 4] = positions[b + 1]
      ep[o + 5] = positions[b + 2]
    }
    if (edgesRef.current) {
      ;(edgesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    }

    for (let i = 0; i < data.signals.length; i++) {
      const s = data.signals[i]
      s.t += s.speed * delta
      if (s.t > 1 || s.t < 0) {
        const e = Math.floor(Math.random() * data.edgeCount)
        s.a = data.edges[e * 2]
        s.b = data.edges[e * 2 + 1]
        s.t = s.t > 1 ? s.t - 1 : s.t + 1
      }
      const a = s.a * 3
      const b = s.b * 3
      const o = i * 3
      signalPositions[o] = positions[a] + (positions[b] - positions[a]) * s.t
      signalPositions[o + 1] = positions[a + 1] + (positions[b + 1] - positions[a + 1]) * s.t
      signalPositions[o + 2] = positions[a + 2] + (positions[b + 2] - positions[a + 2]) * s.t
    }
    if (signalsRef.current) {
      ;(signalsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    }
  })

  return (
    <group>
      <lineSegments ref={edgesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#38F2E5"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <points ref={nodesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={nodeVertex}
          fragmentShader={nodeFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={signalsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[signalPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          sizeAttenuation
          color="#e6f1ff"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  )
}

function Starfield() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const n = 480
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 20 + Math.random() * 26
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi) - 12
    }
    return arr
  }, [])
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.006
  })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        sizeAttenuation
        color="#cfe6ff"
        transparent
        opacity={0.7}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

function Bubbles() {
  const count = 24
  const ref = useRef<THREE.Points>(null)
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      speeds[i] = 0.25 + Math.random() * 0.5
    }
    return { positions, speeds }
  }, [])
  useFrame((_, delta) => {
    const pts = ref.current
    if (!pts) return
    const pos = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * delta
      if (y > 5) y = -5
      pos.setY(i, y)
      pos.setX(i, pos.getX(i) + Math.sin((y + i) * 0.6) * 0.0015)
    }
    pos.needsUpdate = true
  })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        sizeAttenuation
        color="#7ff2e5"
        transparent
        opacity={0.32}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

/** The hero centerpiece: a knowledge graph drifting in deep water. */
export function KnowledgeGraph() {
  const tiltRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.045
    const tilt = tiltRef.current
    if (tilt) {
      tilt.rotation.y = damp(tilt.rotation.y, state.pointer.x * 0.4, 2.5, delta)
      tilt.rotation.x = damp(tilt.rotation.x, -state.pointer.y * 0.28, 2.5, delta)
    }
  })

  return (
    <group ref={tiltRef}>
      <Starfield />
      <group ref={spinRef}>
        <GraphBody />
      </group>
      <Bubbles />
    </group>
  )
}
