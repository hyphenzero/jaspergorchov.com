import clsx from 'clsx'

export function TagList({ className, children }) {
  return (
    <ul role="list" className={clsx(className, 'flex flex-wrap gap-4')}>
      {children}
    </ul>
  )
}

export function TagListItem({ as: Component = 'li', className, children }) {
  return (
    <Component
      className={clsx(
        'rounded-full bg-white px-4 py-1.5 font-display text-base font-semibold text-neutral-950',
        className,
      )}
    >
      {children}
    </Component>
  )
}
