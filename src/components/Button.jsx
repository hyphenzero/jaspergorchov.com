import Link from 'next/link'

import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export function Button({ href, arrow = false, className, children, ...props }) {
  className = clsx(
    className,
    'group inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-sm font-display font-semibold text-primary backdrop-blur-3xl transition duration-200 hover:bg-neutral-300',
  )

  let inner = <span className="relative top-px">{children}</span>

  if (href) {
    return (
      <Link href={href} className={className} {...props}>
        {inner}
        {arrow && <ArrowUpRightIcon className="ml-1 w-4 h-4 " />}
      </Link>
    )
  }

  return (
    <button className={className} {...props}>
      {inner}
      {arrow && <ArrowUpRightIcon className="ml-1 w-4 h-4 " />}
    </button>
  )
}
