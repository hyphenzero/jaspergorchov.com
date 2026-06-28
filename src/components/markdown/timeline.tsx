import clsx from 'clsx'
import React from 'react'
import { formatDate } from '@/lib/api'

export function TimelineItem({
  date,
  title,
  children,
  className,
}: {
  date: string
  title?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={clsx('relative', className)}>
      <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">{formatDate(date)}</div>
      {title ? (
        <h3 className="relative mt-3!">
          <span className="absolute inset-y-1 -left-[--spacing(8.125)] w-0.5 rounded-full bg-sky-500 ring-5 ring-white max-md:-left-[--spacing(6.125)] dark:bg-sky-400 dark:ring-zinc-950" />
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  )
}

export function Timeline({ children, className }: { children?: React.ReactNode; className?: string }) {
  const items = React.Children.toArray(children)

  return (
    <div data-timeline data-media className={clsx('relative w-fit', className)}>
      <div aria-hidden="true" className="absolute inset-y-12 left-0 w-px bg-zinc-950/10 md:-left-8 dark:bg-white/7.5" />
      <ul data-timeline-list className="mx-auto max-w-(--breakpoint-md) max-md:pl-6">
        {items.map((child, i) => (
          <li key={i} className="not-first:pt-12">
            {child}
          </li>
        ))}
      </ul>
    </div>
  )
}
