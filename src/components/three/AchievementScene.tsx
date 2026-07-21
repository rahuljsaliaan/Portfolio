import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneActive } from '@/hooks/useSceneActive'
import { PARTICLES } from '@/lib/constants'

const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), uPower);
    gl_FragColor = vec4(uColor * f, f);
  }
`

function Icosahedron() {
  const groupRef = useRef<THREE.Group>(null)
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color('#38F2E5') }, uPower: { value: 2.4 } }),
    [],
  )

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.25
    groupRef.current.rotation.x += delta * 0.1
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.4, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh scale={1.02}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color="#38F2E5" wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

/** Lazy-loaded fresnel-glow icosahedron for the Achievements section. */
export function AchievementScene() {
  const { ref, active } = useSceneActive()
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden={true}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, PARTICLES.dprCap]}
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Icosahedron />
      </Canvas>
    </div>
  )
}
