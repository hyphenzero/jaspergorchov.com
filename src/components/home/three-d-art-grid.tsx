'use client'

import { trackEvent } from '@/actions/analytics'
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { clsx } from 'clsx'
import Image, { type StaticImageData } from 'next/image'
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
        <div className="relative flex-1 overflow-hidden rounded-2xl">{children}</div>
      ) : (
        <div className="relative mt-5 flex-1 overflow-hidden rounded-2xl">
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

type MeshId = 'torusKnot' | 'sphere' | 'teapot' | 'suzanne'
type MatId = 'clay' | 'metal' | 'plastic' | 'wood' | 'toon'

const MESHES: { id: MeshId; label: string }[] = [
  { id: 'torusKnot', label: 'Torus Knot' },
  { id: 'sphere', label: 'Sphere' },
  { id: 'teapot', label: 'Teapot' },
  { id: 'suzanne', label: 'Suzanne' },
]

const MATERIALS: { id: MatId; label: string; color: string; roughness: number; metalness: number }[] = [
  { id: 'clay', label: 'Clay', color: '#a3a3a3', roughness: 0.95, metalness: 0 },
  { id: 'metal', label: 'Metal', color: '#a1a1aa', roughness: 0.25, metalness: 0.85 },
  { id: 'plastic', label: 'Plastic', color: '#ffffff', roughness: 1, metalness: 0 },
  { id: 'wood', label: 'Wood', color: '#a16207', roughness: 0.9, metalness: 0.05 },
  { id: 'toon', label: 'Toon', color: '#fb923c', roughness: 0.6, metalness: 0 },
]

const TARGET_HEIGHT = 1.18 // sphere 0.48*2 — reference height, bumped up a touch from 0.96
// Easy-to-tweak per-mesh heights — change one number, floor auto-follows
const MESH_TARGET_HEIGHTS: Record<MeshId, number> = {
  torusKnot: TARGET_HEIGHT,
  sphere: TARGET_HEIGHT,
  teapot: TARGET_HEIGHT * 0.82,
  suzanne: TARGET_HEIGHT * 0.88,
}

// Per-mesh preview zoom so each model fills its toolbar circle
// (teapot already fills its circle, so it stays at 1)
const PREVIEW_FILL: Record<MeshId, number> = {
  torusKnot: 1.35,
  sphere: 1.4,
  teapot: 1,
  suzanne: 1.3,
}
const FLOOR_Y = -TARGET_HEIGHT / 2

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

// Real PBR maps from ambientCG (CC0), 1k is plenty for these small views.
// Only metal + wood are textured — the rest stay procedural.
// Vendored locally so the page never depends on a third-party host.
const METAL_MAP_URLS = [
  '/materials/metal049a/Metal049A_1K-JPG_Color.jpg',
  '/materials/metal049a/Metal049A_1K-JPG_NormalGL.jpg',
  '/materials/metal049a/Metal049A_1K-JPG_Roughness.jpg',
]

// Wood 095 by ambientCG (CC0), vendored locally like the metal maps.
const WOOD_MAP_URLS = [
  '/materials/wood095/Wood095_1K-JPG_Color.jpg',
  '/materials/wood095/Wood095_1K-JPG_NormalGL.jpg',
  '/materials/wood095/Wood095_1K-JPG_Roughness.jpg',
]

// Plastic 015 B by ambientCG (CC0), vendored locally like the others.
const PLASTIC_MAP_URLS = [
  '/materials/plastic015b/Plastic015B_1K-JPG_Color.jpg',
  '/materials/plastic015b/Plastic015B_1K-JPG_NormalGL.jpg',
  '/materials/plastic015b/Plastic015B_1K-JPG_Roughness.jpg',
]

type PbrMaps = { metal: THREE.Texture[]; wood: THREE.Texture[]; plastic: THREE.Texture[] } | null

// Module-level cache so the maps load exactly once no matter how many
// previews (each its own Canvas/renderer) subscribe to them.
const mapsCache = new Map<string, Promise<THREE.Texture[]>>()

function loadMaps(urls: string[]): Promise<THREE.Texture[]> {
  const key = urls.join('|')
  let pending = mapsCache.get(key)
  if (!pending) {
    pending = (async () => {
      const loader = new THREE.TextureLoader()
      loader.setCrossOrigin('anonymous')
      const texs = await Promise.all(urls.map((u) => loader.loadAsync(u)))
      for (const t of texs) {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.needsUpdate = true
      }
      return texs
    })()
    mapsCache.set(key, pending)
  }
  return pending
}

function usePbrMaps(): PbrMaps {
  const [maps, setMaps] = useState<PbrMaps>(null)
  useEffect(() => {
    let cancelled = false
    Promise.all([loadMaps(METAL_MAP_URLS), loadMaps(WOOD_MAP_URLS), loadMaps(PLASTIC_MAP_URLS)]).then(
      ([metal, wood, plastic]) => {
        if (!cancelled) setMaps({ metal, wood, plastic })
      }
    )
    return () => {
      cancelled = true
    }
  }, [])
  return maps
}

let cachedToonGradient: THREE.DataTexture | null = null

function getToonGradientMap(): THREE.DataTexture {
  if (!cachedToonGradient) {
    const tones = new Uint8Array([110, 170, 230, 255])
    const tex = new THREE.DataTexture(tones, tones.length, 1, THREE.RedFormat)
    tex.minFilter = THREE.NearestFilter
    tex.magFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    tex.needsUpdate = true
    cachedToonGradient = tex
  }
  return cachedToonGradient
}

// Inverted-hull outline: a slightly scaled BackSide copy of the mesh.
// Outline color flips with the theme so it reads on light and dark scenes.
function ToonOutline({
  geometry,
  scale = 1.05,
  rotation,
  isDark,
}: {
  geometry: THREE.BufferGeometry
  scale?: number
  rotation?: [number, number, number]
  isDark: boolean
}) {
  return (
    <mesh geometry={geometry} scale={scale} rotation={rotation}>
      <meshBasicMaterial color={isDark ? '#fafafa' : '#18181b'} side={THREE.BackSide} />
    </mesh>
  )
}

function buildLabMaterial(matId: MatId, maps: PbrMaps): THREE.Material {
  const m = MATERIALS.find((x) => x.id === matId)!
  if (m.id === 'toon') {
    return new THREE.MeshToonMaterial({ color: m.color, gradientMap: getToonGradientMap() })
  }
  const mat = new THREE.MeshStandardMaterial({ color: m.color, roughness: m.roughness, metalness: m.metalness })
  const texs = m.id === 'metal' ? maps?.metal : m.id === 'wood' ? maps?.wood : m.id === 'plastic' ? maps?.plastic : null
  if (texs) {
    const [diffuse, normal, roughnessMap] = texs
    diffuse.colorSpace = THREE.SRGBColorSpace
    mat.map = diffuse
    mat.normalMap = normal
    mat.roughnessMap = roughnessMap
    mat.roughness = 1
    if (m.id === 'metal') {
      mat.metalness = 1
      mat.envMapIntensity = 1.2
    }
  }
  return mat
}

// Materials start procedural and gain their Poly Haven maps as soon as the
// textures finish loading (each component owns its material instance).
function useLabMaterial(matId: MatId): THREE.Material {
  const maps = usePbrMaps()
  return useMemo(() => buildLabMaterial(matId, maps), [matId, maps])
}

function SuzanneModel({
  material,
  targetHeight,
  onFloor,
  outline,
  outlineColor,
}: {
  material: THREE.Material
  targetHeight?: number
  onFloor?: boolean
  outline?: boolean
  outlineColor?: string
}) {
  const { scene } = useGLTF('/models/suzanne/Suzanne.gltf')
  const cloned = useMemo(() => {
    const s = scene.clone(true)
    const meshes: THREE.Mesh[] = []
    s.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) meshes.push(c as THREE.Mesh)
    })
    const outlineMat = outline
      ? new THREE.MeshBasicMaterial({ color: outlineColor ?? '#18181b', side: THREE.BackSide })
      : null
    for (const mesh of meshes) {
      mesh.material = material
      if (outlineMat) {
        const o = new THREE.Mesh(mesh.geometry, outlineMat)
        o.scale.setScalar(1.045)
        mesh.add(o)
      }
    }
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
  }, [scene, material, targetHeight, onFloor, outline, outlineColor])
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

