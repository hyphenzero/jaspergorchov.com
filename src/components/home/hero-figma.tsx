'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import type { ComponentType } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ProjectShowreel, ProjectShowreelAnimation, SerializableProject } from '@/types/post'

type Props = {
  projects: SerializableProject[]
}

type ShowreelProject = SerializableProject & {
  meta: SerializableProject['meta'] & {
    showreel: ProjectShowreel
  }
}

type AnimationProps = {
  project: ShowreelProject
}

type CursorState = {
  x: number
  y: number
  visible: boolean
}

type RgbColor = {
  red: number
  green: number
  blue: number
}

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
const LIGHT_BACKGROUND_BASE: RgbColor = { red: 250, green: 250, blue: 251 }
const DARK_BACKGROUND_BASE: RgbColor = { red: 24, green: 24, blue: 27 }
const DEFAULT_LIGHT_BACKGROUND = 'rgb(244 244 245)'
const DEFAULT_DARK_BACKGROUND = 'rgb(24 24 27)'

function parseHexColor(value: string): RgbColor | null {
  if (!HEX_COLOR_PATTERN.test(value)) return null

  const hex = value.slice(1)
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((part) => `${part}${part}`)
          .join('')
      : hex

  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function mixColor(base: RgbColor, accent: RgbColor, accentWeight: number): RgbColor {
  const baseWeight = 1 - accentWeight
  return {
    red: Math.round(base.red * baseWeight + accent.red * accentWeight),
    green: Math.round(base.green * baseWeight + accent.green * accentWeight),
    blue: Math.round(base.blue * baseWeight + accent.blue * accentWeight),
  }
}

function toRgbString(color: RgbColor): string {
  return `rgb(${color.red} ${color.green} ${color.blue})`
}

function createBackgroundPalette(backgroundColor?: string) {
  if (!backgroundColor) {
    return {
      light: DEFAULT_LIGHT_BACKGROUND,
      dark: DEFAULT_DARK_BACKGROUND,
    }
  }

  const parsedColor = parseHexColor(backgroundColor)
  if (!parsedColor) {
    return {
      light: backgroundColor,
      dark: backgroundColor,
    }
  }

  return {
    light: toRgbString(mixColor(LIGHT_BACKGROUND_BASE, parsedColor, 0.22)),
    dark: toRgbString(mixColor(DARK_BACKGROUND_BASE, parsedColor, 0.28)),
  }
}

function hasShowreel(project: SerializableProject): project is ShowreelProject {
  const showreel = project.meta.showreel
  if (!showreel) return false

  if (showreel.animation === 'website-mobile-rise') {
    return Boolean(showreel.desktopImage?.src || showreel.mobileImage?.src || project.meta.image?.src)
  }

  if (showreel.animation === 'stepped-scale-render') {
    return Boolean(showreel.renderImage?.src || project.meta.image?.src)
  }

  return false
}

function shuffleProjects(projects: ShowreelProject[]) {
  const shuffled = [...projects]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}

function buildQueue(projects: ShowreelProject[], lastSlug?: string) {
  const queue = shuffleProjects(projects)

  if (queue.length > 1 && lastSlug && queue[0].slug === lastSlug) {
    ;[queue[0], queue[1]] = [queue[1], queue[0]]
  }

  return queue
}

function WebsiteMobileRiseAnimation({ project }: AnimationProps) {
  const desktopSrc = project.meta.showreel.desktopImage?.src ?? project.meta.image?.src
  const mobileSrc = project.meta.showreel.mobileImage?.src ?? desktopSrc

  if (!desktopSrc) return null

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute inset-x-[6%] top-[6%] bottom-[10%] rounded-[1.75rem] bg-white/85 p-3 shadow-2xl outline-1 outline-black/10 -outline-offset-1 backdrop-blur-sm"
        initial={{ opacity: 0, y: 80, rotateX: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative h-full overflow-hidden rounded-[1.2rem] bg-zinc-900/5">
          <Image
            src={desktopSrc}
            alt={project.meta.title}
            fill
            priority
            className="object-cover object-top"
            sizes="85vw"
          />
        </div>
      </motion.div>

      {mobileSrc && (
        <motion.div
          className="absolute right-[6%] bottom-[6%] h-[56%] w-[26%] max-w-64 rounded-[1.8rem] bg-white/95 p-2 shadow-2xl outline-1 outline-black/10 -outline-offset-1 backdrop-blur-sm"
          initial={{ opacity: 0, y: 120, x: 25, rotateZ: 4, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, x: 0, rotateZ: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-full overflow-hidden rounded-[1.3rem] bg-zinc-900/5">
            <Image
              src={mobileSrc}
              alt={`${project.meta.title} mobile view`}
              fill
              className="object-cover object-top"
              sizes="30vw"
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

function SteppedScaleRenderAnimation({ project }: AnimationProps) {
  const renderSrc = project.meta.showreel.renderImage?.src ?? project.meta.image?.src
  if (!renderSrc) return null

  const scaleSteps = [0.3, 0.6, 1] as const
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    setStepIndex(0)
    const timerOne = window.setTimeout(() => setStepIndex(1), 260)
    const timerTwo = window.setTimeout(() => setStepIndex(2), 520)

    return () => {
      window.clearTimeout(timerOne)
      window.clearTimeout(timerTwo)
    }
  }, [project.slug])

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-x-[20%] top-[8%] bottom-[18%] flex items-center justify-center">
        <div
          className="relative h-full w-full overflow-hidden rounded-[1.75rem] shadow-2xl outline-1 outline-white/35 -outline-offset-1 transition-none"
          style={{ transform: `scale(${scaleSteps[stepIndex]})` }}
        >
          <Image src={renderSrc} alt={project.meta.title} fill priority className="object-cover" sizes="72vw" />
        </div>
      </div>
    </div>
  )
}

const animationComponents: Record<ProjectShowreelAnimation, ComponentType<AnimationProps>> = {
  'website-mobile-rise': WebsiteMobileRiseAnimation,
  'stepped-scale-render': SteppedScaleRenderAnimation,
}

export function Hero({ projects = [] }: Props) {
  const showreelProjects = useMemo(() => projects.filter(hasShowreel), [projects])
  const [currentProject, setCurrentProject] = useState<ShowreelProject | null>(showreelProjects[0] ?? null)
  const queueRef = useRef<ShowreelProject[]>([])
  const indexRef = useRef(0)
  const [canShowCursorChip, setCanShowCursorChip] = useState(false)
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    visible: false,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    const update = () => setCanShowCursorChip(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (showreelProjects.length === 0) {
      setCurrentProject(null)
      queueRef.current = []
      indexRef.current = 0
      return
    }

    queueRef.current = buildQueue(showreelProjects)
    indexRef.current = 0
    setCurrentProject(queueRef.current[0] ?? null)

    const intervalId = window.setInterval(() => {
      const queue = queueRef.current
      if (queue.length === 0) return

      const nextIndex = indexRef.current + 1
      if (nextIndex >= queue.length) {
        const lastProject = queue[indexRef.current]
        queueRef.current = buildQueue(showreelProjects, lastProject?.slug)
        indexRef.current = 0
      } else {
        indexRef.current = nextIndex
      }

      setCurrentProject(queueRef.current[indexRef.current] ?? null)
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [showreelProjects])

  const currentShowreel = currentProject?.meta.showreel
  const ActiveAnimation = currentShowreel ? animationComponents[currentShowreel.animation] : null
  const backgroundColor = currentShowreel?.backgroundColor
  const backgroundPalette = useMemo(() => createBackgroundPalette(backgroundColor), [backgroundColor])

  const showCursorChip = Boolean(currentProject && canShowCursorChip)

  return (
    <div className="relative isolate -z-10 size-full min-h-full overflow-hidden">
      <div className="absolute inset-2 overflow-hidden rounded-[1.25rem]">
        <motion.div
          key={`${currentProject?.slug ?? 'default-showreel-bg'}-light`}
          className="absolute inset-0 dark:hidden"
          style={{ backgroundColor: backgroundPalette.light }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
        <motion.div
          key={`${currentProject?.slug ?? 'default-showreel-bg'}-dark`}
          className="absolute inset-0 hidden dark:block"
          style={{ backgroundColor: backgroundPalette.dark }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
        <div
          className={`relative mx-auto h-full max-w-6xl px-6 lg:px-8 ${showCursorChip ? 'cursor-none' : ''}`}
          onMouseEnter={() => {
            if (showCursorChip) {
              setCursor((previous) => ({ ...previous, visible: true }))
            }
          }}
          onMouseMove={(event) => {
            if (showCursorChip) {
              setCursor({
                x: event.clientX,
                y: event.clientY,
                visible: true,
              })
            }
          }}
          onMouseLeave={() => {
            setCursor((previous) => ({ ...previous, visible: false }))
          }}
        >
          <div className="relative h-full">
            <AnimatePresence mode="wait">
              {currentProject && ActiveAnimation && (
                <motion.div
                  key={currentProject.slug}
                  className="absolute inset-x-0 top-24 bottom-44 sm:top-28 sm:bottom-52 lg:bottom-56"
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                >
                  <ActiveAnimation project={currentProject} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 rounded-[1.25rem] ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />
      </div>

      {showCursorChip && currentProject && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-40"
          initial={false}
          animate={{
            x: cursor.x + 18,
            y: cursor.y + 18,
            opacity: cursor.visible ? 1 : 0,
            scale: cursor.visible ? 1 : 0.95,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="rounded-full bg-white/90 px-3 py-2 shadow-lg outline-1 outline-black/10 -outline-offset-1 backdrop-blur-sm dark:bg-zinc-900/85 dark:outline-white/15">
            <p className="whitespace-nowrap font-medium text-xs text-zinc-950 dark:text-white">
              {currentProject.meta.title} <span aria-hidden>↗</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Hero
