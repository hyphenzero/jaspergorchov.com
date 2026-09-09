import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

export function Button({
  className,
  outline,
  children,
  href,
}: {
  children: React.ReactNode
  className?: string
  href: string
  outline?: boolean
}) {
  return (
    <Link
      href={href}
      className={clsx(
        className,
        'data-slot=icon:-mr-0.5 data-slot=icon:w-2.5 relative inline-block rounded-4xl px-4 py-2 text-center text-sm/6 font-semibold transition',
        outline
          ? 'ring-1 ring-zinc-950/10 hover:bg-zinc-950/3 hover:ring-zinc-950/15 dark:ring-white/10 dark:hover:bg-white/3 dark:hover:ring-white/15'
          : 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-sky-500 dark:hover:bg-zinc-600'
      )}
    >
      <div className="absolute inset-0 rounded-full"></div>
      {children}
    </Link>
  )
}
