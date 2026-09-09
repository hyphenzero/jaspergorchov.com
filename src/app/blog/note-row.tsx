'use client'

import { Image } from '@/components/markdown/media'
import { formatDate, formatTimeLocal } from '@/lib/api-utils'
import type React from 'react'

export function NoteRow({
  meta,
  children,
}: {
  meta: {
    date: string
    image?: { src: string; width?: number; height?: number }
    imageDark?: { src: string; width?: number; height?: number }
  }
  children: React.ReactNode
}) {
  return (
    <div className="group relative grid grid-cols-1 border-b border-b-zinc-100 py-10 first:border-t first:border-t-zinc-200 max-sm:gap-3 sm:grid-cols-3 dark:border-b-zinc-900 dark:first:border-t-zinc-800">
      <div className="flex h-fit">
        <p className="font-mono text-sm/6 font-medium tracking-widest text-zinc-500 uppercase">
          {formatDate(meta.date, 'long')}
        </p>
        <div className="m-0 flex list-none items-center font-mono text-sm/6 font-medium tracking-widest text-zinc-500 uppercase">
          <div className="inline-flex items-center">
            <span className="mx-4 inline-block size-0.75 rounded-full bg-current" />
            <span className="leading-none">{formatTimeLocal(meta.date)}</span>
          </div>
        </div>
      </div>
      <div className="relative sm:col-span-2 sm:max-w-2xl">
        <div className="prose prose-blog">{children}</div>
        {meta.image ? (
          <Image
            src={meta.image as { src: string; width: number; height: number }}
            darkSrc={meta.imageDark}
            alt=""
            className="mt-8"
          />
        ) : null}
      </div>
    </div>
  )
}
