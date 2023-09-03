import clsx from 'clsx'

export function Section({ children, className }) {
  return (
    <div
      className={clsx(
        'my-24 rounded-3xl bg-secondary py-24 text-white sm:my-32 sm:py-32',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6">{children}</div>
    </div>
  )
}
