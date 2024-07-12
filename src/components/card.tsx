import { clsx } from 'clsx'

type CardProps<T extends React.ElementType> = {
  as?: T
  flat?: boolean
  className?: string
  children?: React.ReactNode
}

export function Card<T extends React.ElementType = 'div'>({
  flat = false,
  as,
  className,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<T>, keyof CardProps<T>> & CardProps<T>) {
  let Component = as ?? 'div'

  return (
    <Component
      {...props}
      className={clsx(
        'relative h-full w-full rounded-xl dark:bg-zinc-900 forced-colors:outline',
        flat
          ? 'bg-zinc-100'
          : 'bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset]',
        className
      )}
    >
      {children}
    </Component>
  )
}
