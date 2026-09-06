'use client'

import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { clsx } from 'clsx'
import Image from 'next/image'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { TeapotGeometry } from 'three-stdlib'

import trainStation from '@/app/projects/train-station/render.png'
import abstractThumb from '@/app/projects/abstract-composition/thumbnail.png'

type Bleed = { right?: boolean; bottom?: boolean }

function ArtBentoCard({
  title,
  description,
  children,
  bleed,
  fullBleed,
  className,
}: {
  title: string
  description: string
  children: React.ReactNode
  bleed?: Bleed
  fullBleed?: boolean
  className?: string
}) {
  const clipRight = bleed?.right
  const clipBottom = bleed?.bottom

  return (
    <div
      className={clsx(
        'group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10',
        className
      )}
    >
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <h3 className="text-[15px] font-semibold tracking-tight text-zinc-950 dark:text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>

      {fullBleed ? (
        <div className="relative flex-1 overflow-hidden">{children}</div>
      ) : (
        <div className="relative mt-5 flex-1 overflow-hidden">
          <div
            className={clsx(
              'h-full',
              clipRight ? 'ml-5 sm:ml-6' : 'mx-5 sm:mx-6',
              clipBottom ? 'pb-0' : 'pb-5 sm:pb-6'
            )}
          >
            <div className={clsx('h-full overflow-hidden rounded-xl', clipRight && '-mr-6 sm:-mr-8', clipBottom && '-mb-6 sm:-mb-8')}>
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Three.js mini lab ---

type MeshId = 'torusKnot' | 'sphere' | 'teapot' | 'suzanne' | 'glass'
type MatId = 'clay' | 'metal' | 'holo' | 'wood' | 'glass'

const MESHES: { id: MeshId; label: string }[] = [
  { id: 'torusKnot', label: 'Torus Knot' },
  { id: 'sphere', label: 'Sphere' },
  { id: 'teapot', label: 'Teapot' },
  { id: 'suzanne', label: 'Suzanne' },
  { id: 'glass', label: 'Glass' },
]

const MATERIALS: { id: MatId; label: string; color: string; roughness: number; metalness: number; transmission?: number; thickness?: number; ior?: number; dispersion?: number }[] = [
  { id: 'clay', label: 'Clay', color: '#fb923c', roughness: 0.85, metalness: 0 },
  { id: 'metal', label: 'Metal', color: '#a1a1aa', roughness: 0.25, metalness: 0.85 },
  { id: 'holo', label: 'Holo', color: '#60a5fa', roughness: 0.35, metalness: 0.5 },
  { id: 'wood', label: 'Wood', color: '#a16207', roughness: 0.9, metalness: 0.05 },
  { id: 'glass', label: 'Glass', color: '#ffffff', roughness: 0.05, metalness: 0, transmission: 0.98, thickness: 0.5, ior: 1.52, dispersion: 0.012 },
]

const TARGET_HEIGHT = 1.18 // sphere 0.48*2 — reference height, bumped up a touch from 0.96
// Easy-to-tweak per-mesh heights — change one number, floor auto-follows
const MESH_TARGET_HEIGHTS: Record<MeshId, number> = {
  torusKnot: TARGET_HEIGHT,
  sphere: TARGET_HEIGHT,
  teapot: TARGET_HEIGHT * 0.82,
  suzanne: TARGET_HEIGHT * 0.88,
  glass: TARGET_HEIGHT,
}
const FLOOR_Y = -TARGET_HEIGHT / 2

function placeOnFloor(geometry: THREE.BufferGeometry, targetHeight: number) {
  normalizeGeometry(geometry, targetHeight)
  geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  const bottom = box.min.y
  const yShift = FLOOR_Y - bottom
  geometry.translate(0, yShift, 0)
  return geometry
}

function placeSceneOnFloor(scene: THREE.Group, targetHeight: number) {
  scene.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(scene)
  const height = box.max.y - box.min.y
  if (height === 0) return scene
  const scale = targetHeight / height
  scene.scale.setScalar(scale)
  scene.updateMatrixWorld(true)
  const box2 = new THREE.Box3().setFromObject(scene)
  const yShift = FLOOR_Y - box2.min.y
  scene.position.y += yShift
  return scene
}

function placeGeometryOnFloor(geometry: THREE.BufferGeometry, targetHeight: number) {
  normalizeGeometry(geometry, targetHeight)
  geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  const yShift = FLOOR_Y - box.min.y
  geometry.translate(0, yShift, 0)
  return geometry
}

function normalizeGeometry(geometry: THREE.BufferGeometry, targetHeight: number): THREE.BufferGeometry {
  geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  const height = box.max.y - box.min.y
  const scale = targetHeight / height
  geometry.scale(scale, scale, scale)
  geometry.computeBoundingBox()
  const box2 = geometry.boundingBox!
  const yOffset = -(box2.min.y + box2.max.y) / 2
  geometry.translate(0, yOffset, 0)
  return geometry
}

function SuzanneModel({ material, targetHeight, onFloor }: { material: THREE.Material; targetHeight?: number; onFloor?: boolean }) {
  const { scene } = useGLTF('/models/suzanne/Suzanne.gltf')
  const cloned = useMemo(() => {
    const s = scene.clone(true)
    s.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = material
    })
    if (targetHeight) {
      const adjustedHeight = targetHeight * 0.88
      s.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(s)
      const height = box.max.y - box.min.y
      const scale = adjustedHeight / height
      s.scale.setScalar(scale)
      s.updateMatrixWorld(true)
      const box2 = new THREE.Box3().setFromObject(s)
      if (onFloor) {
        const yShift = FLOOR_Y - box2.min.y
        s.position.y += yShift
      } else {
        const yOffset = -(box2.min.y + box2.max.y) / 2
        s.position.y += yOffset
      }
    }
    return s
  }, [scene, material, targetHeight, onFloor])
  if (targetHeight) return <primitive object={cloned} />
  return <primitive object={cloned} scale={0.65} position={[0, -0.18, 0]} />
}

function GridFloor({ isDark }: { isDark: boolean }) {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const size = 1024
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    const ctx = c.getContext('2d')!
    ctx.clearRect(0, 0, size, size)

    const cols = 32
    const rows = 32
    const gap = size / cols
    const center = size / 2
    const maxDist = Math.hypot(center, center)

    // Hierarchical grid: major lines (every 4th) = bold, minor lines = thin
    const drawGrid = (alphaMultiplier: number, majorOnly = false) => {
      ctx.lineWidth = 0.8
      ctx.strokeStyle = isDark ? `rgba(228,228,231,${0.65 * alphaMultiplier})` : `rgba(39,39,42,${0.5 * alphaMultiplier})`
      // Major lines every 4th (like cm on a ruler)
      for (let x = 0; x <= cols; x += 4) {
        const px = x * gap
        ctx.beginPath()
        ctx.moveTo(px, 0)
        ctx.lineTo(px, size)
        ctx.stroke()
      }
      for (let y = 0; y <= rows; y += 4) {
        const py = y * gap
        ctx.beginPath()
        ctx.moveTo(0, py)
        ctx.lineTo(size, py)
        ctx.stroke()
      }
      if (!majorOnly) {
        // Minor lines (every 1) - fainter
        ctx.strokeStyle = isDark ? `rgba(228,228,231,${0.25 * alphaMultiplier})` : `rgba(39,39,42,${0.15 * alphaMultiplier})`
        ctx.lineWidth = 0.5
        for (let x = 0; x <= cols; x++) {
          if (x % 4 !== 0) {
            const px = x * gap
            ctx.beginPath()
            ctx.moveTo(px, 0)
            ctx.lineTo(px, size)
            ctx.stroke()
          }
        }
        for (let y = 0; y <= rows; y++) {
          if (y % 4 !== 0) {
            const py = y * gap
            ctx.beginPath()
            ctx.moveTo(0, py)
            ctx.lineTo(size, py)
            ctx.stroke()
          }
        }
      }
    }

    // Draw base grid with full opacity
    drawGrid(1.0, false)

    // Apply radial fade mask
    const fadeCanvas = document.createElement('canvas')
    fadeCanvas.width = size
    fadeCanvas.height = size
    const fctx = fadeCanvas.getContext('2d')!
    const grad = fctx.createRadialGradient(center, center, 0, center, center, maxDist * 0.85)
    grad.addColorStop(0, 'rgba(0,0,0,1)')
    grad.addColorStop(0.65, 'rgba(0,0,0,1)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    fctx.fillStyle = grad
    fctx.fillRect(0, 0, size, size)
    const ctxMain = c.getContext('2d')!
    ctxMain.globalCompositeOperation = 'destination-in'
    ctxMain.drawImage(fadeCanvas, 0, 0)

    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    tex.needsUpdate = true
    return tex
  }, [isDark])

  if (!texture) return null
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.01, 0]}>
      <planeGeometry args={[8, 8]} />
      <meshBasicMaterial map={texture} transparent opacity={0.38} depthWrite={false} />
    </mesh>
  )
}

