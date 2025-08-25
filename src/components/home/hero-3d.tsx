'use client'

import { PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const SCENE_DEPTH = 4
const CAMERA_Z = 2
const CAMERA_FOV = 90
const FLOOR_Y = -2
const CEILING_Y = 2

function Floor({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, FLOOR_Y, -SCENE_DEPTH + SCENE_DEPTH / 2]}
      receiveShadow
      ref={meshRef}
    >
      <planeGeometry args={[50, SCENE_DEPTH, 128, 128]} />
      <meshPhysicalMaterial color={color} metalness={0} roughness={1} />
    </mesh>
  )
}

function AnimatedLight() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (lightRef.current) {
      // Move light back and forth along X axis
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime) * 3
    }
  })

  return <pointLight ref={lightRef} position={[0, 0, -3]} intensity={12} color="white" distance={10} castShadow />
}

// BMW model removed — replaced with theme-aware walls/floor/ceiling colors

function Scene() {
  const { camera, viewport, gl } = useThree()
  const scrollYRef = useRef(0)
  const [pixelsPerWorldUnit, setPixelsPerWorldUnit] = useState(1)
  const [colorHex, setColorHex] = useState('#111827')
  const initialScreenYRef = useRef<number | null>(null)
  const initialCameraYRef = useRef<number | null>(null)
  const initialScrollYRef = useRef<number>(0)
  const closestPoint = new THREE.Vector3(0, FLOOR_Y, 0) // front edge of floor (z = 0)

  useLayoutEffect(() => {
    const updatePPWU = () => {
      const screenHeightPx = (gl && (gl.domElement as HTMLCanvasElement)?.clientHeight) || window.innerHeight
      const worldHeight = viewport.height
      setPixelsPerWorldUnit(screenHeightPx / worldHeight)
    }

    const handleScroll = () => {
      scrollYRef.current = window.scrollY
    }

    updatePPWU()
    handleScroll()

    // Set initial theme color and watch for changes
    const getColor = () => {
      const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      return dark ? '#18181b' : '#f3f4f6'
    }

    setColorHex(getColor())
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
    const onMQChange = () => setColorHex(getColor())
    mq && mq.addEventListener && mq.addEventListener('change', onMQChange)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updatePPWU)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updatePPWU)
      mq && mq.removeEventListener && mq.removeEventListener('change', onMQChange)
    }
  }, [viewport.height])

  // Helper: project a world point to screen Y in pixels relative to the renderer canvas (top = 0)
  const projectScreenY = (cam: THREE.Camera, point: THREE.Vector3) => {
    // make sure camera matrices are current
    if (typeof (cam as any).updateMatrixWorld === 'function') (cam as any).updateMatrixWorld()
    if (typeof (cam as any).updateProjectionMatrix === 'function') (cam as any).updateProjectionMatrix()
    const p = point.clone()
    p.project(cam)
    // prefer renderer canvas height when available (canvas may be fixed at 1000px)
    const canvasH = (gl && (gl.domElement as HTMLCanvasElement)?.clientHeight) || window.innerHeight
    // NDC y -> pixel y (0 top) relative to canvas
    return ((1 - p.y) / 2) * canvasH
  }

  useLayoutEffect(() => {
    // record starting values so we can make the front edge track page scroll exactly
    const setInitials = () => {
      try {
        initialScreenYRef.current = projectScreenY(camera, closestPoint)
        initialCameraYRef.current = camera.position.y
        // explicitly treat the initial page scroll as 0 so the scene starts from the top
        initialScrollYRef.current = 0
      } catch (e) {
        // ignore; leave null and fallback to old behavior
        initialScreenYRef.current = null
        initialCameraYRef.current = null
      }
    }

    setInitials()
    // recompute when renderer size changes
    window.addEventListener('resize', setInitials)
    return () => window.removeEventListener('resize', setInitials)
  }, [camera, gl])

  useFrame(() => {
    const scrollY = scrollYRef.current

    // If we couldn't initialize, fall back to previous mapping
    if (initialScreenYRef.current === null || initialCameraYRef.current === null) {
      camera.position.y = -scrollY / pixelsPerWorldUnit
      return
    }

    // convert window scroll pixels to canvas pixels so the canvas projection matches page scroll
    const canvasH = (gl && (gl.domElement as HTMLCanvasElement)?.clientHeight) || window.innerHeight
    const scrollToCanvasScale = canvasH / window.innerHeight
    const deltaScroll = scrollY - (initialScrollYRef.current || 0)
    const targetScreenY = (initialScreenYRef.current ?? 0) - deltaScroll * scrollToCanvasScale

    // Exact per-pixel mapping: compute how many world units the camera must move
    // per 1 pixel of canvas scroll so the world point moves 1:1 with the scroll.
    // Derived: worldUnitsPerPixel = (2 * tan(fov/2) * v_z) / canvasHeight
    const camP = camera as THREE.PerspectiveCamera
    const fovRad = ((camP.fov ?? CAMERA_FOV) * Math.PI) / 180
    const t = Math.tan(fovRad / 2)

    const py = closestPoint.y
    const pz = closestPoint.z
    const camZ = camP.position.z

    // signed distance from camera to point along Z (can be negative if in front)
    const v_z = pz - camZ

    // number of world units the camera must move for 1 canvas pixel of movement
    const worldUnitsPerPixel = (2 * t * v_z) / (canvasH || 1)

    // apply delta scroll (in canvas pixels) to compute new camera Y
    const initialCamY = initialCameraYRef.current ?? camP.position.y
    let desiredCamY = initialCamY + deltaScroll * worldUnitsPerPixel

    // clamp to avoid extreme moves that can push objects behind the camera
    const worldH = viewport.height || 1
    const minCamY = initialCamY - worldH * 3
    const maxCamY = initialCamY + worldH * 3
    desiredCamY = Math.max(minCamY, Math.min(maxCamY, desiredCamY))

    camera.position.y = desiredCamY
  })

  return (
    <>
      {/* Floor */}
      <Floor color={colorHex} />

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEILING_Y, -SCENE_DEPTH + SCENE_DEPTH / 2]}>
        <planeGeometry args={[50, SCENE_DEPTH, 32, 16]} />
        <meshPhysicalMaterial color={colorHex} metalness={0} roughness={1} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 0, -SCENE_DEPTH]}>
        <planeGeometry args={[50, CEILING_Y - FLOOR_Y, 32, 16]} />
        <meshPhysicalMaterial color={colorHex} metalness={0} roughness={1} />
      </mesh>
    </>
  )
}

export function Hero3D() {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div data-hero3d-wrapper className="fixed top-0 left-0 -z-10 h-[1000px] w-screen overflow-hidden">
        <Canvas frameloop="always" className="absolute inset-0 h-full w-full" shadows onCreated={() => setLoaded(true)}>
          <PerspectiveCamera makeDefault position={[0, 0, CAMERA_Z]} fov={CAMERA_FOV} />
          <ambientLight intensity={1} />
          <AnimatedLight />
          <Scene />
        </Canvas>
      </div>

      <div className="relative min-h-[1000px] w-full">
        {/* 3D Scene Masked to 1000px */}
        <div className="relative h-[calc(1000px-5.5rem)] w-full overflow-hidden sm:h-[calc(1000px-5.25rem)]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <h1 className="text-6xl font-medium text-white text-shadow-lg"></h1>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
