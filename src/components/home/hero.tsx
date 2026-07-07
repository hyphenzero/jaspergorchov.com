'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { SerializableProject } from '@/types/post'

type Props = {
  projects: SerializableProject[]
  imageHeight: number
  focusCenterY: number
}

type ProjectWithImage = SerializableProject & { meta: { image: NonNullable<SerializableProject['meta']['image']> } }

function hasImage(project: SerializableProject): project is ProjectWithImage {
  return Boolean(project.meta.image?.src)
}

function getImageSrc(project: ProjectWithImage): string {
  return project.meta.image.src
}

function getImageDarkSrc(project: ProjectWithImage): string | undefined {
  return project.meta.imageDark?.src
}

const GAP_FACTOR = 0.05
const DURATION = 2
const FADE_LEAD_MS = 600
const FADED_OPACITY = 0.25
const PORTRAIT_PADDING = 12

type Position = {
  x: number
  y: number
  width: number
  height: number
  centerX: number
  centerY: number
}

type GridLayout = {
  width: number
  height: number
  positions: Position[]
}

function getTileSize(project: ProjectWithImage, tileHeight: number) {
  const ratio =
    project.meta.image.width && project.meta.image.height ? project.meta.image.width / project.meta.image.height : 1

  return {
    width: Math.round(tileHeight * ratio),
    height: tileHeight,
  }
}

function getRowWidth(widths: number[], start: number, end: number, gap: number) {
  return widths.slice(start, end).reduce((total, width) => total + width, 0) + Math.max(0, end - start - 1) * gap
}

function getGridColumns(widths: number[], tileHeight: number, gap: number) {
  const count = widths.length
  const targetRatio = 1
  let bestColumns = 1
  let bestScore = Number.POSITIVE_INFINITY

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns)
    const width = Math.max(
      ...Array.from({ length: rows }, (_, row) =>
        getRowWidth(widths, row * columns, Math.min((row + 1) * columns, count), gap)
      )
    )
    const height = rows * tileHeight + (rows - 1) * gap
    const score = Math.abs(width / height - targetRatio)

    if (score < bestScore) {
      bestColumns = columns
      bestScore = score
    }
  }

  if (bestColumns === 1 && count >= 2) {
    bestColumns = 2
  }

  return bestColumns
}

function getGridLayout(projects: ProjectWithImage[], tileHeight: number): GridLayout {
  if (projects.length === 0) {
    return { width: 0, height: 0, positions: [] }
  }

  const gap = Math.round(GAP_FACTOR * tileHeight)
  const tileSizes = projects.map((p) => getTileSize(p, tileHeight))
  const widths = tileSizes.map((size) => size.width)
  const count = projects.length
  const columns = getGridColumns(widths, tileHeight, gap)
  const rows = Math.ceil(count / columns)
  const width = Math.max(
    ...Array.from({ length: rows }, (_, row) =>
      getRowWidth(widths, row * columns, Math.min((row + 1) * columns, count), gap)
    )
  )
  const height = rows * tileHeight + (rows - 1) * gap
  const staggerOffset = Math.round(tileHeight * 0.8)
  const rowOffsets = Array.from({ length: rows }, (_, row) => {
    const rowWidth = getRowWidth(widths, row * columns, Math.min((row + 1) * columns, count), gap)
    return (width - rowWidth) / 2 + (row % 2 === 1 ? staggerOffset : 0)
  })

  let rowX = 0
  return {
    width,
    height,
    positions: Array.from({ length: count }, (_, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      const size = tileSizes[index]
      if (column === 0) rowX = rowOffsets[row]
      const x = rowX
      const y = row * (tileHeight + gap)
      rowX += size.width + gap

      return {
        x,
        y,
        width: size.width,
        height: size.height,
        centerX: x + size.width / 2,
        centerY: y + size.height / 2,
      }
    }),
  }
}

function getDistantOrder(positions: Position[]) {
  if (positions.length <= 1) return positions.map((_, index) => index)

  const order = [0]
  const unused = new Set(positions.slice(1).map((_, index) => index + 1))

  while (unused.size > 0) {
    const current = positions[order[order.length - 1]]
    let next = unused.values().next().value as number
    let nextDistance = -1

    for (const index of unused) {
      const candidate = positions[index]
      const distance = Math.hypot(candidate.centerX - current.centerX, candidate.centerY - current.centerY)

      if (distance > nextDistance) {
        next = index
        nextDistance = distance
      }
    }

    order.push(next)
    unused.delete(next)
  }

  return order
}

function getFocusedTransform(centerX: number, centerY: number, targetX: number, targetY: number, scale = 1) {
  return { x: targetX - centerX * scale, y: targetY - centerY * scale }
}