function TurntableMesh({ meshId, matId, isDark, isDragging }: { meshId: MeshId; matId: MatId; isDark: boolean; isDragging?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const mat = useMemo(() => {
    const m = MATERIALS.find((x) => x.id === matId)!
    if (m.id === 'glass') {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0,
        metalness: 0,
        transmission: 1,
        thickness: 0.5,
        ior: 1.52,
        dispersion: 0.012,
        clearcoat: 0.1,
        clearcoatRoughness: 0.1,
      })
    }
    return new THREE.MeshStandardMaterial({ color: m.color, roughness: m.roughness, metalness: m.metalness })
  }, [matId])

  const geometry = useMemo(() => {
    let g: THREE.BufferGeometry | null = null
    switch (meshId) {
      case 'torusKnot':
        g = new THREE.TorusKnotGeometry(0.55, 0.18, 128, 24)
        placeGeometryOnFloor(g, MESH_TARGET_HEIGHTS[meshId])
        break
      case 'sphere':
        g = new THREE.SphereGeometry(0.48, 64, 64)
        placeGeometryOnFloor(g, MESH_TARGET_HEIGHTS[meshId])
        break
      case 'teapot': {
        g = new TeapotGeometry(0.6)
        placeGeometryOnFloor(g, MESH_TARGET_HEIGHTS[meshId])
        break
      }
      case 'glass': {
        g = new THREE.SphereGeometry(0.5, 64, 64)
        // Position slightly above floor so you can see floor through it
        g.translate(0, 0.25, 0)
        break
      }
      default:
        g = null
    }
    return g
  }, [meshId])

  useFrame((_, delta) => {
    if (groupRef.current && !isDragging) {
      groupRef.current.rotation.y += delta * 0.18
    }
  })

