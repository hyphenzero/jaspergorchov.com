'use client'

import { animate, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { SerializableProject } from '@/types/post'

type Props = {
  projects: SerializableProject[]
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

const THUMB_W = 280
const THUMB_H = 210
const GRID_GAP = 24
const GRID_PADDING = 48
const GRID_MODE_FILL = 1

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

function getTileSize(project: ProjectWithImage) {
  const ratio =
    project.meta.image.width && project.meta.image.height
      ? project.meta.image.width / project.meta.image.height
      : THUMB_W / THUMB_H

  return {
    width: Math.round(THUMB_H * ratio),
    height: THUMB_H,
  }
}

function getRowWidth(widths: number[], start: number, end: number) {
  return widths.slice(start, end).reduce((total, width) => total + width, 0) + Math.max(0, end - start - 1) * GRID_GAP
}

function getGridColumns(widths: number[], vw: number, vh: number) {
  const count = widths.length
  const targetRatio = vw / vh
  let bestColumns = 1
  let bestScore = Number.POSITIVE_INFINITY

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns)
    const width = Math.max(
      ...Array.from({ length: rows }, (_, row) =>
        getRowWidth(widths, row * columns, Math.min((row + 1) * columns, count))
      )
    )
    const height = rows * THUMB_H + (rows - 1) * GRID_GAP
    const score = Math.abs(width / height - targetRatio)

    if (score < bestScore) {
      bestColumns = columns
      bestScore = score
    }
  }

  return bestColumns
}

