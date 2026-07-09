'use client'

import { ArrowUpRightIcon } from '@heroicons/react/16/solid'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ProjectVideoOverlay } from '@/components/project-video'
import { useVideoCache } from '@/components/video-cache-context'
import type { SerializableProject } from '@/types/post'

type Props = {
  projects: SerializableProject[]
  imageHeight: number
  focusCenterY: number
}

const MIN_LOADING_MS = 500

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
const LOGO_PATH =
  'M478.791 0C511.852 0 542.042 6.53358 569.362 19.5996C596.682 32.4677 619.152 50.4829 636.771 73.6455C654.589 96.6101 665.676 123.336 670.031 153.823H590.149C584.606 128.879 572.036 108.785 552.437 93.541C533.035 78.0994 509.18 70.379 480.87 70.3789C454.342 70.3789 431.377 76.9115 411.976 89.9775C392.574 103.044 377.529 121.455 366.839 145.212C356.346 168.77 351.1 196.585 351.1 228.656C351.1 260.53 356.445 288.345 367.136 312.102C377.826 335.66 392.872 353.972 412.272 367.038C431.872 379.906 454.936 386.34 481.464 386.34C503.241 386.34 522.642 381.985 539.667 373.274C556.89 364.366 570.452 351.992 580.351 336.154C588.762 322.697 593.67 307.452 595.077 290.421H492.748V228.359H673.001V272.606C673.001 308.439 664.586 340.213 647.759 367.929C631.129 395.645 608.264 417.422 579.162 433.26C550.06 448.899 516.9 456.719 479.682 456.719C438.9 456.719 402.869 447.117 371.59 427.914C340.31 408.711 315.861 381.985 298.241 347.736C291.595 334.671 286.219 320.812 282.108 306.162V319.525C282.108 363.277 269.24 396.933 243.504 420.491C217.966 444.049 183.518 455.828 140.163 455.828C97.4015 455.828 63.351 443.95 38.0107 420.193C12.6705 396.437 2.69093e-05 362.485 0 318.338V290.424H75.4268V318.635C75.4268 341.401 81.1681 358.823 92.6504 370.899C104.331 382.778 119.871 388.717 139.272 388.717C158.871 388.717 174.412 382.777 185.895 370.899C197.575 358.823 203.415 341.401 203.415 318.635V7.12793H282.108V150.432C286.341 135.309 291.916 121.096 298.836 107.795C316.851 73.5462 341.399 47.0181 372.48 28.2109C403.76 9.4037 439.197 0 478.791 0Z'

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

function getTileSize(tileHeight: number) {
  return {
    width: Math.round(tileHeight * 1.6),
    height: tileHeight,
  }
}

function getRowWidth(widths: number[], start: number, end: number, gap: number) {
  return widths.slice(start, end).reduce((total, width) => total + width, 0) + Math.max(0, end - start - 1) * gap
}

function getGridColumns(count: number) {
  if (count <= 1) return 1

  let bestColumns = 1
  let bestDiff = Number.POSITIVE_INFINITY

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns)
    const diff = Math.abs(columns - rows)

    if (diff < bestDiff || (diff === bestDiff && columns > bestColumns)) {
      bestColumns = columns
      bestDiff = diff
    }
  }

  return Math.max(2, bestColumns)
}