function TurntableMesh({ meshId, matId, isDark }: { meshId: MeshId; matId: MatId; isDark: boolean }) {
  const mat = useLabMaterial(matId)
  const isToon = matId === 'toon'

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
        // High segment count: coarse tessellation rows show through toon
        // shading as scalloped bands.
        g = new TeapotGeometry(0.6, 24)
        placeGeometryOnFloor(g, MESH_TARGET_HEIGHTS[meshId])
        break
      }
      default:
        g = null
    }
    return g
  }, [meshId])

  // NOTE: no manual rotation here — turntabling comes solely from
  // OrbitControls autoRotate so the model and GridFloor stay in sync.
  // A separate per-mesh spin would make the model orbit faster than the floor.
  return (
    <group position={[0, 0, 0]}>
      {meshId === 'suzanne' ? (
        <SuzanneModel
          material={mat}
          targetHeight={MESH_TARGET_HEIGHTS['suzanne']}
          onFloor
          outline={isToon}
          outlineColor={isDark ? '#fafafa' : '#18181b'}
        />
      ) : geometry ? (
        <>
          <mesh geometry={geometry} material={mat} castShadow receiveShadow />
          {isToon && <ToonOutline geometry={geometry} scale={1.04} isDark={isDark} />}
        </>
      ) : null}
    </group>
  )
}