function getGridLayout(projects: ProjectWithImage[], vw: number, vh: number): GridLayout {
  if (projects.length === 0) {
    return { width: 0, height: 0, positions: [] }
  }

  const tileSizes = projects.map(getTileSize)
  const widths = tileSizes.map((size) => size.width)
  const count = projects.length
  const columns = getGridColumns(widths, vw, vh)
  const rows = Math.ceil(count / columns)
  const width = Math.max(
    ...Array.from({ length: rows }, (_, row) =>
      getRowWidth(widths, row * columns, Math.min((row + 1) * columns, count))
    )
  )
  const height = rows * THUMB_H + (rows - 1) * GRID_GAP
  const rowOffsets = Array.from({ length: rows }, (_, row) => {
    const rowWidth = getRowWidth(widths, row * columns, Math.min((row + 1) * columns, count))
    return (width - rowWidth) / 2
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
      const y = row * (THUMB_H + GRID_GAP)
      rowX += size.width + GRID_GAP

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

function getFitScale(layout: GridLayout, vw: number, vh: number) {
  const paddedWidth = Math.max(vw - GRID_PADDING * 2, THUMB_W)
  const paddedHeight = Math.max(vh - GRID_PADDING * 2, THUMB_H)
  const maxVisibleScale = Math.min(paddedWidth / layout.width, paddedHeight / layout.height)

  return maxVisibleScale > 1 ? Math.max(1, maxVisibleScale * GRID_MODE_FILL) : maxVisibleScale
}

function getCoverScale(position: Position, vw: number, vh: number) {
  return Math.max(vw / position.width, vh / position.height)
}

function getGridTransform(layout: GridLayout, scale: number, vw: number, vh: number) {
  return {
    x: (vw - layout.width * scale) / 2,
    y: (vh - layout.height * scale) / 2,
  }
}

function getFocusedTransform(centerX: number, centerY: number, scale: number, vw: number, vh: number) {
  return {
    x: vw / 2 - centerX * scale,
    y: vh / 2 - centerY * scale,
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function Hero({ projects = [] }: Props) {
  const imageProjects = useMemo(() => projects.filter(hasImage), [projects])
  const [vw, setVw] = useState(0)
  const [vh, setVh] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  const viewportRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

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
  const layout = useMemo(
    () => getGridLayout(imageProjects, displayVw, displayVh),
    [imageProjects, displayVw, displayVh]
  )
  const order = useMemo(() => getDistantOrder(layout.positions), [layout.positions])

  useEffect(() => {
    if (imageProjects.length === 0 || order.length === 0 || !vw || !vh) return
    if (!wrapperRef.current) return

    const wrapper = wrapperRef.current
    let running = true

    async function run() {
      const zoomOutScale = getFitScale(layout, vw, vh)
      const initial = getGridTransform(layout, zoomOutScale, vw, vh)

      let currentOrderIndex = 0

      try {
        await animate(wrapper, { x: initial.x, y: initial.y, scale: zoomOutScale }, { duration: 0 }).finished
      } catch {
        return
      }

      while (running) {
        await delay(100)
        if (!running) return

        const currentProjectIdx = order[currentOrderIndex]
        const currentPos = layout.positions[currentProjectIdx]
        if (!currentPos) continue

        const zoomInScale = getCoverScale(currentPos, vw, vh)
        const zoomIn = getFocusedTransform(currentPos.centerX, currentPos.centerY, zoomInScale, vw, vh)
        try {
          await animate(
            wrapper,
            { x: zoomIn.x, y: zoomIn.y, scale: zoomInScale },
            { duration: 1.15, ease: [0.22, 1, 0.36, 1] }
          ).finished
        } catch {
          return
        }

        if (!running) return
        await delay(3200)
        if (!running) return

        const zoomOut = getFocusedTransform(currentPos.centerX, currentPos.centerY, zoomOutScale, vw, vh)
        try {
          await animate(
            wrapper,
            { x: zoomOut.x, y: zoomOut.y, scale: zoomOutScale },
            { duration: 0.95, ease: [0.22, 1, 0.36, 1] }
          ).finished
        } catch {
          return
        }

        if (!running) return
        await delay(500)
        if (!running) return

        const nextOrderIndex = (currentOrderIndex + 1) % order.length
        const nextProjectIdx = order[nextOrderIndex]
        const nextPos = layout.positions[nextProjectIdx]
        const pan = nextPos ? getFocusedTransform(nextPos.centerX, nextPos.centerY, zoomOutScale, vw, vh) : zoomOut

        try {
          await animate(wrapper, { x: pan.x, y: pan.y }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] }).finished
        } catch {
          return
        }

        currentOrderIndex = nextOrderIndex
      }
    }

    run()

    return () => {
      running = false
    }
  }, [imageProjects.length, layout, order, vw, vh])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progress = Math.min(scrollY / 500, 1)

  if (imageProjects.length === 0) return null

  const initialScale = getFitScale(layout, displayVw, displayVh)
  const initialTransform = getGridTransform(layout, initialScale, displayVw, displayVh)

  return (
    <div ref={viewportRef} className="relative isolate -z-10 size-full min-h-full overflow-hidden">
      <motion.div
        className="absolute inset-0 overflow-hidden bg-zinc-300 dark:bg-zinc-600"
        animate={{
          top: progress * 8,
          left: progress * 8,
          right: progress * 8,
          bottom: progress * 8,
          borderRadius: progress * 30,
        }}
      >
        <div
          ref={wrapperRef}
          className="absolute top-0 left-0"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate(${initialTransform.x}px, ${initialTransform.y}px) scale(${initialScale})`,
            transformOrigin: '0 0',
          }}
        >
          {imageProjects.map((project, idx) => {
            const pos = layout.positions[idx]
            if (!pos) return null
            const src = getImageSrc(project)
            const darkSrc = getImageDarkSrc(project)
            return (
              <div
                key={project.slug}
                className="absolute overflow-hidden rounded-lg bg-zinc-800"
                style={{
                  width: pos.width,
                  height: pos.height,
                  left: pos.x,
                  top: pos.y,
                }}
              >
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
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/5 bg-linear-to-b from-white/20 dark:from-zinc-950/70" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-linear-to-t from-white/20 dark:from-zinc-950/70" />

      <motion.div
        className="pointer-events-none absolute z-20 ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10"
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
