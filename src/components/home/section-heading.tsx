import { Eyebrow, type EyebrowColor } from '@/components/eyebrow'
import clsx from 'clsx'
import type { ComponentProps } from 'react'
import React from 'react'

export function SectionEyebrow({
  color,
  className,
  children,
}: {
  color: EyebrowColor
  className?: string
  children: React.ReactNode
}) {
  return (
    <Eyebrow color={color} className={clsx('text-sm font-semibold', className)}>
      {children}
    </Eyebrow>
  )
}

export function SectionHeading({
  className,
  children,
  ...props
}: ComponentProps<'h2'> & { className?: string; children: React.ReactNode }) {
  return (
    <h2
      className={clsx(
        'font-book mt-5 max-w-[40ch] text-2xl tracking-tight text-pretty text-zinc-950 sm:text-4xl md:text-5xl/15 dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function SectionDescriptionLead({ className, children }: { className?: string; children: React.ReactNode }) {
  return <strong className={clsx('font-book text-zinc-950 dark:text-white', className)}>{children}</strong>
}

export function SectionDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p
      className={clsx(
        'font-book mt-6 max-w-[40ch] text-2xl tracking-tight text-pretty sm:text-4xl md:text-5xl/15',
        className
      )}
    >
      {React.Children.map(children, (child) =>
        typeof child === 'string' || typeof child === 'number' ? (
          <span className="text-zinc-500 dark:text-zinc-400">{child}</span>
        ) : (
          child
        )
      )}
    </p>
  )
}
