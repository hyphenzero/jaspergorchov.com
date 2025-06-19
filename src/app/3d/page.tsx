'use client'

import { PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'

const SCENE_WIDTH = 50
const SCENE_HEIGHT = 7
const SCENE_DEPTH = 7
const CAMERA_Z = 2
const CAMERA_FOV = 90
const FLOOR_Y = -2
const CEILING_Y = 2

function Scene() {
  const { camera, viewport } = useThree()
  const scrollYRef = useRef(0)
  const [pixelsPerWorldUnit, setPixelsPerWorldUnit] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY
    }
    const updatePPWU = () => {
      const screenHeightPx = window.innerHeight
      const worldHeight = viewport.height
      setPixelsPerWorldUnit(screenHeightPx / worldHeight)
    }

    updatePPWU()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updatePPWU)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updatePPWU)
    }
  }, [viewport.height])

  useFrame(() => {
    camera.position.y = -scrollYRef.current / pixelsPerWorldUnit
  })

  return (
    <>
      {/* Floor - positioned so back edge touches back wall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, -SCENE_DEPTH + SCENE_DEPTH / 2]}>
        <planeGeometry args={[50, SCENE_DEPTH, 32, 16]} />
        <meshNormalMaterial wireframe />
      </mesh>

      {/* Ceiling - positioned so back edge touches back wall */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEILING_Y, -SCENE_DEPTH + SCENE_DEPTH / 2]}>
        <planeGeometry args={[50, SCENE_DEPTH, 32, 16]} />
        <meshNormalMaterial wireframe />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 0, -SCENE_DEPTH]}>
        <planeGeometry args={[50, CEILING_Y - FLOOR_Y, 32, 16]} />
        <meshNormalMaterial wireframe />
      </mesh>

      {/* Center Box */}
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[1, 1, 1, 8, 8, 8]} />
        <meshNormalMaterial wireframe />
      </mesh>
    </>
  )
}

export default function HomePage() {
  return (
    <>
      <div className="absolute fixed inset-0 -z-10 h-screen w-screen">
        <Canvas className="inset-0 h-screen w-screen" shadows>
          <PerspectiveCamera makeDefault position={[0, 0, CAMERA_Z]} fov={CAMERA_FOV} />
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <Scene />
        </Canvas>
      </div>

      <div className="relative min-h-screen w-full">
        {/* 3D Scene Masked to 100vh */}
        <div className="relative h-[calc(100vh-5.5rem)] w-full overflow-hidden sm:h-[calc(100vh-5.25rem)]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <h1 className="text-6xl font-medium text-white text-shadow-lg"></h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <main className="h-screen bg-zinc-900 px-4 py-20">
          <section className="mx-auto max-w-xl text-center">
            <p className="text-6xl">
						😎
            </p>
          </section>
        </main>
      </div>
    </>
  )
}
