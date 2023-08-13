import clsx from 'clsx'

export function Section({ floating, children, className }) {
  return (
    <div
      className={clsx(
        'rounded-3xl py-14 sm:py-32',
        floating ? 'bg-white text-neutral-950' : 'bg-neutral-912 text-white',
        className,
      )}
    >
      <div
        className={clsx(
          'mx-auto w-full px-8',
          floating ? 'max-w-5xl' : 'max-w-7xl',
        )}
      >
        {children}
      </div>
    </div>
  )
}
