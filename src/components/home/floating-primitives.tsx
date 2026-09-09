'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type PrimitiveKind = 'box' | 'cone' | 'icosahedron' | 'torus' | 'torusKnot'

type FloatingPrimitiveProps = {
  color: string
  kind: PrimitiveKind
  position: [number, number]
  rotation: [number, number, number]
  scale: number
  speed: [number, number, number]
}

const primitives: FloatingPrimitiveProps[] = [
  {
    color: '#fb923c',
    kind: 'torusKnot',
    position: [-0.43, 0.34],
    rotation: [0.4, -0.5, 0.2],
    scale: 0.72,
    speed: [0.035, 0.055, -0.02],
  },
  {
    color: '#fdba74',
    kind: 'icosahedron',
    position: [0.44, 0.31],
    rotation: [-0.2, 0.5, -0.3],
    scale: 0.66,
    speed: [-0.045, 0.025, 0.035],
  },
  {
    color: '#f97316',
    kind: 'torus',
    position: [-0.45, -0.31],
    rotation: [0.7, 0.1, -0.25],
    scale: 0.58,
    speed: [0.02, -0.045, 0.03],
  },
  {
    color: '#fed7aa',
    kind: 'cone',
    position: [0.45, -0.28],
    rotation: [-0.25, -0.45, 0.35],
    scale: 0.6,
    speed: [-0.03, -0.035, -0.02],
  },
  {
    color: '#fb923c',
    kind: 'box',
    position: [0.39, 0.02],
    rotation: [0.35, 0.5, 0.15],
    scale: 0.42,
    speed: [0.025, -0.04, 0.02],
  },
]

function Geometry({ kind }: { kind: PrimitiveKind }) {
  switch (kind) {
    case 'box':
      return <boxGeometry args={[1.35, 1.35, 1.35]} />
    case 'cone':
      return <coneGeometry args={[0.9, 1.7, 48]} />
    case 'icosahedron':
      return <icosahedronGeometry args={[1, 1]} />
    case 'torus':
      return <torusGeometry args={[0.8, 0.32, 32, 64]} />
    case 'torusKnot':
      return <torusKnotGeometry args={[0.72, 0.25, 128, 24]} />
  }
}

function FloatingPrimitive({
  color,
  kind,
  position,
  rotation,
  scale,
  speed,
  reducedMotion,
}: FloatingPrimitiveProps & { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const viewport = useThree((state) => state.viewport)
  const isNarrow = viewport.width < 8
  const edgeInset = isNarrow ? 0.48 : 0.42
  const x = Math.sign(position[0]) * viewport.width * edgeInset
  const y = position[1] * viewport.height

  useFrame((_, delta) => {
    if (!meshRef.current || reducedMotion) return

    meshRef.current.rotation.x += speed[0] * delta
    meshRef.current.rotation.y += speed[1] * delta
    meshRef.current.rotation.z += speed[2] * delta
  })

  return (
    <mesh ref={meshRef} position={[x, y, 0]} rotation={rotation} scale={scale * (isNarrow ? 0.72 : 1)} castShadow>
      <Geometry kind={kind} />
      <meshStandardMaterial color={color} metalness={0.28} roughness={0.32} />
    </mesh>
  )
}

function Scene() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const viewport = useThree((state) => state.viewport)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 7]} intensity={3.2} />
      <directionalLight position={[-5, -2, 4]} color="#ffedd5" intensity={1.8} />
      {primitives.map((primitive) => {
        if (viewport.width < 8 && (primitive.kind === 'box' || primitive.kind === 'torus')) return null

        return <FloatingPrimitive key={primitive.kind} {...primitive} reducedMotion={reducedMotion} />
      })}
    </>
  )
}

export function FloatingPrimitives() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 82, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
