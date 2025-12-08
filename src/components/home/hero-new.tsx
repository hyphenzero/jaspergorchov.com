'use client'

import { Environment, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three-stdlib'

export type ElementProps = {
  progressRef?: React.RefObject<number>
  elapsedRef?: React.RefObject<number>
  // legacy: components can still accept a dipRef prop if desired
  dipRef?: React.RefObject<number>
}

const elementRegistry: Record<string, React.FC<ElementProps>> = {
  'torus-knot': TorusKnotGlass,
  'blender-cube': BlenderCube as unknown as React.FC<ElementProps>,
  'cursor-selection': CursorSelection,
}

// The normal speed when the dip is not applied
export const OUTSIDE_DIP_SPEED = 2.5

// How much speed the dip subtracts at its peak
export const DIP_SPEED_REDUCTION = 2.3

// How much vertical position offset the dip applies (applied centrally in Scene)
export const DIP_POSITION_AMPLITUDE = 0.6

// How much rotation (radians) the dip can add to objects that opt into it
export const DIP_ROTATION_ANGLE = Math.PI * 0.18

// Scale applied to viewport half-height when computing dip width. Smaller
// values make the dip zone narrower (shorter). Change to taste.
export const DIP_WIDTH_SCALE = 0.6

// A tiny shared "dip API" – components can read the current dip (0..1)
// from this context. We store a mutable ref so consumers can read it inside
// `useFrame` without re-renders.
export const DipContext = React.createContext<React.RefObject<number> | null>(null)

// Convenience hook to read the dip ref from context with a safe fallback.
export function useDip() {
  const ctx = React.useContext(DipContext)
  return ctx ?? ({ current: 0 } as React.RefObject<number>)
}

// A small wrapper that handles rotation interpolation between two eulers and
// applies an optional extra rotation based on the dip value. This lets visual
// components focus on geometry/materials while the wrapper handles animated
// rotation behavior.
function ElementWrapper({ scale = 1, children }: { scale?: number; children: React.ReactNode }) {
  // lightweight wrapper that only provides a group + scale. Rotation and
  // dip-driven animation should be implemented inside specific elements so
  // they can use the dip value as they need.
  const elRef = useRef<THREE.Group>(null)

  return (
    <group ref={elRef} scale={scale}>
      {children}
    </group>
  )
}

type ElementDescriptor = {
  id: string
  kind: keyof typeof elementRegistry
}

export function Hero(): React.ReactElement {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
        <Scene />
      </Canvas>
    </div>
  )
}

export const DEFAULT_DIP_CENTER_OFFSET = 1

