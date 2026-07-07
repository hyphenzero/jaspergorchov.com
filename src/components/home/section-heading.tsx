import clsx from 'clsx'
import React from 'react'
import type { ComponentProps } from 'react'
import { Eyebrow, type EyebrowColor } from '@/components/eyebrow'

export function SectionEyebrow({ color, className, children }: { color: EyebrowColor; className?: string; children: React.ReactNode }) {
  return (
    <Eyebrow color={color} className={clsx('font-semibold text-sm', className)}>
      {children}
    </Eyebrow>
  )
}

export function SectionHeading({ className, children, ...props }: ComponentProps<'h2'> & { className?: string; children: React.ReactNode }) {
  return (
    <h2 className={clsx('mt-5 max-w-[40ch] text-pretty text-[2.5rem]/[2.75rem] text-zinc-950 tracking-tight sm:text-[3.5rem]/[3.75rem] dark:text-white', className)} {...props}>
      {children}
    </h2>
  )
}

export function SectionDescriptionLead({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <strong className={clsx('font-normal text-zinc-950 dark:text-white', className)}>
      {children}
    </strong>
  )
}

export function SectionDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={clsx('mt-6 max-w-[40ch] text-pretty text-[2.5rem]/[2.75rem] tracking-tight sm:text-[3.5rem]/[3.75rem]', className)}>
      {React.Children.map(children, child =>
        typeof child === 'string' || typeof child === 'number'
          ? <span className="text-zinc-500 dark:text-zinc-400">{child}</span>
          : child
      )}
    </p>
  )
}
