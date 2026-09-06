'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    meshRef.current.rotation.x += delta * 0.08
    meshRef.current.rotation.y += delta * 0.13
  })

  return (
    <mesh ref={meshRef} position={[0, -0.28, 0]} rotation={[0.35, -0.5, 0]} scale={1.18}>
      <torusKnotGeometry args={[0.72, 0.24, 128, 24]} />
      <meshStandardMaterial color="#fb923c" metalness={0.2} roughness={0.32} />
    </mesh>
  )
}

function ThreeDScene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 5]} intensity={2.6} />
      <directionalLight position={[-4, 1, 3]} intensity={1.2} color="#ffedd5" />
      <TorusKnot />
    </>
  )
}

export function ThreeDWindowMockup() {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-3/5 overflow-hidden rounded-t-xl bg-zinc-50 p-3 ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
        <div className="flex items-center gap-1.5 border-b border-zinc-950/10 pb-2 dark:border-white/10">
          <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="ml-auto h-2 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="mt-3 grid h-full grid-cols-[0.7fr_1.5fr] gap-3">
          <div className="space-y-2">
            <div className="h-6 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-6 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-6 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="rounded bg-white dark:bg-zinc-950" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 -top-4 bottom-0 z-10">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 36 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
          <ThreeDScene />
        </Canvas>
      </div>
    </div>
  )
}
