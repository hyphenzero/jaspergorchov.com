'use client'

import { ContactShadows, Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { clsx } from 'clsx'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OBJLoader, TeapotGeometry } from 'three-stdlib'
import { Tabs } from '@/components/tabs'

// ============ Types ============

type TextureAsset = {
  id: string
  name: string
  thumbnailUrl?: string
  previewMap: Record<string, string>
}

type GeometryType =
  | 'torusKnot'
  | 'sphere'
  | 'box'
  | 'icosahedron'
  | 'torus'
  | 'cone'
  | 'cylinder'
  | 'teapot'
  | 'suzanne'
  | 'bunny'

const GEOMETRY_OPTIONS: { type: GeometryType; label: string }[] = [
  { type: 'torusKnot', label: 'Torus Knot' },
  { type: 'sphere', label: 'Sphere' },
  { type: 'box', label: 'Box' },
  { type: 'icosahedron', label: 'Icosahedron' },
  { type: 'torus', label: 'Torus' },
  { type: 'cone', label: 'Cone' },
  { type: 'cylinder', label: 'Cylinder' },
  { type: 'teapot', label: 'Utah Teapot' },
  { type: 'suzanne', label: 'Suzanne' },
  { type: 'bunny', label: 'Stanford Bunny' },
]

const LOADED_TYPES = new Set<GeometryType>(['suzanne', 'bunny'])

function isLoadedModel(type: GeometryType) {
  return LOADED_TYPES.has(type)
}

function createGeometry(type: GeometryType): THREE.BufferGeometry | null {
  switch (type) {
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(1, 0.35, 160, 32)
    case 'sphere':
      return new THREE.SphereGeometry(1, 64, 64)
    case 'box':
      return new THREE.BoxGeometry(1.4, 1.4, 1.4)
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(1, 1)
    case 'torus':
      return new THREE.TorusGeometry(1, 0.4, 64, 64)
    case 'cone':
      return new THREE.ConeGeometry(1, 2, 64)
    case 'cylinder':
      return new THREE.CylinderGeometry(1, 1, 1.6, 64)
    case 'teapot':
      return new TeapotGeometry(1)
    default:
      return null
  }
}

// ============ Fallback procedural textures when API fails ============

