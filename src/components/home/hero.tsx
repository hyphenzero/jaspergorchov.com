'use client'

import { animate, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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

const THUMB_H = 512
const GRID_GAP = 53
const CENTER_Y_OFFSET = 60
const DURATION = 2
const FADE_LEAD_MS = 600
const FADED_OPACITY = 0.25

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
    project.meta.image.width && project.meta.image.height ? project.meta.image.width / project.meta.image.height : 1

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

function getFocusedTransform(centerX: number, centerY: number, vw: number, vh: number) {
  return {
    x: vw / 2 - centerX,
    y: vh / 2 - centerY - CENTER_Y_OFFSET,
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function Hero({ projects = [] }: Props) {
  const imageProjects = useMemo(() => projects.filter(hasImage), [projects])
  const [vw, setVw] = useState(0)
  const [vh, setVh] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)

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

  useLayoutEffect(() => {
    if (imageProjects.length === 0 || order.length === 0) return
    if (!wrapperRef.current || !viewportRef.current) return

    setActiveIdx(order[0])

    const wrapper = wrapperRef.current
    const w = displayVw
    const h = displayVh
    let running = true

    const firstPos = layout.positions[order[0]]
    if (firstPos) {
      const t = getFocusedTransform(firstPos.centerX, firstPos.centerY, w, h)
      wrapper.style.transform = `translate(${t.x}px, ${t.y}px)`
    }

    let currentOrderIndex = 0

    async function run() {
      while (running) {
        await delay(3000)
        if (!running) return

        const nextOrderIndex = (currentOrderIndex + 1) % order.length
        const nextProjectIdx = order[nextOrderIndex]
        const nextPos = layout.positions[nextProjectIdx]
        if (!nextPos) {
          currentOrderIndex = nextOrderIndex
          continue
        }

        const currentPos = layout.positions[order[currentOrderIndex]]
        const to = getFocusedTransform(nextPos.centerX, nextPos.centerY, w, h)

        const screenDist = Math.hypot(nextPos.centerX - currentPos.centerX, nextPos.centerY - currentPos.centerY)
        const viewportRadius = Math.min(w, h) * 0.4
        const fadeDelay = Math.max(0, ((screenDist - viewportRadius) / screenDist) * DURATION * 1000 - FADE_LEAD_MS)

        let fadeTimeout: ReturnType<typeof setTimeout> | null = null

        if (fadeDelay <= 0) {
          setActiveIdx(nextProjectIdx)
        } else {
          setActiveIdx(-1)
          fadeTimeout = setTimeout(() => {
            fadeTimeout = null
            if (running) setActiveIdx(nextProjectIdx)
          }, fadeDelay)
        }

        try {
          await animate(wrapper, { x: to.x, y: to.y }, { duration: DURATION, ease: [0.42, 0, 0.58, 1] }).finished
        } catch {
          if (fadeTimeout) clearTimeout(fadeTimeout)
          return
        }

        setActiveIdx(nextProjectIdx)
        if (fadeTimeout) clearTimeout(fadeTimeout)

        currentOrderIndex = nextOrderIndex
      }
    }

    run()

    return () => {
      running = false
    }
  }, [imageProjects.length, order, layout, displayVw, displayVh])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progress = Math.min(scrollY / 500, 1)

  if (imageProjects.length === 0) return null

  return (
    <div ref={viewportRef} className="relative isolate -z-10 size-full min-h-full overflow-hidden">
      <motion.div
        className="absolute inset-0 overflow-hidden bg-zinc-200 dark:bg-zinc-900"
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
          }}
        >
          {imageProjects.map((project, idx) => {
            const pos = layout.positions[idx]
            if (!pos) return null
            const src = getImageSrc(project)
            const darkSrc = getImageDarkSrc(project)
            return (
              <motion.div
                key={project.slug}
                className="absolute overflow-hidden rounded-xl bg-zinc-500"
                style={{
                  width: pos.width,
                  height: pos.height,
                  left: pos.x,
                  top: pos.y,
                }}
                animate={{ opacity: idx === activeIdx ? 1 : FADED_OPACITY }}
                transition={{ duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
              >
                <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />

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
        </div>
      </motion.div>

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
