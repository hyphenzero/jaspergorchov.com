import { clsx } from 'clsx'
import type { HTMLAttributes } from 'react'

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mx-auto max-w-7xl px-6 lg:px-8', className)} {...props} />
}