return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {meshId === 'suzanne' ? (
        <SuzanneModel material={mat} targetHeight={MESH_TARGET_HEIGHTS['suzanne']} onFloor />
      ) : geometry ? (
        <mesh geometry={geometry} material={mat} castShadow receiveShadow />
      ) : null}
    </group>
  )
}

function StaticShapePreview({
  meshId,
  matId,
  isSelected,
  onClick,
}: {
  meshId: MeshId
  matId: MatId
  isSelected: boolean
  onClick: () => void
}) {
  const mat = useMemo(() => {
    const m = MATERIALS.find((x) => x.id === matId)!
    if (m.id === 'glass') {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0,
        metalness: 0,
        transmission: 1,
        thickness: 0.5,
        ior: 1.52,
        dispersion: 0.012,
        clearcoat: 0.1,
        clearcoatRoughness: 0.1,
      })
    }
    return new THREE.MeshStandardMaterial({ color: m.color, roughness: m.roughness, metalness: m.metalness })
  }, [matId])

  const geometry = useMemo(() => {
    let g: THREE.BufferGeometry | null = null
    switch (meshId) {
      case 'torusKnot':
        g = new THREE.TorusKnotGeometry(0.55, 0.18, 64, 16)
        break
      case 'sphere':
        g = new THREE.SphereGeometry(0.48, 32, 32)
        break
      case 'teapot': {
        g = new TeapotGeometry(0.6)
        if (g) normalizeGeometry(g, TARGET_HEIGHT * 0.82)
        return g
      }
      case 'glass': {
        g = new THREE.SphereGeometry(0.5, 64, 64)
        // Position so bottom touches floor (FLOOR_Y)
        // Sphere radius 0.5, center at FLOOR_Y + 0.5 = -0.59 + 0.5 = -0.09
        g.translate(0, 0.5, 0)
        break
      }
      default:
        g = null
    }
    if (g) normalizeGeometry(g, TARGET_HEIGHT)
    return g
  }, [meshId])

  return (
    <button onClick={onClick} className={clsx('pointer-events-auto relative size-20 shrink-0 transition-opacity', isSelected ? 'opacity-100' : 'opacity-55 hover:opacity-100')}>
      <Canvas camera={{ position: [0, 0, 4.8], fov: 26 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} />
        <Environment preset="studio" />
        <Suspense fallback={null}>
          {meshId === 'suzanne' ? (
            <SuzanneModel material={mat} targetHeight={MESH_TARGET_HEIGHTS['suzanne']} />
          ) : geometry ? (
            <mesh geometry={geometry} material={mat} rotation={[0.3, 0.5, 0]} />
          ) : null}
        </Suspense>
      </Canvas>
    </button>
  )
}

