'use client'

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { clsx } from 'clsx'
import { Suspense, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three-stdlib'

const cardClass =
  // 'relative h-full w-full rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline'
  'relative h-full w-full'

const brandColors: Record<string, string> = {
  '/logos/tailwind.svg': '#00BCFF',
  '/logos/nextjs.svg': '#ffffff',
  '/logos/vercel.svg': '#ffffff',
  '/logos/tauri.svg': '#24C8D8',
  '/logos/swift.svg': '#F05138',
  '/logos/blender.svg': '#E87D0D',
  '/logos/threejs.svg': '#ffffff',
  '/logos/neon.svg': '#00E599',
}

const BG = '#09090b'
const EDGE_COLOR = '#71717a'
const DEPTH = 5

function ExtrudedLogo({ src }: { src: string }) {
  const svgData = useLoader(SVGLoader, src)
  const brand = brandColors[src] ?? '#a1a1aa'
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const hoveredRef = useRef(false)

  const { bodyMeshes, edgeLines, topOutlines } = useMemo(() => {
    const bodies: THREE.Mesh[] = []
    const edges: THREE.LineSegments[] = []
    const outlines: THREE.LineSegments[] = []

    for (const path of svgData.paths) {
      const shapes = path.toShapes()
      if (shapes.length === 0) continue

      const geo = new THREE.ExtrudeGeometry(shapes, {
        depth: DEPTH,
        bevelEnabled: false,
      })

      // Flip Y to correct SVG's Y-down coordinate system
      geo.scale(1, -1, 1)
      geo.computeBoundingBox()
      const bb = geo.boundingBox!
      const cx = (bb.max.x + bb.min.x) / 2
      const cy = (bb.max.y + bb.min.y) / 2
      // Don't center Z — bottom stays at z=0 so scaling Z stretches the top upward from the ground
      geo.applyMatrix4(new THREE.Matrix4().makeTranslation(-cx, -cy, 0))

      const span = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y)
      if (span <= 0) continue
      const s = 1 / span

      const body = new THREE.Mesh(geo)
      body.material = new THREE.MeshBasicMaterial({ color: BG, side: THREE.DoubleSide })
      body.scale.set(s, s, s)
      body.renderOrder = 0
      bodies.push(body)

      const edgeGeo = new THREE.EdgesGeometry(geo, 30)
      const line = new THREE.LineSegments(edgeGeo)
      line.material = new THREE.LineBasicMaterial({ color: EDGE_COLOR })
      line.scale.set(s, s, s)
      line.renderOrder = 1
      edges.push(line)

      // Extract top face outline from the geometry's own boundary edges
      const posAttr = geo.getAttribute('position')
      const topZ = DEPTH
      const tol = 0.001
      const edgeCount = new Map<string, number>()
      const edgeVerts = new Map<string, [number, number, number, number, number, number]>()

      for (let i = 0; i < posAttr.count; i += 3) {
        for (let e = 0; e < 3; e++) {
          const a = i + e
          const b = i + ((e + 1) % 3)
          const az = posAttr.getZ(a)
          const bz = posAttr.getZ(b)

          if (Math.abs(az - topZ) < tol && Math.abs(bz - topZ) < tol) {
            const key = `${Math.min(a, b)}-${Math.max(a, b)}`
            edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1)
            if (!edgeVerts.has(key)) {
              edgeVerts.set(key, [
                posAttr.getX(a),
                posAttr.getY(a),
                posAttr.getZ(a),
                posAttr.getX(b),
                posAttr.getY(b),
                posAttr.getZ(b),
              ])
            }
          }
        }
      }

      const outlineVerts: number[] = []
      for (const [key, count] of edgeCount) {
        if (count === 1) {
          const v = edgeVerts.get(key)!
          outlineVerts.push(v[0] * s, v[1] * s, v[2] * s, v[3] * s, v[4] * s, v[5] * s)
        }
      }

      if (outlineVerts.length > 0) {
        const og = new THREE.BufferGeometry()
        og.setAttribute('position', new THREE.Float32BufferAttribute(outlineVerts, 3))
        const ol = new THREE.LineSegments(og)
        ol.material = new THREE.LineBasicMaterial({ color: EDGE_COLOR })
        ol.scale.set(s, s, s)
        ol.renderOrder = 2
        outlines.push(ol)
      }
    }

    return { bodyMeshes: bodies, edgeLines: edges, topOutlines: outlines }
  }, [svgData])

  useFrame(() => {
    if (!groupRef.current) return
    const target = hoveredRef.current ? 1.35 : 1
    const current = groupRef.current.scale.z
    const next = current + (target - current) * 0.08
    if (Math.abs(next - target) > 0.001) {
      groupRef.current.scale.z = next
    } else if (groupRef.current.scale.z !== target) {
      groupRef.current.scale.z = target
    }
  })

  const edgeColor = hovered ? brand : EDGE_COLOR

  const onPointerEnter = () => {
    hoveredRef.current = true
    setHovered(true)
  }

  const onPointerLeave = () => {
    hoveredRef.current = false
    setHovered(false)
  }

  return (
    <group
      ref={groupRef}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {bodyMeshes.map((m, i) => (
        <primitive key={`b-${i}`} object={m} />
      ))}
      {edgeLines.map((l, i) => {
        ;(l.material as THREE.LineBasicMaterial).color.set(edgeColor)
        return <primitive key={`e-${i}`} object={l} />
      })}
      {topOutlines.map((ol, i) => {
        ;(ol.material as THREE.LineBasicMaterial).color.set(edgeColor)
        return <primitive key={`ol-${i}`} object={ol} />
      })}
    </group>
  )
}

