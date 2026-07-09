'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import { ProjectVideoOverlay } from '@/components/project-video'
import { ThemeImage } from '@/components/theme-image'
import { formatDate } from '@/lib/api-utils'

export function ProjectCard({
  meta,
  slug,
}: {
  meta: {
    title: string
    lead?: string
    tags: string[]
    image?: { src: string }
    imageDark?: { src: string }
    video?: string
    releaseDate?: string
    date?: string
    updatedDate?: string
    updated?: string
  }
  slug: string
}) {
  const [rowHovered, setRowHovered] = useState(false)
  const [tagHovered, setTagHovered] = useState(false)

  const showHover = rowHovered && !tagHovered

  const now = new Date()
  function isRecent(dateStr?: string) {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const diffMs = now.getTime() - d.getTime()
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
    return diffMs >= 0 && diffMs <= THIRTY_DAYS_MS
  }

  const hasExplicitReleaseDate = meta.releaseDate !== undefined && meta.releaseDate !== null
  const hasDate = meta.date !== undefined && meta.date !== null
  const releaseOrDate = hasExplicitReleaseDate ? meta.releaseDate : hasDate ? meta.date : undefined
  const updatedDate = meta.updatedDate ?? meta.updated

  if (!releaseOrDate) return null

  return (
    <article
      className="relative cursor-pointer rounded-2xl transition-colors"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => {
        setRowHovered(false)
        setTagHovered(false)
      }}
    >
      <Link href={`/projects/${slug}`} className="absolute inset-0 z-10" />
      <div className="relative aspect-16/10 h-auto w-full overflow-hidden rounded-xl">
        {meta.image?.src ? (
          <ThemeImage
            priority
            unoptimized
            fill
            src={meta.image.src}
            darkSrc={meta.imageDark?.src}
            alt={meta.title ?? ''}
            className="size-full object-cover"
          />
        ) : null}
        {meta.video ? (
          <ProjectVideoOverlay src={meta.video} isActive={rowHovered} className="absolute inset-0" />
        ) : null}
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-zinc-950/10 ring-inset max-lg:hidden dark:ring-white/10" />
      </div>
      <div className="mt-8 flex flex-col rounded-xl">
        <div className="flex h-4 items-center">
          <div className="flex items-center">
            {isRecent(updatedDate) ? (
              <span className="mr-4 whitespace-nowrap rounded-lg bg-sky-400/20 px-2 font-semibold text-sky-700 text-xs/6 dark:bg-sky-400/10 dark:text-sky-300">
                Updated
              </span>
            ) : isRecent(releaseOrDate) ? (
              <>
                <span className="mr-4 whitespace-nowrap rounded-lg bg-lime-400/20 px-2 font-semibold text-lime-700 text-xs/6 dark:bg-lime-400/10 dark:text-lime-300">
                  New
                </span>
              </>
            ) : null}

            <div className="flex items-center font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">
              {updatedDate ? (
                <time dateTime={updatedDate}>{formatDate(updatedDate)}</time>
              ) : releaseOrDate ? (
                <time dateTime={releaseOrDate as string}>{formatDate(releaseOrDate as string)}</time>
              ) : null}
            </div>
          </div>

          <ul className="m-0 flex list-none items-center font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">
            {meta.tags.map((tag, i) => (
              <li key={i} className="inline-flex items-center">
                <span className="mx-4 inline-block size-0.75 rounded-full bg-zinc-500" />
                <Link
                  href={`?category=${encodeURIComponent(tag.toLowerCase())}`}
                  className="relative z-20 text-zinc-500 leading-none transition hover:text-zinc-950 dark:hover:text-white"
                  onMouseEnter={() => setTagHovered(true)}
                  onMouseLeave={() => setTagHovered(false)}
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <h2
            className={clsx(
              'text-pretty font-medium text-xl tracking-tight transition-colors',
              showHover ? 'text-sky-500 dark:text-sky-400' : 'text-zinc-950 dark:text-white'
            )}
          >
            {meta.title}
          </h2>

          <svg
            viewBox="0 0 10 10"
            aria-hidden="true"
            className={clsx(
              'size-3 flex-none fill-sky-500 stroke-sky-500 transition duration-1000 ease-[linear(0,0.002_0.3%,0.007_0.6%,0.029_1.3%,0.065_2%,0.119_2.8%,0.237_4.2%,0.659_8.7%,0.778_10.2%,0.871_11.6%,0.95_13.1%,1.009_14.6%,1.033_15.4%,1.052_16.2%,1.066_17%,1.078_17.9%,1.085_18.8%,1.088_19.7%,1.088_20.7%,1.085_21.7%,1.074_23.6%,1.032_28.7%,1.014_31.4%,1.006_33%,1_34.6%,0.993_38%,0.992_41.9%,0.999_51.4%,1.001_57.6%,1)] before:transition-opacity before:ease-[linear(0,0.002_0.3%,0.007_0.6%,0.029_1.3%,0.065_2%,0.119_2.8%,0.237_4.2%,0.659_8.7%,0.778_10.2%,0.871_11.6%,0.95_13.1%,1.009_14.6%,1.033_15.4%,1.052_16.2%,1.066_17%,1.078_17.9%,1.085_18.8%,1.088_19.7%,1.088_20.7%,1.085_21.7%,1.074_23.6%,1.032_28.7%,1.014_31.4%,1.006_33%,1_34.6%,0.993_38%,0.992_41.9%,0.999_51.4%,1.001_57.6%,1)]',
              showHover ? 'translate-x-0 opacity-60' : '-translate-x-6 opacity-0'
            )}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7.25 5-3.5-2.25v4.5L7.25 5Z" />
          </svg>
        </div>
        <p className="mt-3 line-clamp-2 text-sm/7 text-zinc-600 dark:text-zinc-400">{meta.lead}</p>
      </div>
    </article>
  )
}
