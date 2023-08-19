import clsx from 'clsx'

import { ArrowUpRightIcon } from '@heroicons/react/20/solid'

export function LinkArrow({ className }) {
  return (
    <ArrowUpRightIcon
      className={clsx(
        'ml-1 inline-flex h-4 w-4 text-sky-300 opacity-0 transition-all duration-200 group-hover:opacity-100',
        className,
      )}
    />
  )
}
