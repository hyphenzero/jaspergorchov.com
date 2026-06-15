'use client'

import { animate, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { SerializableProject } from '@/types/post'

type AnimationType = 'cross-scale' | 'diagonal-wipe'

type Props = {
  projects: SerializableProject[]
}

type ShowreelProject = SerializableProject & {
  meta: SerializableProject['meta'] & {
    showreel: NonNullable<SerializableProject['meta']['showreel']>
  }
}

function hasShowreel(project: SerializableProject): project is ShowreelProject {
  const showreel = project.meta.showreel
  if (!showreel) return false
  return Boolean(
    showreel.desktopImage?.src || showreel.mobileImage?.src || showreel.renderImage?.src || project.meta.image?.src
  )
}

function getImageSrc(project: ShowreelProject): string {
  const showreel = project.meta.showreel
  return (
    showreel.renderImage?.src ??
    showreel.desktopImage?.src ??
    showreel.mobileImage?.src ??
    project.meta.image?.src ??
    ''
  )
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

function CrossScaleImage({
  project,
  previousProject,
}: {
  project: ShowreelProject
  previousProject: ShowreelProject | null
}) {
  const src = getImageSrc(project)
  const prevSrc = previousProject ? getImageSrc(previousProject) : null
  const [scale, setScale] = useState(1)
  const [showOld, setShowOld] = useState(false)
  const cutRef = useRef(false)
  const scaleRef = useRef(1)
  const prevSlugRef = useRef(project.slug)
  const cleanupRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (!prevSrc) {
      prevSlugRef.current = project.slug
      return
    }

    if (project.slug === prevSlugRef.current) return
    prevSlugRef.current = project.slug

    cutRef.current = false
    setShowOld(true)

    const from = scaleRef.current

    // Phase 1: fast zoom to 1 (imperceptible reset)
    const controls1 = animate(from, 1, {
      duration: 0.04,
      ease: 'easeOut',
      onComplete: () => {
        // Phase 2: match cut zoom from 1 to 1.15
        const controls2 = animate(1, 1.15, {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (latest) => {
            setScale(latest)
            scaleRef.current = latest
            const progress = (latest - 1) / 0.15
            if (progress >= 0.55 && !cutRef.current) {
              cutRef.current = true
              setShowOld(false)
            }
          },
        })
        cleanupRef.current = () => controls2.stop()
      },
    })
    cleanupRef.current = () => controls1.stop()

    return () => {
      cleanupRef.current()
    }
  }, [project.slug, prevSrc])

  return (
    <div className="absolute inset-0 bg-zinc-950 dark:bg-zinc-950">
      <div className="absolute inset-0" style={{ transform: `scale(${scale})` }}>
        <Image src={src} alt={project.meta.title} fill priority unoptimized className="object-cover" sizes="100vw" />
      </div>
      {showOld && prevSrc && (
        <div className="absolute inset-0" style={{ transform: `scale(${scale})` }}>
          <Image src={prevSrc} alt="" fill priority unoptimized className="object-cover" sizes="100vw" />
        </div>
      )}
    </div>
  )
}

function DiagonalWipe({
  project,
  previousProject,
}: {
  project: ShowreelProject
  previousProject: ShowreelProject | null
}) {
  const src = getImageSrc(project)
  const prevSrc = previousProject ? getImageSrc(previousProject) : null
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    const controls = animate(0, 1, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        const offset = 25
        const topPct = 100 - latest * (100 + offset)
        const bottomPct = 100 + offset - latest * (100 + offset)
        el.style.clipPath = `polygon(${topPct}% 0%, 100% 0%, 100% 100%, ${bottomPct}% 100%)`
      },
    })
    return () => controls.stop()
  }, [project.slug])

  return (
    <div className="absolute inset-0 bg-zinc-950 dark:bg-zinc-950">
      {prevSrc && <Image src={prevSrc} alt="" fill priority className="object-cover" sizes="100vw" />}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 125% 100%)' }}
      >
        <Image src={src} alt={project.meta.title} fill priority className="object-cover" sizes="100vw" />
      </div>
    </div>
  )
}

export function Hero({ projects = [] }: Props) {
  const showreelProjects = useMemo(() => projects.filter(hasShowreel), [projects])
  const [currentProject, setCurrentProject] = useState<ShowreelProject | null>(showreelProjects[0] ?? null)
  const [previousProject, setPreviousProject] = useState<ShowreelProject | null>(null)
  const [animationType, setAnimationType] = useState<AnimationType>('cross-scale')
  const queueRef = useRef<ShowreelProject[]>([])
  const indexRef = useRef(0)
  const [scrollY, setScrollY] = useState(0)
  const currentRef = useRef<ShowreelProject | null>(null)
  currentRef.current = currentProject

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

      const nextProject = queueRef.current[indexRef.current] ?? null
      const prev = currentRef.current
      const type: AnimationType = Math.random() > 0.5 ? 'diagonal-wipe' : 'cross-scale'

      setAnimationType(type)
      setCurrentProject(nextProject)
      setPreviousProject(prev)
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [showreelProjects])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progress = Math.min(scrollY / 500, 1)

  if (!currentProject) return null

  return (
    <div className="relative isolate -z-10 size-full min-h-full overflow-hidden">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{
          top: progress * 8,
          left: progress * 8,
          right: progress * 8,
          bottom: progress * 8,
          borderRadius: progress * 30,
        }}
      >
        <div style={{ display: animationType === 'diagonal-wipe' ? 'none' : '' }}>
          <CrossScaleImage project={currentProject} previousProject={previousProject} />
        </div>
        <div style={{ display: animationType === 'diagonal-wipe' ? '' : 'none' }}>
          <DiagonalWipe key={currentProject.slug} project={currentProject} previousProject={previousProject} />
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute z-10 bg-linear-to-b from-zinc-950/50 via-transparent to-zinc-950/50"
        animate={{
          top: progress * 8,
          left: progress * 8,
          right: progress * 8,
          bottom: progress * 8,
          borderRadius: progress * 30,
        }}
      />

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