function getGridLayout(projects: ProjectWithImage[], tileHeight: number): GridLayout {
  if (projects.length === 0) {
    return { width: 0, height: 0, positions: [] }
  }

  const gap = Math.round(GAP_FACTOR * tileHeight)
  const tileSizes = projects.map(() => getTileSize(tileHeight))
  const widths = tileSizes.map((size) => size.width)
  const count = projects.length
  const columns = getGridColumns(count)
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

function randomPermutation(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getFocusedTransform(centerX: number, centerY: number, targetX: number, targetY: number, scale = 1) {
  return { x: targetX - centerX * scale, y: targetY - centerY * scale }
}

export function Hero({ projects = [], imageHeight, focusCenterY }: Props) {
  const filteredProjects = useMemo(() => projects.filter(hasImage), [projects])
  const [imageProjects, setImageProjects] = useState(filteredProjects)
  const [vw, setVw] = useState(0)
  const [vh, setVh] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [shuffled, setShuffled] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState<'loading' | 'revealing' | 'done'>('loading')

  const centerIdx = Math.floor(imageProjects.length / 2)

  const [activeIdx, setActiveIdx] = useState(centerIdx)
  const [lingeringVideoIdx, setLingeringVideoIdx] = useState<number | null>(null)
  const [videoActiveIdx, setVideoActiveIdx] = useState(centerIdx)

  const viewportRef = useRef<HTMLDivElement>(null)
  const [wrapperTarget, setWrapperTarget] = useState({ x: 0, y: 0 })
  const [instantTransition, setInstantTransition] = useState(true)
  const currentIdxRef = useRef(centerIdx)
  const { preload } = useVideoCache()

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
    return tileHeight * 1.6 > (displayVw || 1200)
  }, [imageProjects.length, tileHeight, displayVw])

  const layout = useMemo(() => getGridLayout(imageProjects, tileHeight), [imageProjects, tileHeight])
  const activeRatio = 1.6
  const portraitScale = isPortrait ? (displayVw - 2 * PORTRAIT_PADDING) / (tileHeight * activeRatio) : 1

  const centerTarget = useMemo(() => {
    const idx = Math.min(centerIdx, Math.max(0, layout.positions.length - 1))
    const pos = layout.positions[idx]
    if (!pos) return { x: 0, y: 0 }
    const targetY = focusCenterY || displayVh / 2 - 60
    return getFocusedTransform(pos.centerX, pos.centerY, displayVw / 2, targetY, portraitScale)
  }, [centerIdx, layout.positions, focusCenterY, displayVh, displayVw, portraitScale])

  const [order, setOrder] = useState<number[]>(() => filteredProjects.map((_, i) => i))

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
    if (filteredProjects.length === 0) return

    const shuffled = [...filteredProjects]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const newOrder = randomPermutation(shuffled.length)

    const centerPos = newOrder.indexOf(centerIdx)
    newOrder[centerPos] = newOrder[0]
    newOrder[0] = centerIdx

    setImageProjects(shuffled)
    setOrder(newOrder)

    currentIdxRef.current = centerIdx

    const positions = layoutRef.current.positions
    const targetY = focusCenterYRef.current || displayVhRef.current / 2 - 60
    const firstPos = positions[centerIdx]
    if (firstPos) {
      const firstScale = isPortraitRef.current
        ? (displayVwRef.current - 2 * PORTRAIT_PADDING) / (tileHeightRef.current * activeRatio)
        : 1
      setWrapperTarget(
        getFocusedTransform(firstPos.centerX, firstPos.centerY, displayVwRef.current / 2, targetY, firstScale)
      )
      setInstantTransition(false)
    }

    setShuffled(true)

    const loadedAt = Date.now()
    const finishLoading = () => {
      const elapsed = Date.now() - loadedAt
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
      setTimeout(() => setLoadingPhase('revealing'), remaining)
    }

    let running = true
    let fadeTimeoutId: ReturnType<typeof setTimeout> | null = null
    let tickTimeoutId: ReturnType<typeof setTimeout> | null = null
    let lingeringTimeoutId: ReturnType<typeof setTimeout> | null = null

    function tick() {
      if (!running) return
      if (document.querySelector('[data-active="true"]')?.matches(':hover')) {
        tickTimeoutId = setTimeout(tick, 200)
        return
      }

      const o = orderRef.current
      const pos = layoutRef.current.positions
      const w = displayVwRef.current
      const h = displayVhRef.current
      const targetY = focusCenterYRef.current || h / 2 - 60

      const currentIdx = currentIdxRef.current
      const currentOrderIdx = o.indexOf(currentIdx)
      const nextOrderIdx = (currentOrderIdx + 1) % o.length

      let nextProjectIdx
      if (nextOrderIdx === 0) {
        const lastThree = o.slice(-3)
        let newOrder = randomPermutation(o.length)
        while (
          (newOrder[0] === currentIdx && o.length > 1) ||
          (o.length >= 6 && lastThree.some((idx) => newOrder.slice(0, 3).includes(idx)))
        ) {
          newOrder = randomPermutation(o.length)
        }
        const centerPos = newOrder.indexOf(centerIdx)
        newOrder[centerPos] = newOrder[0]
        newOrder[0] = centerIdx
        setOrder(newOrder)
        orderRef.current = newOrder
        nextProjectIdx = newOrder[0]
      } else {
        nextProjectIdx = o[nextOrderIdx]
      }

      const nextPos = pos[nextProjectIdx]

      if (!nextPos) {
        currentIdxRef.current = nextProjectIdx
        tickTimeoutId = setTimeout(tick, 3000 + DURATION * 1000)
        return
      }

      const projects = imageProjectsRef.current
      const nextProject = projects[nextProjectIdx]
      if (nextProject?.meta.video) {
        preload(nextProject.meta.video)
      }

      const currentPos = pos[o[currentOrderIdx]]
      const nextScale = isPortraitRef.current ? (w - 2 * PORTRAIT_PADDING) / (tileHeightRef.current * activeRatio) : 1
      const to = getFocusedTransform(nextPos.centerX, nextPos.centerY, w / 2, targetY, nextScale)

      setWrapperTarget(to)
      setInstantTransition(false)

      const screenDist = Math.hypot(nextPos.centerX - currentPos.centerX, nextPos.centerY - currentPos.centerY)
      const viewportRadius = Math.min(w, h) * 0.4
      const fadeDelay = Math.max(0, ((screenDist - viewportRadius) / screenDist) * DURATION * 1000 - FADE_LEAD_MS)

      setLingeringVideoIdx(o[currentOrderIdx])
      setVideoActiveIdx(nextProjectIdx)

      if (fadeDelay <= 0) {
        setActiveIdx(nextProjectIdx)
      } else {
        setActiveIdx(-1)
        fadeTimeoutId = setTimeout(() => {
          fadeTimeoutId = null
          if (running) setActiveIdx(nextProjectIdx)
        }, fadeDelay)
      }

      lingeringTimeoutId = setTimeout(() => {
        lingeringTimeoutId = null
        if (running) setLingeringVideoIdx(null)
      }, fadeDelay + FADE_LEAD_MS + DURATION * 1000)

      currentIdxRef.current = nextProjectIdx

      tickTimeoutId = setTimeout(tick, 3000 + DURATION * 1000)
    }

    tickTimeoutId = setTimeout(tick, 3000 + DURATION * 1000)

    finishLoading()

    return () => {
      running = false
      if (tickTimeoutId) clearTimeout(tickTimeoutId)
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId)
      if (lingeringTimeoutId) clearTimeout(lingeringTimeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProjects.length])

  useLayoutEffect(() => {
    const idx = Math.min(currentIdxRef.current, layout.positions.length - 1)
    const pos = layout.positions[idx]
    if (!pos) return
    const h = displayVh || 800
    const targetY = focusCenterY || h / 2 - 60
    const resizeScale = isPortrait
      ? ((displayVw || 1200) - 2 * PORTRAIT_PADDING) / ((imageHeight || 512) * activeRatio)
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

  useEffect(() => {
    if (loadingPhase !== 'revealing') return
    const id = setTimeout(() => setLoadingPhase('done'), 1200)
    return () => clearTimeout(id)
  }, [loadingPhase])

  if (imageProjects.length === 0) return null

  return (
    <div ref={viewportRef} className="relative isolate -z-10 size-full min-h-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          clipPath: `inset(${progress * 8}px round ${progress * 30}px)`,
        }}
      >
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-500"
          style={{ pointerEvents: 'none' }}
        >
          <div className="relative size-32 sm:size-40">
            <svg viewBox="0 0 673 457" className="size-full fill-zinc-400">
              <path d={LOGO_PATH} />
            </svg>
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: MIN_LOADING_MS / 1000, ease: 'linear' }}
            >
              <svg viewBox="0 0 673 457" className="size-full fill-white">
                <path d={LOGO_PATH} />
              </svg>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 z-20 bg-zinc-200 dark:bg-zinc-800"
          initial={{ opacity: 0, scale: 2 }}
          animate={loadingPhase === 'done' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 2 }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute top-0 left-0"
            style={{
              width: layout.width,
              height: layout.height,
              transformOrigin: '0 0',
            }}
            initial={shuffled ? false : { x: centerTarget.x, y: centerTarget.y }}
            animate={{
              x: shuffled ? wrapperTarget.x : centerTarget.x,
              y: shuffled ? wrapperTarget.y : centerTarget.y,
              scale: portraitScale,
            }}
            transition={
              !shuffled || instantTransition ? { duration: 0 } : { duration: DURATION, ease: [0.42, 0, 0.58, 1] }
            }
          >
            {imageProjects.map((project, idx) => {
              const pos = layout.positions[idx]
              if (!pos) return null
              const src = getImageSrc(project)
              const darkSrc = getImageDarkSrc(project)
              return (
                <motion.div
                  key={project.slug}
                  className="group absolute overflow-hidden rounded-2xl bg-zinc-500"
                  style={{
                    width: pos.width,
                    height: pos.height,
                    left: pos.x,
                    top: pos.y,
                  }}
                  animate={{ opacity: idx === activeIdx ? 1 : FADED_OPACITY }}
                  transition={{ duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {shuffled ? (
                    darkSrc ? (
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
                    )
                  ) : null}

                  {project.meta.video ? (
                    <ProjectVideoOverlay
                      src={project.meta.video}
                      isActive={hoveredIdx === idx || idx === videoActiveIdx || idx === lingeringVideoIdx}
                      className="absolute inset-0 z-[5]"
                    />
                  ) : null}

                  <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />

                  <Link
                    href={`/projects/${project.slug}`}
                    data-active={idx === activeIdx ? 'true' : undefined}
                    className="group/title absolute inset-ring inset-ring-white/10 bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.75 truncate rounded-full border border-zinc-950/60 bg-zinc-950/50 py-0.5 pr-2 pb-1 pl-3 text-center font-medium text-sm/6 text-white not-data-active:opacity-0 opacity-0 backdrop-blur-2xl transition-opacity duration-500 data-active:pointer-fine:group-hover:opacity-100"
                  >
                    {project.meta.title}
                    <ArrowUpRightIcon className="size-4 not-group-hover/title:translate-y-px transition-all duration-200 group-hover/title:translate-x-px group-hover/title:-translate-y-px" />
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10"
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