function ThreeJSLab() {
  const [meshId, setMeshId] = useState<MeshId>('teapot')
  const [matId, setMatId] = useState<MatId>('clay')
  const [isDark, setIsDark] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const check = () => setIsDark(document.documentElement.classList.contains('dark') || media.matches)
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    media.addEventListener('change', check)
    return () => {
      obs.disconnect()
      media.removeEventListener('change', check)
    }
  }, [])
  const bg = isDark ? '#18181b' : '#ffffff'

  return (
    <div className="relative flex h-full min-h-[520px] overflow-hidden" style={{ background: bg }}>
      {/* Left — vertical stack of shapes (transparent, overlaying grid) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-[88px] flex-col items-center justify-center gap-2 bg-transparent py-4">
        {MESHES.map((m) => (
          <StaticShapePreview key={m.id} meshId={m.id} matId={matId} isSelected={meshId === m.id} onClick={() => setMeshId(m.id)} />
        ))}
      </div>

      {/* Center — turntable (full bleed behind sidebars) */}
      <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
        <Canvas camera={{ position: [0, 0, 5.2], fov: 32 }} dpr={[1, 2]} shadows gl={{ antialias: true }}>
          <color attach="background" args={[bg]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow />
          <directionalLight position={[-4, 2, -4]} intensity={0.6} />
          <Suspense fallback={null}>
            <TurntableMesh meshId={meshId} matId={matId} isDark={isDark} isDragging={isDragging} />
            <Environment preset="studio" />
            <ContactShadows position={[0, FLOOR_Y + 0.02, 0]} opacity={0.3} scale={5} blur={2.8} far={4} />
            <GridFloor isDark={isDark} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={5.2}
            maxDistance={5.2}
            autoRotate={!isDragging}
            autoRotateSpeed={0.35}
            enableDamping
            dampingFactor={0.08}
            onStart={() => setIsDragging(true)}
            onEnd={() => setIsDragging(false)}
          />
        </Canvas>
      </div>

      {/* Right — vertical stack of textures (transparent, overlaying grid) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-[68px] flex-col items-center justify-center gap-2.5 bg-transparent py-4">
        {MATERIALS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMatId(m.id)}
            aria-label={m.label}
            className={clsx(
              'pointer-events-auto size-8 rounded-full ring-1 transition-all',
              matId === m.id
                ? 'ring-2 ring-zinc-900 ring-offset-2 ring-offset-white dark:ring-white dark:ring-offset-zinc-900'
                : 'ring-black/10 hover:ring-black/20 dark:ring-white/15 dark:hover:ring-white/25'
            )}
            style={{ background: m.color }}
          />
        ))}
      </div>
    </div>
  )
}

function ImageBentoCard({
  title,
  description,
  src,
  alt,
  className,
  alignTop,
  zoomed,
  topFade,
}: {
  title: string
  description: string
  src: any
  alt: string
  className?: string
  alignTop?: boolean
  zoomed?: boolean
  topFade?: boolean
}) {
  if (topFade) {
    return (
      <div className={clsx('relative flex min-h-95 flex-col overflow-hidden rounded-2xl bg-[#202733]', className)}>
        <div className="relative p-5 pb-2 sm:p-6 sm:pb-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-1.5 text-sm leading-6 text-white/75">{description}</p>
        </div>
        <div className="relative -mt-3 flex-1 overflow-hidden sm:-mt-4">
          <Image
            src={src}
            alt={alt}
            fill
            className={clsx('object-cover', alignTop && 'object-top', zoomed && 'origin-top scale-[1.01]')}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-[#202733] to-transparent sm:h-12" />
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-950/5 dark:ring-white/5" />
      </div>
    )
  }

  return (
    <div className={clsx('relative flex min-h-95 flex-col overflow-hidden rounded-2xl', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className={clsx('object-cover', alignTop && 'object-top', zoomed && 'origin-top scale-100')}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/55 to-transparent sm:h-28" />
      <div className="relative p-5 sm:p-6">
        <h3 className="text-[15px] font-semibold tracking-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">{description}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-950/5 dark:ring-white/5" />
    </div>
  )
}

export function ThreeDArtGrid() {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-12">
      <ImageBentoCard
        title="Environments"
        description="Architectural worlds and natural scattering — the Train Station project."
        src={trainStation}
        alt="Train Station environment"
        className="lg:col-span-6"
      />

      <ImageBentoCard
        title="Illustrations"
        description="Abstract form, color, and close-up material studies."
        src={abstractThumb}
        alt="Abstract composition"
        className="lg:col-span-6"
        alignTop
        zoomed
        topFade
      />

      <ArtBentoCard title="Three.js" description="Pick a mesh and material — drag to spin, release to keep turntabling." fullBleed className="lg:col-span-12 min-h-[600px]">
        <ThreeJSLab />
      </ArtBentoCard>
    </div>
  )
}
