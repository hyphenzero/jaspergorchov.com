import clsx from 'clsx'

export function TagList({ className, children }) {
  return (
    <ul role="list" className={clsx(className, 'flex flex-wrap gap-4')}>
      {children}
    </ul>
  )
}

export function TagListItem({ className, children }) {
  return (
    <li
      className={clsx(
        'rounded-full bg-white px-4 py-1.5 font-display text-base font-semibold text-neutral-950',
        className,
      )}
    >
      {children}
    </li>
  )
}

export function Tag({ className, children }) {
  return (
    <div
      className={clsx(
        'rounded-full bg-white px-4 py-1.5 font-display text-base font-semibold text-neutral-950',
        className,
      )}
    >
      {children}
    </div>
  )
}