export function Hero({ projects = [], imageHeight, focusCenterY }: Props) {
  const imageProjects = useMemo(() => projects.filter(hasImage), [projects])
  const [vw, setVw] = useState(0)
  const [vh, setVh] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)

  const viewportRef = useRef<HTMLDivElement>(null)
  const [wrapperTarget, setWrapperTarget] = useState({ x: 0, y: 0 })
  const [instantTransition, setInstantTransition] = useState(false)
  const currentIdxRef = useRef(0)

  useEffect(() => {
    const update = () => {
      const rect = viewportRef.current?.getBoundingClientRect()
      setVw(rect?.width || window.innerWidth)
      setVh(rect?.height || window.innerHeight)
    }

    update()
    const observer = new ResizeObserver(update)
    if (viewportRef.current) observer.observe(viewportRef.current)
    window.addEventListener('resize', update, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const displayVw = vw || 1200
  const displayVh = vh || 800
  const tileHeight = imageHeight || 512
  const isPortrait = useMemo(() => {
    if (imageProjects.length === 0) return false
    const h = tileHeight
    return imageProjects.some((p) => {
      const ratio = p.meta.image.width && p.meta.image.height ? p.meta.image.width / p.meta.image.height : 1
      return h * ratio > (displayVw || 1200)
    })
  }, [imageProjects, tileHeight, displayVw])

  const layout = useMemo(() => getGridLayout(imageProjects, tileHeight), [imageProjects, tileHeight])
  const order = useMemo(() => getDistantOrder(layout.positions), [layout.positions])

  const orderRef = useRef(order)
  orderRef.current = order
  const layoutRef = useRef(layout)
  layoutRef.current = layout
  const focusCenterYRef = useRef(focusCenterY)
  focusCenterYRef.current = focusCenterY
  const displayVwRef = useRef(displayVw)
  displayVwRef.current = displayVw
  const displayVhRef = useRef(displayVh)
  displayVhRef.current = displayVh
  const imageProjectsRef = useRef(imageProjects)
  imageProjectsRef.current = imageProjects
  const isPortraitRef = useRef(isPortrait)
  isPortraitRef.current = isPortrait
  const tileHeightRef = useRef(tileHeight)
  tileHeightRef.current = tileHeight

  useEffect(() => {
    if (imageProjects.length === 0 || order.length === 0) return

    const currentOrder = orderRef.current
    const positions = layoutRef.current.positions

    setActiveIdx(currentOrder[0])
    currentIdxRef.current = currentOrder[0]

    const targetY = focusCenterYRef.current || displayVhRef.current / 2 - 60
    const firstPos = positions[currentOrder[0]]
    if (firstPos) {
      const firstProject = imageProjectsRef.current[currentOrder[0]]
      const firstRatio =
        firstProject?.meta.image.width && firstProject?.meta.image.height
          ? firstProject.meta.image.width / firstProject.meta.image.height
          : 1.6
      const firstScale = isPortraitRef.current
        ? (displayVwRef.current - 2 * PORTRAIT_PADDING) / (tileHeightRef.current * firstRatio)
        : 1
      setWrapperTarget(
        getFocusedTransform(firstPos.centerX, firstPos.centerY, displayVwRef.current / 2, targetY, firstScale)
      )
      setInstantTransition(false)
    }

    let running = true
    let fadeTimeoutId: ReturnType<typeof setTimeout> | null = null
    let tickTimeoutId: ReturnType<typeof setTimeout> | null = null

    function tick() {
      if (!running) return

      const o = orderRef.current
      const pos = layoutRef.current.positions
      const w = displayVwRef.current
      const h = displayVhRef.current
      const targetY = focusCenterYRef.current || h / 2 - 60

      const currentIdx = currentIdxRef.current
      const currentOrderIdx = o.indexOf(currentIdx)
      const nextOrderIdx = (currentOrderIdx + 1) % o.length
      const nextProjectIdx = o[nextOrderIdx]
      const nextPos = pos[nextProjectIdx]

      if (!nextPos) {
        currentIdxRef.current = nextProjectIdx
        tickTimeoutId = setTimeout(tick, 3000 + DURATION * 1000)
        return
      }

      const currentPos = pos[o[currentOrderIdx]]
      const nextProject = imageProjectsRef.current[nextProjectIdx]
      const nextRatio =
        nextProject?.meta.image.width && nextProject?.meta.image.height
          ? nextProject.meta.image.width / nextProject.meta.image.height
          : 1.6
      const nextScale = isPortraitRef.current ? (w - 2 * PORTRAIT_PADDING) / (tileHeightRef.current * nextRatio) : 1
      const to = getFocusedTransform(nextPos.centerX, nextPos.centerY, w / 2, targetY, nextScale)

      setWrapperTarget(to)
      setInstantTransition(false)

      const screenDist = Math.hypot(nextPos.centerX - currentPos.centerX, nextPos.centerY - currentPos.centerY)
      const viewportRadius = Math.min(w, h) * 0.4
      const fadeDelay = Math.max(0, ((screenDist - viewportRadius) / screenDist) * DURATION * 1000 - FADE_LEAD_MS)

      if (fadeDelay <= 0) {
        setActiveIdx(nextProjectIdx)
      } else {
        setActiveIdx(-1)
        fadeTimeoutId = setTimeout(() => {
          fadeTimeoutId = null
          if (running) setActiveIdx(nextProjectIdx)
        }, fadeDelay)
      }

      currentIdxRef.current = nextProjectIdx

      tickTimeoutId = setTimeout(tick, 3000 + DURATION * 1000)
    }

    tickTimeoutId = setTimeout(tick, 3000 + DURATION * 1000)

    return () => {
      running = false
      if (tickTimeoutId) clearTimeout(tickTimeoutId)
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId)
    }
  }, [imageProjects.length])

  useLayoutEffect(() => {
    const idx = Math.min(currentIdxRef.current, layout.positions.length - 1)
    const pos = layout.positions[idx]
    if (!pos) return
    const h = displayVh || 800
    const targetY = focusCenterY || h / 2 - 60
    const currentProject = imageProjects[idx]
    const curRatio =
      currentProject?.meta.image.width && currentProject?.meta.image.height
        ? currentProject.meta.image.width / currentProject.meta.image.height
        : 1.6
    const resizeScale = isPortrait
      ? ((displayVw || 1200) - 2 * PORTRAIT_PADDING) / ((imageHeight || 512) * curRatio)
      : 1
    setInstantTransition(true)
    setWrapperTarget(getFocusedTransform(pos.centerX, pos.centerY, (displayVw || 1200) / 2, targetY, resizeScale))
    setInstantTransition(true)
    setWrapperTarget(getFocusedTransform(pos.centerX, pos.centerY, (displayVw || 1200) / 2, targetY, resizeScale))
  }, [focusCenterY, layout, displayVw, displayVh, isPortrait, imageProjects, imageHeight])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progress = Math.min(scrollY / 500, 1)

  const effectiveIdx = activeIdx >= 0 ? activeIdx : currentIdxRef.current
  const activeProject = imageProjects[effectiveIdx]
  const activeRatio =
    activeProject?.meta.image.width && activeProject?.meta.image.height
      ? activeProject.meta.image.width / activeProject.meta.image.height
      : 1.6
  const portraitScale = isPortrait ? (displayVw - 2 * PORTRAIT_PADDING) / (tileHeight * activeRatio) : 1

  if (imageProjects.length === 0) return null

  return (
    <div ref={viewportRef} className="relative isolate -z-10 size-full min-h-full overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900"
        animate={{
          clipPath: `inset(${progress * 8}px round ${progress * 30}px)`,
        }}
      >
        <motion.div
          className="absolute top-0 left-0"
          style={{
            width: layout.width,
            height: layout.height,
            transformOrigin: '0 0',
          }}
          animate={{ x: wrapperTarget.x, y: wrapperTarget.y, scale: portraitScale }}
          transition={instantTransition ? { duration: 0 } : { duration: DURATION, ease: [0.42, 0, 0.58, 1] }}
        >
          {imageProjects.map((project, idx) => {
            const pos = layout.positions[idx]
            if (!pos) return null
            const src = getImageSrc(project)
            const darkSrc = getImageDarkSrc(project)
            return (
              <motion.div
                key={project.slug}
                className="absolute overflow-hidden rounded-2xl bg-zinc-500"
                style={{
                  width: pos.width,
                  height: pos.height,
                  left: pos.x,
                  top: pos.y,
                }}
                animate={{ opacity: idx === activeIdx ? 1 : FADED_OPACITY }}
                transition={{ duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
              >
                <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />

                {darkSrc ? (
                  <>
                    <Image
                      src={src}
                      alt={project.meta.title}
                      fill
                      priority
                      unoptimized
                      className="dark:hidden! object-cover"
                      sizes={`${Math.ceil(pos.width)}px`}
                    />
                    <Image
                      src={darkSrc}
                      alt={project.meta.title}
                      fill
                      priority
                      unoptimized
                      className="not-dark:hidden! absolute inset-0 object-cover"
                      sizes={`${Math.ceil(pos.width)}px`}
                    />
                  </>
                ) : (
                  <Image
                    src={src}
                    alt={project.meta.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                    sizes={`${Math.ceil(pos.width)}px`}
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10"
        animate={{
          opacity: progress,
          top: progress * 8,
          left: progress * 8,
          right: progress * 8,
          bottom: progress * 8,
          borderRadius: progress * 30,
        }}
      />
    </div>
  )
}

export default Hero
