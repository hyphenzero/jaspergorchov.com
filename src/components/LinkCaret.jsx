import clsx from 'clsx'

import { ArrowUpRightIcon } from '@heroicons/react/20/solid'

export function LinkCaret({ className }) {
  return (
    <ArrowUpRightIcon
      className={clsx(
        'ml-1 h-4 w-4 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 motion-safe:group-hover:-translate-y-1',
        className,
      )}
    />
  )
}
