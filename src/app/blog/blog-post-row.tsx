'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import { formatDate } from '@/lib/api-utils'

export function BlogPostRow({
  meta,
  slug,
}: {
  meta: { date: string; title: string; lead?: string; tags: string[] }
  slug: string
}) {
  const [rowHovered, setRowHovered] = useState(false)
  const [tagHovered, setTagHovered] = useState(false)

  const showHover = rowHovered && !tagHovered

  return (
    <div
      className="relative grid grid-cols-1 border-b border-b-zinc-100 py-10 **:cursor-pointer first:border-t first:border-t-zinc-200 max-sm:gap-3 sm:grid-cols-3 dark:border-b-zinc-900 dark:first:border-t-zinc-800"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => {
        setRowHovered(false)
        setTagHovered(false)
      }}
    >
      <Link href={`/blog/${slug}`} className="absolute inset-0 z-10" />
      <div className="flex h-fit">
        <p className="font-medium font-mono text-gray-500 text-sm/6 uppercase tracking-widest">
          {formatDate(meta.date, 'long')}
        </p>
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
      <div className="relative sm:col-span-2 sm:max-w-2xl">
        <h2 className="font-semibold text-zinc-950 dark:text-white">{meta.title}</h2>
        <p className="prose prose-blog mt-4 line-clamp-3">{meta.lead}</p>
        <p className="mt-4 flex w-fit items-end font-semibold text-sky-500 text-sm dark:text-sky-400">
          Read more
          <svg
            viewBox="0 0 10 10"
            aria-hidden="true"
            className={clsx(
              'mb-1 ml-2 size-2.5 flex-none transition duration-1000 ease-[linear(0,0.002_0.3%,0.007_0.6%,0.029_1.3%,0.065_2%,0.119_2.8%,0.237_4.2%,0.659_8.7%,0.778_10.2%,0.871_11.6%,0.95_13.1%,1.009_14.6%,1.033_15.4%,1.052_16.2%,1.066_17%,1.078_17.9%,1.085_18.8%,1.088_19.7%,1.088_20.7%,1.085_21.7%,1.074_23.6%,1.032_28.7%,1.014_31.4%,1.006_33%,1_34.6%,0.993_38%,0.992_41.9%,0.999_51.4%,1.001_57.6%,1)] before:transition-opacity before:ease-[linear(0,0.002_0.3%,0.007_0.6%,0.029_1.3%,0.065_2%,0.119_2.8%,0.237_4.2%,0.659_8.7%,0.778_10.2%,0.871_11.6%,0.95_13.1%,1.009_14.6%,1.033_15.4%,1.052_16.2%,1.066_17%,1.078_17.9%,1.085_18.8%,1.088_19.7%,1.088_20.7%,1.085_21.7%,1.074_23.6%,1.032_28.7%,1.014_31.4%,1.006_33%,1_34.6%,0.993_38%,0.992_41.9%,0.999_51.4%,1.001_57.6%,1)]',
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
        </p>
        <div
          className={clsx(
            'absolute -inset-5 -z-10 rounded-2xl transition dark:bg-zinc-900/50',
            showHover ? 'scale-100 bg-zinc-100/80 opacity-100' : 'scale-95 opacity-0'
          )}
        />
      </div>
    </div>
  )
}
