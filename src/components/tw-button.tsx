import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

export function Button({ className, children, href }: { children: React.ReactNode; className?: string; href: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        className,
        'inline-block rounded-4xl bg-black px-4 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 data-slot=icon:-mr-0.5 data-slot=icon:w-2.5 dark:bg-zinc-700 dark:hover:bg-zinc-600'
      )}
    >
      {children}
    </Link>
  )
}