function StaticShapePreview({
  meshId,
  matId,
  isSelected,
  onClick,
  isDark,
}: {
  meshId: MeshId
  matId: MatId
  isSelected: boolean
  onClick: () => void
  isDark: boolean
}) {
  const mat = useLabMaterial(matId)
  const isToon = matId === 'toon'

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
        g = new TeapotGeometry(0.6, 24)
        if (g) normalizeGeometry(g, TARGET_HEIGHT * 0.82)
        return g
      }
      default:
        g = null
    }
    if (g) {
      normalizeGeometry(g, TARGET_HEIGHT)
      const f = PREVIEW_FILL[meshId]
      g.scale(f, f, f)
    }
    return g
  }, [meshId])

  const label = MESHES.find((m) => m.id === meshId)?.label ?? meshId

  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={clsx(
        'pointer-events-auto relative size-11 shrink-0 overflow-hidden rounded-full transition-shadow',
        isSelected && 'ring-2 ring-sky-500 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900',
        !isSelected &&
          'hover:ring-2 hover:ring-sky-500/50 hover:ring-offset-1 hover:ring-offset-white dark:hover:ring-offset-zinc-900'
      )}
    >
      <Canvas camera={{ position: [0, 0, 4.8], fov: 26 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} />
        <Environment preset="studio" />
        <Suspense fallback={null}>
          {meshId === 'suzanne' ? (
            <SuzanneModel
              material={mat}
              targetHeight={MESH_TARGET_HEIGHTS['suzanne'] * PREVIEW_FILL['suzanne']}
              outline={isToon}
              outlineColor={isDark ? '#fafafa' : '#18181b'}
            />
          ) : geometry ? (
            <>
              <mesh geometry={geometry} material={mat} rotation={[0.3, 0.5, 0]} />
              {isToon && (
                <ToonOutline geometry={geometry} scale={1.07} rotation={[0.3, 0.5, 0]} isDark={isDark} />
              )}
            </>
          ) : null}
        </Suspense>
      </Canvas>
    </button>
  )
}

function MaterialSpherePreview({
  matId,
  isSelected,
  onClick,
  isDark,
}: {
  matId: MatId
  isSelected: boolean
  onClick: () => void
  isDark: boolean
}) {
  const mat = useLabMaterial(matId)
  const isToon = matId === 'toon'
  const geometry = useMemo(() => new THREE.SphereGeometry(0.9, 32, 32), [])
  const label = MATERIALS.find((m) => m.id === matId)?.label ?? matId

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={clsx(
        'pointer-events-auto relative size-11 shrink-0 overflow-hidden rounded-full transition-shadow',
        isSelected && 'ring-2 ring-sky-500 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900',
        !isSelected &&
          'hover:ring-2 hover:ring-sky-500/50 hover:ring-offset-1 hover:ring-offset-white dark:hover:ring-offset-zinc-900'
      )}
    >
      <Canvas camera={{ position: [0, 0, 4.8], fov: 26 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} />
        <Environment preset="studio" />
        <Suspense fallback={null}>
          <>
            <mesh geometry={geometry} material={mat} />
            {isToon && <ToonOutline geometry={geometry} scale={1.07} isDark={isDark} />}
          </>
        </Suspense>
      </Canvas>
    </button>
  )
}