export function Scene({
  dipCenterOffset = DEFAULT_DIP_CENTER_OFFSET,
}: {
  dipCenterOffset?: number
}): React.ReactElement | null {
  // deterministic queue: torus knot first, blender cube second, cursor selection third
  const elements: ElementDescriptor[] = [
    { id: 'tk-1', kind: 'torus-knot' },
    { id: 'bc-1', kind: 'blender-cube' },
    { id: 'cs-1', kind: 'cursor-selection' },
  ]

  const [order, setOrder] = useState<number[]>([])
  const [activeSpawn, setActiveSpawn] = useState<number>(-1)
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  // shared anim state
  const progress = useRef(0)
  const elapsed = useRef(0)
  const baseSpeed = useRef(0.25 + Math.random() * 0.05)
  const dipRef = useRef(0)

  useEffect(() => {
    const indexes = elements.map((_, i) => i)
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indexes[i], indexes[j]] = [indexes[j], indexes[i]]
    }
    setOrder(indexes)
    setActiveSpawn(0)
  }, [])

  useFrame((_, delta) => {
    if (activeSpawn < 0 || !groupRef.current) return
    elapsed.current += delta

    const totalTravel = viewport.height + 4
    const startY = -viewport.height / 2 - 2
    const endY = startY + totalTravel

    // current Y without easing
    let rawY = startY + progress.current * totalTravel

    // midpoint of the path (configurable vertical offset applied here so the
    // dip can be positioned anywhere along the Y axis)
    const midY = (startY + endY) / 2 + dipCenterOffset

    // distance from path center
    const distanceFromCenter = rawY - midY
    const dip = Math.exp(-Math.pow(distanceFromCenter / ((viewport.height / 2) * DIP_WIDTH_SCALE), 2))
    // write dip into shared ref so elements can react to it
    dipRef.current = dip
    // Compute speed as the normal outside-dip speed minus the dip's reduction
    // (dip ranges 0..1). Clamp to avoid negative or extreme velocities.
    let speedFactor = OUTSIDE_DIP_SPEED - dip * DIP_SPEED_REDUCTION
    const MIN_SPEED = 0.1
    const MAX_SPEED = 3.0
    speedFactor = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speedFactor))

    progress.current += delta * baseSpeed.current * speedFactor
    const y = startY + progress.current * totalTravel

    // Apply a centralized vertical offset based on the dip. This means every
    // element's position will be affected the same way and individual elements
    // only need to read `dipRef` if they want to react to the dip for other
    // properties (rotation, scale, etc.). The offset pulls objects slightly
    // upward/downward around the scene center.
    const dipOffset = -dipRef.current * DIP_POSITION_AMPLITUDE

    groupRef.current.position.set(0, y + dipOffset, 0)
    // rotation intentionally moved into the element implementation (torus knot)
    // so the cube remains unrotated.

    if (progress.current >= 1) {
      progress.current = 0
      setActiveSpawn((s) => (s + 1) % elements.length)
    }
  })

  const idx = order[activeSpawn]
  if (idx === undefined) return null
  const desc = elements[idx]
  const Component = elementRegistry[desc.kind]

  return (
    <>
      {/* add an environment for realistic reflections/refractions — use as background so glass refracts it */}
      <Environment preset="sunset" background={false} />
      <ambientLight intensity={0.5} />
      {/* Provide dipRef via context so components can consume it easily inside useFrame */}
      <DipContext.Provider value={dipRef}>
        <group ref={groupRef}>
          {Component && (
            <Component
              progressRef={progress as unknown as React.RefObject<number>}
              elapsedRef={elapsed as unknown as React.RefObject<number>}
              dipRef={dipRef as unknown as React.RefObject<number>}
            />
          )}
        </group>
      </DipContext.Provider>
    </>
  )
}

