import { formatDate } from '@/lib/api'
import clsx from 'clsx'
import React from 'react'

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
      <div className="font-mono text-xs tracking-wider text-zinc-400 uppercase">{formatDate(date)}</div>
      {title ? (
        <h3 className="relative mt-3!">
          <span className="-left-[calc(var(--spacing)*8.125)] w-0.5 absolute inset-y-1 max-md:-left-[calc(var(--spacing)*6.125)] rounded-full bg-sky-500 ring-5 ring-white dark:bg-sky-400 dark:ring-zinc-950" />
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
      <ul data-timeline-list className="max-md:pl-6 mx-auto max-w-(--breakpoint-md)">
        {items.map((child, i) => (
          <li key={i} className="not-first:pt-12">
            {child}
          </li>
        ))}
      </ul>
    </div>
  )
}
