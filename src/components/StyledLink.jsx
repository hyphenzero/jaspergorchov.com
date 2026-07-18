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
        'group font-medium text-white transition-colors duration-200',
        underline
          ? 'underline decoration-sky-300 underline-offset-[0.15em] [text-decoration-skip-ink:none] hover:decoration-2'
          : 'hover:text-sky-300',
        className,
      )}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowUpRightIcon className="ml-1 inline h-4 w-4 text-white transition-colors duration-200 group-hover:text-sky-300" />
      )}
    </Link>
  )
}