function AutoFitCamera({ logosCount }: { logosCount: number }) {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera
  const size = useThree((s) => s.size)

  useMemo(() => {
    const cols = logosCount <= 2 ? logosCount : Math.ceil(Math.sqrt(logosCount))
    const rows = Math.ceil(logosCount / cols)
    const spacing = 2.4
    const contentWidth = Math.max(1.5, (cols - 1) * spacing + 1.5)
    const contentHeight = Math.max(1.5, (rows - 1) * spacing + 1.5)

    const zoomX = size.width / contentWidth
    const zoomY = size.height / contentHeight
    camera.zoom = Math.min(zoomX, zoomY) * 0.65
    camera.updateProjectionMatrix()
  }, [logosCount, size, camera])

  return null
}

function LogosGrid({ logos }: { logos: { src: string }[] }) {
  const count = logos.length
  const cols = count <= 2 ? count : Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / cols)
  const spacing = 2.4

  return (
    <group>
      <AutoFitCamera logosCount={count} />
      {logos.map((logo, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = (col - (cols - 1) / 2) * spacing
        const z = (row - (rows - 1) / 2) * spacing

        return (
          <group key={logo.src} position={[x, 0, z]}>
            <Suspense fallback={null}>
              <ExtrudedLogo src={logo.src} />
            </Suspense>
          </group>
        )
      })}
    </group>
  )
}

function Scene({ logos }: { logos: { src: string }[] }) {
  return (
    <Suspense fallback={null}>
      <LogosGrid logos={logos} />
    </Suspense>
  )
}

export function ToolCard({
  title,
  description,
  logos,
  className,
}: {
  title: string
  description: string
  logos: { src: string; bg: string; imgClass: string }[]
  className?: string
}) {
  return (
    <div className={clsx(cardClass, 'overflow-hidden not-last:pr-8 not-first:pl-8', className)}>
      <div className="aspect-2/1 w-full">
        <Canvas
          orthographic
          camera={{ position: [3, 3, 3], zoom: 40, near: 0.1, far: 100 }}
          dpr={[1, 4]}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={[BG]} />
          <Scene logos={logos} />
        </Canvas>
      </div>
      <h3 className="font-semibold text-sm text-zinc-950 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}

const logos = {
  tailwind: {
    src: '/logos/tailwind.svg',
    bg: 'bg-[#06B6D4]',
    imgClass: 'brightness-0 invert',
  },
  nextjs: {
    src: '/logos/nextjs.svg',
    bg: 'bg-zinc-950 dark:bg-white',
    imgClass: 'brightness-0 invert dark:brightness-100 dark:invert-0',
  },
  vercel: {
    src: '/logos/vercel.svg',
    bg: 'bg-zinc-950 dark:bg-white',
    imgClass: 'brightness-0 invert dark:brightness-100 dark:invert-0',
  },
  tauri: {
    src: '/logos/tauri.svg',
    bg: 'bg-[#24C8D8]',
    imgClass: 'brightness-0 invert',
  },
  swift: {
    src: '/logos/swift.svg',
    bg: 'bg-[#F05138]',
    imgClass: 'brightness-0 invert',
  },
  blender: {
    src: '/logos/blender.svg',
    bg: 'bg-[#E87D0D]',
    imgClass: 'brightness-0 invert',
  },
  threejs: {
    src: '/logos/threejs.svg',
    bg: 'bg-zinc-950 dark:bg-white',
    imgClass: 'brightness-0 invert dark:brightness-100 dark:invert-0',
  },
  neon: {
    src: '/logos/neon.svg',
    bg: 'bg-[#00E599]',
    imgClass: 'brightness-0 invert',
  },
}

const softwareCards = [
  {
    title: 'Websites & Web Apps',
    description:
      'Tailwind CSS for rapid, utility-first styling, Next.js for full-stack React with server components, Vercel for instant, edge-optimized deployments, and Neon for serverless Postgres.',
    logos: [logos.tailwind, logos.nextjs, logos.vercel, logos.neon],
  },
  {
    title: 'Web-Based Native Apps',
    description:
      'Tauri wraps a Next.js frontend into a lightweight, cross-platform desktop shell — combining web development speed with native OS integration, file access, and system menus.',
    logos: [logos.tauri, logos.nextjs],
  },
  {
    title: 'Swift Apps',
    description:
      'SwiftUI for building native Apple experiences with declarative UI, seamless system integration, and full access to platform APIs like Metal, Core Animation, and more.',
    logos: [logos.swift],
  },
]

const threeDCards = [
  {
    title: '3D Modeling & Rendering',
    description:
      'Blender for the full 3D pipeline — modeling, sculpting, texturing, shading, lighting, and rendering — used to create everything from product visuals to animated motion design.',
    logos: [logos.blender],
  },
  {
    title: 'Interactive 3D on the Web',
    description:
      'Three.js brings 3D graphics to the browser with WebGL and WebGPU support, powering real-time interactive scenes, 3D visualizations, and immersive web experiences.',
    logos: [logos.threejs],
  },
]

export function SoftwareToolCards({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 divide-x divide-zinc-950/10 sm:grid-cols-2 lg:grid-cols-3 dark:divide-white/10',
        className
      )}
    >
      {softwareCards.map((card) => (
        <ToolCard key={card.title} {...card} />
      ))}
    </div>
  )
}

export function ThreeDToolCards({ className }: { className?: string }) {
  return (
    <div className={clsx('grid grid-cols-1 gap-6 sm:grid-cols-2', className)}>
      {threeDCards.map((card) => (
        <ToolCard key={card.title} {...card} />
      ))}
    </div>
  )
}
