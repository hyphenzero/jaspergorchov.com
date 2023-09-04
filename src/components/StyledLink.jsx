import Link from 'next/link'

import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export function StyledLink({
  arrow = false,
  underline = true,
  className,
  children,
  ...props
}) {
  return (
    <Link
      className={clsx(
        'group text-white font-medium transition-colors duration-200',
        underline
          ? 'underline decoration-sky-300 underline-offset-[0.15em] hover:decoration-2 [text-decoration-skip-ink:none]'
          : 'hover:text-sky-300',
        className,
      )}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowUpRightIcon className="inline ml-1 w-4 h-4 text-white group-hover:text-sky-300 transition-colors duration-200" />
      )}
    </Link>
  )
}
