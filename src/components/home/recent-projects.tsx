'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { type HTMLMotionProps, MotionValue, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import Link from 'next/link'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import useMeasure, { type RectReadOnly } from 'react-use-measure'
import { ThemeImage } from '@/components/theme-image'
import { SerializableProject } from '@/types/post'
import { Button } from '../button'

function ProjectCard({
  name,
  title,
  img,
  imgDark,
  children,
  bounds,
  scrollX,
  href,
  ...props
}: {
  img?: string
  imgDark?: string
  name?: string
  title?: string
  href?: string
  children: React.ReactNode
  bounds: RectReadOnly
  scrollX: MotionValue<number>
} & HTMLMotionProps<'div'>) {
  let ref = useRef<HTMLDivElement | null>(null)

  let computeOpacity = useCallback(() => {
    let element = ref.current
    if (!element || bounds.width === 0) return 1

    let rect = element.getBoundingClientRect()

    if (rect.left < bounds.left) {
      let diff = bounds.left - rect.left
      let percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else if (rect.right > bounds.right) {
      let diff = rect.right - bounds.right
      let percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else {
      return 1
    }
  }, [ref, bounds.width, bounds.left, bounds.right])

  let opacity = useSpring(computeOpacity(), {
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
      {...props}
      className="group relative isolate flex aspect-16/10 h-auto w-[calc(100vw-1.5rem)] max-w-[calc((var(--container-7xl)-2rem)/1.25)] shrink-0 snap-start scroll-ml-(--scroll-padding) flex-col justify-end overflow-hidden rounded-xl lg:w-[calc(100vw-2rem)]"
    >
      {img ? (
        <div className="relative aspect-16/10 h-auto overflow-hidden rounded-xl">
          <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />
          <ThemeImage
            priority
            unoptimized
            fill
            src={img}
            darkSrc={imgDark}
            alt={title ?? name ?? ''}
            className="inset-0 aspect-16/10 object-cover"
          />
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-zinc-950/50 to-30% opacity-0 transition-500 transition-opacity group-hover:opacity-100 dark:from-zinc-950/75"
      />
      {href ? (
        <Link href={href}>
          <span className="absolute inset-0 z-20" aria-hidden="true" />
        </Link>
      ) : null}
      <p className="absolute bottom-4 left-5 z-10 flex items-center gap-2 font-medium text-shadow-md text-white opacity-0 transition-500 transition-opacity group-hover:opacity-100">
        {title ?? name}
        <ChevronRightIcon className="size-4" />
      </p>
    </motion.div>
  )
}

export function RecentProjects({ projects }: { projects: SerializableProject[] }) {
  let scrollRef = useRef<HTMLDivElement | null>(null)
  let { scrollX } = useScroll({ container: scrollRef })
  let [setReferenceWindowRef, bounds] = useMeasure()
  let [activeIndex, setActiveIndex] = useState(0)

  useMotionValueEvent(scrollX, 'change', (x) => {
    setActiveIndex(Math.floor(x / scrollRef.current!.children[0].clientWidth))
  })

  function scrollTo(index: number) {
    let gap = 32
    let width = (scrollRef.current!.children[0] as HTMLElement).offsetWidth
    scrollRef.current!.scrollTo({ left: (width + gap) * index })
  }

  return (
    <div className="-mt-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={setReferenceWindowRef}>
          <h2 className="font-medium font-mono text-sm text-zinc-500 uppercase tracking-widest dark:text-zinc-400">
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
        {projects.map((project, projectIndex) => (
          <ProjectCard
            key={projectIndex}
            name={project.meta.title}
            title={project.meta.title}
            img={project.meta.image?.src}
            imgDark={project.meta.imageDark?.src}
            bounds={bounds}
            scrollX={scrollX}
            href={`/projects/${project.slug}`}
          >
            {project.meta.lead}
          </ProjectCard>
        ))}
        <div className="w-2xl shrink-0 sm:w-216" />
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between">
          <Button href="/projects">
            View all <ChevronRightIcon className="-mr-1!" />
          </Button>
          <div className="hidden sm:flex sm:gap-2">
            <Button
              onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
              outline={true}
              aria-label="Previous project"
              disabled={activeIndex === 0}
              className="px-3!"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              onClick={() => scrollTo(Math.min(projects.length - 1, activeIndex + 1))}
              outline={true}
              aria-label="Next project"
              disabled={activeIndex >= projects.length - 1}
              className="px-3!"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
