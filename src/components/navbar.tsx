'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import React, { forwardRef, useId } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

export function Navbar({ className, ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav {...props} className={clsx(className, 'flex flex-1 items-center gap-4')} />
}

export function NavbarDivider({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" {...props} className={clsx(className, 'h-6 w-px bg-zinc-950/10 dark:bg-white/10')} />
}

export function NavbarSection({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  let id = useId()

  return (
    <LayoutGroup id={id}>
      <div {...props} className={clsx(className, 'flex items-center gap-6')} />
    </LayoutGroup>
  )
}

export function NavbarSpacer({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" {...props} className={clsx(className, '-ml-4 flex-1')} />
}

export const NavbarItem = forwardRef(function NavbarItem(
  {
    current,
    animateIndicator,
    className,
    children,
    ...props
  }: { current?: boolean; className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  ) & { animateIndicator?: boolean },
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  let classes = clsx(
    // Base
    'relative flex min-w-0 items-center gap-3 rounded-[1rem] px-3 py-1.5 text-left font-medium text-base/6 text-zinc-950 transition sm:text-sm/5',
    // Leading icon/icon-only
    '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5',
    // Trailing icon (down chevron or similar)
    '*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4',
    // Avatar
    '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 sm:*:data-[slot=avatar]:size-6 *:data-[slot=avatar]:[--avatar-radius:var(--radius-md)]',
    // Hover
    'data-hover:bg-zinc-950/5 data-hover:*:data-[slot=icon]:fill-zinc-950',
    // Active
    'data-active:bg-zinc-950/5 data-active:*:data-[slot=icon]:fill-zinc-950',
    // Dark mode
    'dark:text-white dark:*:data-[slot=icon]:fill-zinc-400',
    'dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white',
    'dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-white'
  )

  return (
    <span className={clsx(className, 'relative')}>
      <AnimatePresence initial={false}>
        {current && (
          <motion.span
            key="current-indicator"
            layoutId="current-indicator"
            style={{ originY: '0px' }}
            // layoutRoot
            // Only play the mount/unmount opacity + scale animation when
            // `animateIndicator` is true. When switching between navbar items
            // we rely on the shared layout animation (layoutId) so we omit
            // initial/exit to prevent the fade/scale effect.
            {...(animateIndicator
              ? {
                  initial: { opacity: 0, scaleX: 0.5 },
                  animate: { opacity: 1, scaleX: 1 },
                  exit: { opacity: 0, scaleX: 0.5 },
                }
              : {})}
            className="absolute inset-x-2.5 bottom-[-0.96875rem] h-0.5 origin-center translate-y-0! rounded-full bg-sky-500 bg-zinc-400_ shadow-2xl shadow-sky-400 dark:bg-sky-400 dark:bg-zinc-600_"
          />
        )}
      </AnimatePresence>
      {'href' in props ? (
        <Link
          {...props}
          className={classes}
          data-current={current ? 'true' : undefined}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          <TouchTarget>{children}</TouchTarget>
        </Link>
      ) : (
        <Headless.Button
          {...props}
          className={clsx('cursor-default', classes)}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
})

export function NavbarLabel({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'truncate')} />
}