// Pill styled like BottomToolbar in components/mini-editor/toolbar.tsx:
// same rounded-full bg-white + shadow/ring classes, scaled up with p-2
// padding and size-12 items. Vertical on desktop, horizontal on mobile.
const VERTICAL_TOOLBAR_PILL =
  'pointer-events-auto relative flex flex-col items-center gap-1.5 rounded-full bg-white p-1.5 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-full dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline max-sm:flex-row'

function ThreeJSLab() {
  const [meshId, setMeshId] = useState<MeshId>('torusKnot')
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

  // Counts as one "use" the first time a visitor actually changes the model
  // or material — compare against page views for the usage ratio.
  const labUsedRef = useRef(false)
  function trackLabUse() {
    if (labUsedRef.current) return
    labUsedRef.current = true
    trackEvent({ event_type: 'threejs_lab_use', content_type: 'home', source: 'threejs-lab' }).catch(() => {})
  }
  function selectMesh(id: MeshId) {
    if (id !== meshId) trackLabUse()
    setMeshId(id)
  }
  function selectMaterial(id: MatId) {
    if (id !== matId) trackLabUse()
    setMatId(id)
  }

  return (
    <div className="relative flex h-full min-h-130 overflow-hidden" style={{ background: bg }}>
      {/* Left — model picker: vertical pill on desktop, horizontal pill
          pinned to the top on mobile */}
      <div className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center py-4 max-sm:inset-x-0 max-sm:inset-y-auto max-sm:top-0 max-sm:justify-center">
        <div className={VERTICAL_TOOLBAR_PILL}>
          {MESHES.map((m) => (
            <StaticShapePreview
              key={m.id}
              meshId={m.id}
              matId={matId}
              isSelected={meshId === m.id}
              onClick={() => selectMesh(m.id)}
              isDark={isDark}
            />
          ))}
        </div>
      </div>

      {/* Center — turntable (full bleed behind sidebars) */}
      <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
        <Canvas camera={{ position: [0, 1.6, 4.95], fov: 32 }} dpr={[1, 2]} shadows gl={{ antialias: true }}>
          <color attach="background" args={[bg]} />
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[4, 6, 4]}
            intensity={1.6}
            castShadow
            shadow-bias={-0.0002}
            shadow-normalBias={0.03}
          />
          <directionalLight position={[-4, 2, -4]} intensity={0.6} />
          <Suspense fallback={null}>
            <TurntableMesh meshId={meshId} matId={matId} isDark={isDark} />
            <Environment preset="studio" />
            <ContactShadows position={[0, FLOOR_Y + 0.02, 0]} opacity={0.3} scale={5} blur={2.8} far={4} />
            <GridFloor isDark={isDark} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={5.2}
            maxDistance={5.2}
            minPolarAngle={1.26}
            maxPolarAngle={1.26}
            target={[0, 0, 0]}
            autoRotate={!isDragging}
            autoRotateSpeed={0.35}
            enableDamping
            dampingFactor={0.08}
            onStart={() => setIsDragging(true)}
            onEnd={() => setIsDragging(false)}
          />
        </Canvas>
      </div>

      {/* Right — material picker: vertical pill on desktop, horizontal pill
          pinned to the bottom on mobile. Each material is previewed on an
          actual sphere so you can see how it looks. */}
      <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex items-center py-4 max-sm:inset-x-0 max-sm:inset-y-auto max-sm:bottom-0 max-sm:justify-center">
        <div className={VERTICAL_TOOLBAR_PILL}>
          {MATERIALS.map((m) => (
            <MaterialSpherePreview
              key={m.id}
              matId={m.id}
              isSelected={matId === m.id}
              onClick={() => selectMaterial(m.id)}
              isDark={isDark}
            />
          ))}
        </div>
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
  src: StaticImageData
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
        description="Full architectural or natural environments, rendered in Blender."
        src={trainStation}
        alt="Train Station environment"
        className="lg:col-span-6"
      />

      <ImageBentoCard
        title="Illustrations"
        description="Abstract pieces focused on shape, color, and composition."
        src={abstractThumb}
        alt="Abstract composition"
        className="lg:col-span-6"
        alignTop
        zoomed
        topFade
      />

      <ArtBentoCard title="Three.js" description="Interactive experiences that run in real time in the browser." fullBleed className="lg:col-span-12 min-h-150">
        <ThreeJSLab />
      </ArtBentoCard>
    </div>
  )
}