function BlenderCube() {
  // Use fixed hex colors for the axis arrows (no CSS vars / Tailwind lookup)
  const red = '#ef4444'
  const blue = '#3b82f6'
  const lime = '#84cc16'
  // keep an orange outline color (hard-coded)
  const orange = '#fb923c'

  const cubeSize = 1.2
  const cubeHalf = cubeSize / 2

  // arrow geometry params
  const shaftRadius = 0.03
  // shortened shafts so arrows sit closer to the cube
  const shaftLength = 0.5
  // shortened tips and slightly smaller radius to match new scale
  const tipLength = 0.12
  const tipRadius = 0.06

  // using simple ConeGeometry for arrow tips (no rounded lathe smoothing)

  return (
    <group>
      {/* outline: render a slightly scaled back-side mesh to create a silhouette-only outline */}
      <RoundedBox args={[cubeSize, cubeSize, cubeSize]} radius={0.06} smoothness={6} scale={1.06} renderOrder={0}>
        <meshBasicMaterial color={new THREE.Color(orange)} side={THREE.BackSide} />
      </RoundedBox>

      {/* main cube */}
      <RoundedBox args={[cubeSize, cubeSize, cubeSize]} radius={0.06} smoothness={6} castShadow receiveShadow>
        <meshStandardMaterial color={new THREE.Color('#0b1220')} metalness={0.1} roughness={0.6} />
      </RoundedBox>

      {/* X axis arrows (red) - positive and negative */}
      {/* positive X */}
      <group position={[cubeHalf + shaftLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={new THREE.Color(red)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
      <group position={[cubeHalf + shaftLength + tipLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh>
          <coneGeometry args={[tipRadius, tipLength, 24, 6, false]} />
          <meshStandardMaterial color={new THREE.Color(red)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>

      {/* negative X */}
      <group position={[-(cubeHalf + shaftLength / 2), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={new THREE.Color(red)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
      <group position={[-(cubeHalf + shaftLength + tipLength / 2), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <coneGeometry args={[tipRadius, tipLength, 24, 6, false]} />
          <meshStandardMaterial color={new THREE.Color(red)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>

      {/* Y axis arrows (blue) - up and down */}
      {/* up (+Y) */}
      <group position={[0, cubeHalf + shaftLength / 2, 0]}>
        <mesh>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={new THREE.Color(blue)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
      <group position={[0, cubeHalf + shaftLength + tipLength / 2, 0]}>
        <mesh>
          <coneGeometry args={[tipRadius, tipLength, 24, 6, false]} />
          <meshStandardMaterial color={new THREE.Color(blue)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
      {/* down (-Y) */}
      <group position={[0, -(cubeHalf + shaftLength / 2), 0]} rotation={[Math.PI, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={new THREE.Color(blue)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
      <group position={[0, -(cubeHalf + shaftLength + tipLength / 2), 0]} rotation={[Math.PI, 0, 0]}>
        <mesh>
          <coneGeometry args={[tipRadius, tipLength, 24, 6, false]} />
          <meshStandardMaterial color={new THREE.Color(blue)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>

      {/* Z axis arrows (lime) - positive and negative (side to side) */}
      {/* positive Z */}
      <group position={[0, 0, cubeHalf + shaftLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={new THREE.Color(lime)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
      <group position={[0, 0, cubeHalf + shaftLength + tipLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <coneGeometry args={[tipRadius, tipLength, 24, 6, false]} />
          <meshStandardMaterial color={new THREE.Color(lime)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
      {/* negative Z */}
      <group position={[0, 0, -(cubeHalf + shaftLength / 2)]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={new THREE.Color(lime)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
      <group position={[0, 0, -(cubeHalf + shaftLength + tipLength / 2)]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <coneGeometry args={[tipRadius, tipLength, 24, 6, false]} />
          <meshStandardMaterial color={new THREE.Color(lime)} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

function CursorSelection({ progressRef, dipRef }: ElementProps) {
  const selectionBoxRef = useRef<THREE.Group>(null)
  const cursorRef = useRef<THREE.Group>(null)
  const [svgShapes, setSvgShapes] = useState<{
    selectionBox: THREE.Group | null
    cursor: THREE.Group | null
  }>({ selectionBox: null, cursor: null })

  // Load and parse SVG files
  useEffect(() => {
    const loader = new SVGLoader()

    const loadSVG = async () => {
      try {
        // Load selection box SVG
        const selectionResponse = await fetch('/selection-box.svg')
        const selectionText = await selectionResponse.text()
        const selectionData = loader.parse(selectionText)

        // Load cursor SVG
        const cursorResponse = await fetch('/cursor.svg')
        const cursorText = await cursorResponse.text()
        const cursorData = loader.parse(cursorText)

        // Create selection box group
        const selectionGroup = new THREE.Group()

        // Parse the SVG text to extract stroke and fill information
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(selectionText, 'image/svg+xml')
        const rects = svgDoc.querySelectorAll('rect')

        selectionData.paths.forEach((path, pathIndex) => {
          const shapes = SVGLoader.createShapes(path)
          const correspondingRect = rects[pathIndex]

          shapes.forEach((shape) => {
            // Get attributes from the corresponding SVG element
            const fill = correspondingRect?.getAttribute('fill') || 'none'
            const stroke = correspondingRect?.getAttribute('stroke') || 'none'
            const strokeWidth = correspondingRect?.getAttribute('stroke-width') || '0'

            // Handle stroke-only elements (like the main border)
            if (stroke !== 'none' && fill === 'none') {
              const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
                depth: 0.05,
                bevelEnabled: false,
              })

              const material = new THREE.MeshStandardMaterial({
                color: stroke, // Use the stroke color
                metalness: 0.1,
                roughness: 0.4,
              })

              const mesh = new THREE.Mesh(extrudeGeometry, material)
              selectionGroup.add(mesh)
            }
            // Handle filled elements with potential strokes (corner squares)
            else if (fill !== 'none') {
              // Create the fill
              const fillGeometry = new THREE.ExtrudeGeometry(shape, {
                depth: 0.08,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelSegments: 3,
              })

              const fillMaterial = new THREE.MeshStandardMaterial({
                color: fill,
                metalness: 0.1,
                roughness: 0.4,
              })

              const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial)
              selectionGroup.add(fillMesh)

              // Add stroke outline if present
              if (stroke !== 'none') {
                const strokeGeometry = new THREE.ExtrudeGeometry(shape, {
                  depth: 0.09,
                  bevelEnabled: false,
                })

                const strokeMaterial = new THREE.MeshStandardMaterial({
                  color: stroke,
                  metalness: 0.1,
                  roughness: 0.4,
                })

                const strokeMesh = new THREE.Mesh(strokeGeometry, strokeMaterial)
                strokeMesh.scale.setScalar(1.05) // Make it slightly larger for border effect
                strokeMesh.position.z = -0.01 // Position behind fill
                selectionGroup.add(strokeMesh)
              }
            }
            // Fallback
            else {
              const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
                depth: 0.05,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelSegments: 3,
              })

              const material = new THREE.MeshStandardMaterial({
                color: '#0EA5E9',
                metalness: 0.1,
                roughness: 0.4,
              })

              const mesh = new THREE.Mesh(extrudeGeometry, material)
              selectionGroup.add(mesh)
            }
          })
        })

        // Scale and center selection box, flip Y to correct orientation
        selectionGroup.scale.set(1, -1, 1) // Flip Y coordinate to correct SVG orientation
        const selectionBox = new THREE.Box3().setFromObject(selectionGroup)
        const selectionSize = selectionBox.getSize(new THREE.Vector3())
        const maxDim = Math.max(selectionSize.x, selectionSize.y)
        const scale = 2.5 / maxDim // Target size
        selectionGroup.scale.set(scale, -scale, scale) // Keep Y flipped
        selectionGroup.position.set(-selectionSize.x * scale * 0.5, selectionSize.y * scale * 0.5, 0)

        // Create cursor group
        const cursorGroup = new THREE.Group()
        cursorData.paths.forEach((path) => {
          const shapes = SVGLoader.createShapes(path)
          shapes.forEach((shape) => {
            // Create extruded geometry for depth
            const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
              depth: 0.15, // Slightly more depth for cursor to appear in front
              bevelEnabled: true,
              bevelThickness: 0.02,
              bevelSize: 0.02,
              bevelSegments: 3,
            })

            // Use the correct colors from the cursor SVG (white and black)
            let materialColor = '#ffffff' // Default white
            if (path.color && path.color instanceof THREE.Color) {
              materialColor = '#' + path.color.getHexString()
            }

            const material = new THREE.MeshStandardMaterial({
              color: materialColor,
              metalness: 0.1,
              roughness: 0.4,
            })

            const mesh = new THREE.Mesh(extrudeGeometry, material)
            cursorGroup.add(mesh)
          })
        })

        // Scale and position cursor, flip Y to correct orientation
        cursorGroup.scale.set(1, -1, 1) // Flip Y coordinate to correct SVG orientation
        const cursorBox = new THREE.Box3().setFromObject(cursorGroup)
        const cursorSize = cursorBox.getSize(new THREE.Vector3())
        const cursorMaxDim = Math.max(cursorSize.x, cursorSize.y)
        const cursorScale = 0.8 / cursorMaxDim // Smaller than selection box
        cursorGroup.scale.set(cursorScale, -cursorScale, cursorScale) // Keep Y flipped

        // Position cursor at bottom right of selection box, and in front (positive Z)
        cursorGroup.position.set(
          selectionSize.x * scale * 0.3, // Right side
          -selectionSize.y * scale * 0.4, // Bottom (note: adjusted for flipped coordinates)
          0.3 // In front
        )

        setSvgShapes({
          selectionBox: selectionGroup,
          cursor: cursorGroup,
        })
      } catch (error) {
        console.error('Error loading SVG files:', error)
      }
    }

    loadSVG()
  }, [])

  const dipValue = useDip()

  useFrame((_, delta) => {
    if (!progressRef || !selectionBoxRef.current || !cursorRef.current) return

    const dip = dipValue.current || 0

    // Apply rotation based on dip for selection box (subtle)
    const rotationAmount = dip * (Math.PI * 0.05) // Much subtler rotation than torus knot
    selectionBoxRef.current.rotation.z = rotationAmount

    // For cursor parallax effect, we need to track its own progress with 1.5x speed
    // This means the cursor moves faster than the selection box, creating parallax
    const baseProgress = progressRef.current || 0

    // Calculate cursor's independent movement with 1.5x multiplier
    const cursorSpeedMultiplier = 1.5

    // Apply the same dip-based speed variation but with the multiplier
    const baseCursorSpeed = OUTSIDE_DIP_SPEED * cursorSpeedMultiplier
    const dipSpeedReduction = DIP_SPEED_REDUCTION * cursorSpeedMultiplier
    let cursorSpeedFactor = baseCursorSpeed - dip * dipSpeedReduction
    const MIN_SPEED = 0.1
    const MAX_SPEED = 4.5 // Higher max for cursor
    cursorSpeedFactor = Math.max(MIN_SPEED, Math.min(MAX_SPEED, cursorSpeedFactor))

    // Calculate relative offset based on progress difference
    const progressDiff = baseProgress * (cursorSpeedMultiplier - 1)
    const parallaxOffset = progressDiff * 0.8 // Scale down the visual offset

    // Add subtle floating motion to cursor based on dip
    const floatOffset = Math.sin(dip * Math.PI) * 0.1
    cursorRef.current.position.y = floatOffset + parallaxOffset

    // Slight rotation for cursor based on dip
    cursorRef.current.rotation.z = dip * (Math.PI * 0.08)
  })

  return (
    <ElementWrapper scale={1}>
      <group ref={selectionBoxRef}>{svgShapes.selectionBox && <primitive object={svgShapes.selectionBox} />}</group>
      <group ref={cursorRef}>{svgShapes.cursor && <primitive object={svgShapes.cursor} />}</group>
    </ElementWrapper>
  )
}

function TorusKnotGlass({ progressRef }: ElementProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const totalAngle = useMemo(() => Math.PI * 1.7, [])

  const matcap = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/refraction-matcap-3.png')
    tex.anisotropy = 4
    tex.flipY = false
    tex.needsUpdate = true
    return tex
  }, [])

  useFrame(() => {
    if (!meshRef.current || !progressRef) return

    const t = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1)
    meshRef.current.rotation.set(0, t * totalAngle, 0)
  })

  // Detect light/dark preference and use a lighter gray in light mode only.
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-color-scheme: light)').matches
  })

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = (e: MediaQueryListEvent) => setIsLight(Boolean(e.matches))

    // Prefer modern addEventListener/removeEventListener when available.
    // Fall back to legacy addListener/removeListener only for older browsers.
    if ('addEventListener' in mq) {
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }

    // Legacy fallback (older Safari). Cast to any to avoid TS deprecated API warnings.
    const legacy = mq as any
    if (typeof legacy.addListener === 'function') {
      legacy.addListener(handler)
      return () => legacy.removeListener(handler)
    }
    return undefined
  }, [])

  const color = isLight ? '#ffffff' : '#7f7f7f'

  return (
    <ElementWrapper scale={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.6, 0.18, 240, 32, 2, 3]} />
        <meshMatcapMaterial matcap={matcap} color={color} />
      </mesh>
    </ElementWrapper>
  )
}
