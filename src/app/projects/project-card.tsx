'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
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
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-zinc-950/10 ring-inset max-lg:hidden dark:ring-white/10" />
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
      </div>
      <div className="mt-10 flex flex-col rounded-xl">
        <div className="flex items-center">
          <div className="flex items-center font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">
            {updatedDate ? (
              <span className="flex items-center">
                <span>Updated&nbsp;</span>
                <time dateTime={updatedDate}>{formatDate(updatedDate)}</time>
              </span>
            ) : releaseOrDate ? (
              <time dateTime={releaseOrDate as string}>{formatDate(releaseOrDate as string)}</time>
            ) : null}
          </div>

          <ul className="m-0 flex list-none items-center font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">
            {meta.tags.map((tag, i) => (
              <li key={i} className="inline-flex items-center">
                <span className="mx-4 inline-block size-0.75 rounded-full bg-current" />
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

        <div className="mt-3 flex items-center gap-4">
          <h2 className={clsx('text-pretty font-medium text-xl tracking-tight transition-colors', showHover ? 'text-sky-500 dark:text-sky-400' : 'text-zinc-950 dark:text-white')}>
            {meta.title}
          </h2>

          {(() => {
            if (isRecent(updatedDate)) {
              return (
                <div className="group relative w-fit px-1.5 text-sky-800 text-xs/5 dark:text-sky-300">
                  <span className="absolute inset-0 border border-sky-300/60 border-dashed bg-sky-400/10 dark:border-sky-300/30 dark:bg-sky-400/15" />
                  Updated
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    className="absolute -top-0.5 -left-0.5 fill-sky-300 dark:fill-sky-300/50"
                  >
                    <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                  </svg>
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    className="absolute -top-0.5 -right-0.5 fill-sky-300 dark:fill-sky-300/50"
                  >
                    <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                  </svg>
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    className="absolute -bottom-0.5 -left-0.5 fill-sky-300 dark:fill-sky-300/50"
                  >
                    <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                  </svg>
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    className="absolute -right-0.5 -bottom-0.5 fill-sky-300 dark:fill-sky-300/50"
                  >
                    <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                  </svg>
                </div>
              )
            }

            if (isRecent(releaseOrDate)) {
              return (
                <div className="group relative w-fit px-1.5 text-emerald-800 text-xs/5 dark:text-emerald-300">
                  <span className="absolute inset-0 border border-emerald-300 border-dashed bg-emerald-400/12 dark:border-emerald-300/30 dark:bg-emerald-400/15" />
                  New
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    className="absolute -top-0.5 -left-0.5 fill-emerald-400 dark:fill-emerald-300/50"
                  >
                    <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                  </svg>
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    className="absolute -top-0.5 -right-0.5 fill-emerald-400 dark:fill-emerald-300/50"
                  >
                    <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                  </svg>
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    className="absolute -bottom-0.5 -left-0.5 fill-emerald-400 dark:fill-emerald-300/50"
                  >
                    <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                  </svg>
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    className="absolute -right-0.5 -bottom-0.5 fill-emerald-400 dark:fill-emerald-300/50"
                  >
                    <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                  </svg>
                </div>
              )
            }

            return null
          })()}

          <svg
            viewBox="0 0 10 10"
            aria-hidden="true"
            className={clsx(
              'size-2.5 flex-none transition duration-1000 ease-[linear(0,0.002_0.3%,0.007_0.6%,0.029_1.3%,0.065_2%,0.119_2.8%,0.237_4.2%,0.659_8.7%,0.778_10.2%,0.871_11.6%,0.95_13.1%,1.009_14.6%,1.033_15.4%,1.052_16.2%,1.066_17%,1.078_17.9%,1.085_18.8%,1.088_19.7%,1.088_20.7%,1.085_21.7%,1.074_23.6%,1.032_28.7%,1.014_31.4%,1.006_33%,1_34.6%,0.993_38%,0.992_41.9%,0.999_51.4%,1.001_57.6%,1)] before:transition-opacity before:ease-[linear(0,0.002_0.3%,0.007_0.6%,0.029_1.3%,0.065_2%,0.119_2.8%,0.237_4.2%,0.659_8.7%,0.778_10.2%,0.871_11.6%,0.95_13.1%,1.009_14.6%,1.033_15.4%,1.052_16.2%,1.066_17%,1.078_17.9%,1.085_18.8%,1.088_19.7%,1.088_20.7%,1.085_21.7%,1.074_23.6%,1.032_28.7%,1.014_31.4%,1.006_33%,1_34.6%,0.993_38%,0.992_41.9%,0.999_51.4%,1.001_57.6%,1)]',
              showHover ? 'translate-x-0 opacity-60' : '-translate-x-6 opacity-0'
            )}
          >
            <path
              fill="oklch(74.6% 0.16 232.661)"
              stroke="oklch(74.6% 0.16 232.661)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
            />
          </svg>
        </div>
        <p className="mt-3 line-clamp-2 text-sm/7 text-zinc-600 dark:text-zinc-400">{meta.lead}</p>
      </div>
    </article>
  )
}
