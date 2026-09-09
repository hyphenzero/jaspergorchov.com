'use client'

import { ProjectVideoOverlay } from '@/components/project-video'
import { ThemeImage } from '@/components/theme-image'
import { SerializableProject } from '@/types/post'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import {
  type HTMLMotionProps,
  MotionValue,
  motion,
  useAnimationControls,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'motion/react'
import Link from 'next/link'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import useMeasure, { type RectReadOnly } from 'react-use-measure'
import { Button } from '../button'

function ProjectCard({
  name,
  title,
  img,
  imgDark,
  video,
  bounds,
  scrollX,
  href,
  ...props
}: {
  img?: string
  imgDark?: string
  video?: string
  name?: string
  title?: string
  href?: string
  bounds: RectReadOnly
  scrollX: MotionValue<number>
} & HTMLMotionProps<'div'>) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const computeOpacity = useCallback(() => {
    const element = ref.current
    if (!element || bounds.width === 0) return 1

    const rect = element.getBoundingClientRect()

    if (rect.left < bounds.left) {
      const diff = bounds.left - rect.left
      const percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else if (rect.right > bounds.right) {
      const diff = rect.right - bounds.right
      const percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else {
      return 1
    }
  }, [ref, bounds.width, bounds.left, bounds.right])

  // Starts at 1; the layout effect below syncs the true value before paint.
  const opacity = useSpring(1, {
    stiffness: 154,
    damping: 23,
  })

  useLayoutEffect(() => {
    opacity.set(computeOpacity())
  }, [computeOpacity, opacity])

  useMotionValueEvent(scrollX, 'change', () => {
    opacity.set(computeOpacity())
  })

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
      className="group relative isolate flex aspect-16/10 h-auto w-[calc(100vw-1.5rem)] max-w-[calc((var(--container-7xl)-2rem)/1.25)] shrink-0 snap-start scroll-ml-(--scroll-padding) flex-col justify-end overflow-hidden rounded-2xl lg:w-[calc(100vw-2rem)]"
    >
      {img ? (
        <div className="relative aspect-16/10 h-auto overflow-hidden rounded-2xl">
          <ThemeImage
            priority
            unoptimized
            fill
            src={img}
            darkSrc={imgDark}
            alt={title ?? name ?? ''}
            className="inset-0 aspect-16/10 object-cover"
          />
          {video ? <ProjectVideoOverlay src={video} isActive={isHovered} className="absolute inset-0" /> : null}
          <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className="transition-500 absolute inset-0 bg-linear-to-t from-zinc-950/50 to-30% opacity-0 transition-opacity group-hover:opacity-100 dark:from-zinc-950/75"
      />
      {href ? (
        <Link href={href}>
          <span className="absolute inset-0 z-20" aria-hidden="true" />
        </Link>
      ) : null}
      <p className="transition-500 absolute bottom-4 left-5 z-10 flex items-center gap-2 font-medium text-white opacity-0 transition-opacity text-shadow-md group-hover:opacity-100">
        {title ?? name}
        <ChevronRightIcon className="size-4" />
      </p>
    </motion.div>
  )
}

const NUDGE_SPRING = { type: 'spring', stiffness: 550, damping: 19, mass: 0.7 } as const

export function RecentProjects({ projects }: { projects: SerializableProject[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const { scrollX } = useScroll({ container: scrollRef })
  const [setReferenceWindowRef, bounds] = useMeasure()
  const [activeIndex, setActiveIndex] = useState(0)
  // `activeIndex` is measured from the scroll container, which only exists on
  // the client — the server can only guess. Keep `disabled` out of the SSR
  // HTML entirely and enable it after mount so hydration always agrees, then
  // the scroll listener below syncs the true index before paint.
  const [isMounted, setIsMounted] = useState(false)
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot mounted flag so SSR and hydration HTML agree on `disabled`
    setIsMounted(true)
  }, [])
  const visibleProjects = projects.slice(0, 4)
  const maxIndex = Math.max(0, visibleProjects.length - 1)
  const prevControls = useAnimationControls()
  const nextControls = useAnimationControls()

  // Springs only support two keyframes, so the nudge runs as two sequential
  // spring animations: out in the travel direction, then back to rest.
  async function nudge(controls: ReturnType<typeof useAnimationControls>, direction: 1 | -1) {
    try {
      await controls.start({ x: direction * 5, transition: NUDGE_SPRING })
      await controls.start({ x: 0, transition: NUDGE_SPRING })
    } catch {
      // Interrupted by a newer nudge — the latest sequence wins.
    }
  }

  useMotionValueEvent(scrollX, 'change', (x) => {
    const container = scrollRef.current
    if (!container || !container.children[0]) return
    const gap = 32
    const width = (container.children[0] as HTMLElement).clientWidth
    const step = width + gap
    if (step <= 0) return
    const index = Math.min(maxIndex, Math.max(0, Math.round(x / step)))
    setActiveIndex(index)
  })

  function scrollTo(index: number) {
    const container = scrollRef.current
    if (!container || !container.children[0]) return
    const gap = 32
    const width = (container.children[0] as HTMLElement).offsetWidth
    container.scrollTo({ left: (width + gap) * index, behavior: 'smooth' })
  }

  return (
    <div className="-mt-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={setReferenceWindowRef}>
          <h2 className="font-mono text-sm font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
            Recent projects
          </h2>
        </div>
      </div>
      <div
        ref={scrollRef}
        className={clsx([
          'mt-10 flex gap-8 px-(--scroll-padding)',
          'scrollbar-none',
          'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
          '[--scroll-padding:max(--spacing(6),calc((100vw-(var(--container-7xl)))/2+(var(--spacing)*6)))] lg:[--scroll-padding:max(--spacing(8),calc((100vw-(var(--container-7xl)))/2+(var(--spacing)*8)))]',
        ])}
      >
        {visibleProjects.map((project, projectIndex) => (
          <ProjectCard
            key={projectIndex}
            name={project.meta.title}
            title={project.meta.title}
            img={project.meta.image?.src}
            imgDark={project.meta.imageDark?.src}
            video={project.meta.video}
            bounds={bounds}
            scrollX={scrollX}
            href={`/projects/${project.slug}`}
          />
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between">
          <Button href="/projects" data-track="carousel-view-more">
            View more <ChevronRightIcon className="-mr-1!" />
          </Button>
          <div className="hidden sm:flex sm:gap-2">
            <Button
              onClick={() => {
                scrollTo(Math.max(0, activeIndex - 1))
                void nudge(prevControls, -1)
              }}
              outline={true}
              aria-label="Previous project"
              disabled={isMounted && activeIndex === 0}
              className="px-2.75!"
            >
              <motion.span data-slot="icon" animate={prevControls} className="inline-flex">
                <ChevronLeftIcon className="size-full" />
              </motion.span>
            </Button>
            <Button
              onClick={() => {
                scrollTo(Math.min(maxIndex, activeIndex + 1))
                void nudge(nextControls, 1)
              }}
              outline={true}
              aria-label="Next project"
              disabled={isMounted && activeIndex >= maxIndex}
              className="px-2.75!"
            >
              <motion.span data-slot="icon" animate={nextControls} className="inline-flex">
                <ChevronRightIcon className="size-full" />
              </motion.span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