function generateGradientTexture(hue: number): string {
  if (typeof document === 'undefined') return ''
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 256, 256)
  grad.addColorStop(0, `hsl(${hue}, 70%, 60%)`)
  grad.addColorStop(1, `hsl(${hue + 60}, 70%, 30%)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)
  return c.toDataURL()
}

const FALLBACK_TEXTURES: TextureAsset[] = Array.from({ length: 24 }, (_, i) => ({
  id: `fallback-${i}`,
  name: `Texture ${i + 1}`,
  previewMap: {
    color: generateGradientTexture(i * 15),
    normal: '',
    roughness: '',
    ao: '',
  },
}))

// ============ PBR Material Loader ============

function createPBRMaterial(previewMap: TextureAsset['previewMap']): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.3,
    envMapIntensity: 1,
  })
  return m
}

function applyMaps(mat: THREE.MeshStandardMaterial, previewMap: TextureAsset['previewMap'], textures: THREE.Texture[]) {
  let idx = 0

  if (previewMap.color && textures[idx]) {
    const tex = textures[idx]
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1, 1)
    mat.map = tex
  }
  idx++

  if (previewMap.normal && textures[idx]) {
    const tex = textures[idx]
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1, 1)
    mat.normalMap = tex
    mat.normalScale = new THREE.Vector2(1, 1)
  }
  idx++

  if (previewMap.roughness && textures[idx]) {
    const tex = textures[idx]
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1, 1)
    mat.roughnessMap = tex
  }
  idx++

  if (previewMap.ao && textures[idx]) {
    const tex = textures[idx]
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1, 1)
    mat.aoMap = tex
    mat.aoMapIntensity = 1
  }
}

function PBRMaterial({ previewMap }: { previewMap: TextureAsset['previewMap'] }) {
  const urls = [previewMap.color, previewMap.normal, previewMap.roughness, previewMap.ao].filter(Boolean) as string[]
  const loadedTextures = useTexture(urls)

  const mat = useMemo(() => {
    const m = createPBRMaterial(previewMap)
    applyMaps(m, previewMap, loadedTextures)
    return m
  }, [loadedTextures, previewMap])

  return <primitive object={mat} attach="material" />
}

// ============ Model Renderers ============

function GLTFModel({
  url,
  previewMap,
  scale,
  position,
}: {
  url: string
  previewMap: TextureAsset['previewMap']
  scale: number
  position?: [number, number, number]
}) {
  const { scene } = useGLTF(url)

  const urls = [previewMap.color, previewMap.normal, previewMap.roughness, previewMap.ao].filter(Boolean) as string[]
  const loadedTextures = useTexture(urls)

  const cloned = useMemo(() => {
    const s = scene.clone(true)
    const mat = createPBRMaterial(previewMap)
    applyMaps(mat, previewMap, loadedTextures)
    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = mat
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    return s
  }, [scene, previewMap, loadedTextures])

  return <primitive object={cloned} scale={scale} position={position} />
}

function OBJModel({ url, previewMap, scale }: { url: string; previewMap: TextureAsset['previewMap']; scale: number }) {
  const obj = useLoader(OBJLoader, url)
  const urls = [previewMap.color, previewMap.normal, previewMap.roughness, previewMap.ao].filter(Boolean) as string[]
  const loadedTextures = useTexture(urls)

  const cloned = useMemo(() => {
    const copy = obj.clone(true)
    const mat = createPBRMaterial(previewMap)
    applyMaps(mat, previewMap, loadedTextures)
    copy.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = mat
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    return copy
  }, [obj, previewMap, loadedTextures])

  return <primitive object={cloned} scale={scale} />
}

function TeapotModel({ previewMap }: { previewMap: TextureAsset['previewMap'] }) {
  const geometry = useMemo(() => new TeapotGeometry(1), [])
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <PBRMaterial previewMap={previewMap} />
    </mesh>
  )
}

function SimpleGeometryModel({ type, previewMap }: { type: GeometryType; previewMap: TextureAsset['previewMap'] }) {
  const geometry = useMemo(() => createGeometry(type)!, [type])
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <PBRMaterial previewMap={previewMap} />
    </mesh>
  )
}

// ============ Main 3D Object ============

function SceneObject({
  geometryType,
  previewMap,
}: {
  geometryType: GeometryType
  previewMap: TextureAsset['previewMap']
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  const content = useMemo(() => {
    switch (geometryType) {
      case 'teapot':
        return <TeapotModel previewMap={previewMap} />
      case 'suzanne':
        return (
          <GLTFModel url="/models/suzanne/Suzanne.gltf" previewMap={previewMap} scale={0.7} position={[0, -0.3, 0]} />
        )
      case 'bunny':
        return <OBJModel url="/models/bunny/bunny.obj" previewMap={previewMap} scale={5} />
      default:
        return <SimpleGeometryModel type={geometryType} previewMap={previewMap} />
    }
  }, [geometryType, previewMap])

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>{content}</Suspense>
    </group>
  )
}

function MainScene({
  geometryType,
  previewMap,
}: {
  geometryType: GeometryType
  previewMap: TextureAsset['previewMap']
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <SceneObject geometryType={geometryType} previewMap={previewMap} />
        <Environment preset="studio" />
        <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={6} blur={3} far={4} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
    </>
  )
}

// ============ Texture Preview (2D sphere thumbnails) ============

function TexturePreview({
  texture,
  isSelected,
  onClick,
}: {
  texture: TextureAsset
  isSelected: boolean
  onClick: () => void
}) {
  const imgSrc = texture.thumbnailUrl ?? texture.previewMap.color

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group relative aspect-square w-full cursor-pointer overflow-hidden rounded-full transition-shadow duration-200',
        isSelected && 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-900',
        !isSelected && 'hover:ring-2 hover:ring-amber-500/50 hover:ring-offset-2 hover:ring-offset-zinc-900'
      )}
    >
      {imgSrc && <img src={imgSrc} alt={texture.name} className="size-full object-cover" loading="lazy" />}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,transparent_35%,rgba(0,0,0,0.4)_100%)]" />
      {isSelected && <div className="pointer-events-none absolute inset-0 rounded-full bg-amber-500/10" />}
    </button>
  )
}

// ============ Object Preview (small 3D canvas) ============

function RotatingPreviewMesh({ geometry, isSelected }: { geometry: THREE.BufferGeometry; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4
      meshRef.current.rotation.y += delta * 0.6
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <meshStandardMaterial color={isSelected ? '#f59e0b' : '#a1a1aa'} roughness={0.3} metalness={0.6} />
    </mesh>
  )
}

function PreviewGLTF({ url, scale }: { url: string; scale: number }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4
      meshRef.current.rotation.y += delta * 0.6
    }
  })

  return (
    <group ref={meshRef} scale={scale}>
      <primitive object={scene.clone(true)} />
    </group>
  )
}

function PreviewOBJ({ url, scale }: { url: string; scale: number }) {
  const obj = useLoader(OBJLoader, url)
  const meshRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4
      meshRef.current.rotation.y += delta * 0.6
    }
  })

  return (
    <group ref={meshRef} scale={scale}>
      <primitive object={obj.clone(true)} />
    </group>
  )
}

function ObjectPreview({
  type,
  isSelected,
  onClick,
}: {
  type: GeometryType
  isSelected: boolean
  onClick: () => void
}) {
  const geometry = useMemo(() => createGeometry(type), [type])

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl transition-shadow duration-200',
        isSelected && 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-900',
        !isSelected && 'hover:ring-2 hover:ring-amber-500/50 hover:ring-offset-2 hover:ring-offset-zinc-900'
      )}
    >
      <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          {geometry ? (
            <RotatingPreviewMesh geometry={geometry} isSelected={isSelected} />
          ) : type === 'teapot' ? (
            <RotatingPreviewMesh geometry={new TeapotGeometry(1)} isSelected={isSelected} />
          ) : type === 'suzanne' ? (
            <PreviewGLTF url="/models/suzanne/Suzanne.gltf" scale={0.45} />
          ) : type === 'bunny' ? (
            <PreviewOBJ url="/models/bunny/bunny.obj" scale={3.2} />
          ) : null}
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </button>
  )
}

// ============ Texture Grid ============

function TextureGrid({
  textures,
  selectedId,
  onSelect,
}: {
  textures: TextureAsset[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [page, setPage] = useState(0)
  const itemsPerPage = 15
  const totalPages = Math.ceil(textures.length / itemsPerPage)
  const pageTextures = textures.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-4">
        {pageTextures.map((t) => (
          <div key={t.id} className="group flex flex-col items-center gap-1">
            <TexturePreview texture={t} isSelected={t.id === selectedId} onClick={() => onSelect(t.id)} />
            <span className="min-h-w-full not-group-hover:truncate text-center text-sm text-zinc-500">{t.name}</span>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex size-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs text-zinc-500">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex size-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ============ Object Grid ============

function ObjectGrid({
  selectedType,
  onSelect,
}: {
  selectedType: GeometryType
  onSelect: (type: GeometryType) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {GEOMETRY_OPTIONS.map((opt) => (
        <div key={opt.type} className="flex flex-col items-center gap-1">
          <ObjectPreview type={opt.type} isSelected={opt.type === selectedType} onClick={() => onSelect(opt.type)} />
          <span className="w-full truncate text-center text-[10px] text-zinc-500">{opt.label}</span>
        </div>
      ))}
    </div>
  )
}

// ============ Main TextureLab Component ============

const TABS = [
  { label: 'Textures', value: 'textures' },
  { label: 'Objects', value: 'objects' },
] as const

export function TextureLab({ className }: { className?: string }) {
  const [textures, setTextures] = useState<TextureAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTextureId, setSelectedTextureId] = useState<string | null>(null)
  const [selectedGeometry, setSelectedGeometry] = useState<GeometryType>('teapot')
  const [activeTab, setActiveTab] = useState<string>('textures')

  useEffect(() => {
    const warn = console.warn
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
      warn.apply(console, args)
    }
    return () => {
      console.warn = warn
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('https://api.polyhaven.com/assets?t=textures&limit=48')
      .then((res) => {
        if (!res.ok) throw new Error('API failed')
        return res.json()
      })
      .then((data: Record<string, any>) => {
        if (cancelled) return
        const assets: TextureAsset[] = Object.entries(data)
          .filter(([, v]) => (v as any).type === 1)
          .slice(0, 48)
          .map(([id, v]) => {
            const base = `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/${id}/${id}`
            return {
              id,
              name: ((v as any).name ?? id)
                .replace(/\baerial\b/gi, '')
                .replace(/\s+/g, ' ')
                .trim(),
              previewMap: {
                color: `${base}_diff_2k.jpg`,
                normal: `${base}_nor_gl_2k.jpg`,
                roughness: `${base}_rough_2k.jpg`,
                ao: `${base}_ao_2k.jpg`,
              },
              thumbnailUrl: `https://cdn.polyhaven.com/asset_img/thumbs/${id}.png?width=256&height=256`,
            }
          })
        setTextures(assets)
        if (assets.length > 0) setSelectedTextureId(assets[0].id)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setTextures(FALLBACK_TEXTURES)
        setSelectedTextureId(FALLBACK_TEXTURES[0].id)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const selectedTexture = useMemo(() => textures.find((t) => t.id === selectedTextureId), [textures, selectedTextureId])

  const currentPreviewMap = selectedTexture?.previewMap ?? { color: '', normal: '', roughness: '', ao: '' }

  return (
    <div
      className={clsx(
        'aspect-16/10 w-full rounded-2xl bg-white not-dark:shadow-sm not-dark:ring not-dark:ring-zinc-950/10 dark:bg-zinc-900',
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[1fr_200px] gap-0 overflow-hidden rounded-xl md:grid-cols-[1fr_300px] md:grid-rows-[1fr]">
          {/* 3D Scene */}
          <div className="relative min-h-0">
            {loading ? (
              <div className="flex size-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-8 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-500" />
                  <span className="text-xs text-zinc-500">Loading textures...</span>
                </div>
              </div>
            ) : (
              <Canvas
                camera={{ position: [0, 0, 4], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true }}
                shadows={{ type: THREE.PCFShadowMap }}
              >
                <color attach="background" args={['#18181b']} />
                <Suspense fallback={null}>
                  <MainScene geometryType={selectedGeometry} previewMap={currentPreviewMap} />
                </Suspense>
              </Canvas>
            )}
          </div>

          {/* Side Panel */}
          <div className="flex max-h-50 flex-col md:max-h-none">
            {/* Tabs */}
            <div className="px-2 pt-2">
              <Tabs
                tabs={[...TABS]}
                activeTab={activeTab}
                onChange={setActiveTab}
                layoutId="texture-lab-selected-background"
              />
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="size-5 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-500" />
                </div>
              ) : activeTab === 'textures' ? (
                <TextureGrid textures={textures} selectedId={selectedTextureId} onSelect={setSelectedTextureId} />
              ) : (
                <ObjectGrid selectedType={selectedGeometry} onSelect={setSelectedGeometry} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
