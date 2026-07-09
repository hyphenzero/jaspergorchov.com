import clsx from 'clsx'
import type { ComponentProps } from 'react'
import React from 'react'
import { Eyebrow, type EyebrowColor } from '@/components/eyebrow'

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
    <Eyebrow color={color} className={clsx('font-semibold text-sm', className)}>
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
        'mt-5 max-w-[40ch] text-pretty font-book text-2xl text-zinc-950 tracking-tight sm:text-4xl md:text-5xl/15 dark:text-white',
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
        'mt-6 max-w-[40ch] text-pretty font-book text-2xl tracking-tight sm:text-4xl md:text-5xl/15',
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
