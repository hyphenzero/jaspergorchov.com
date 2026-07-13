import clsx from 'clsx'

const colors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'zinc',
] as const

export type EyebrowColor = (typeof colors)[number]

const colorClasses: Record<EyebrowColor, string> = {
  red: 'text-red-500 dark:text-red-400',
  orange: 'text-orange-500 dark:text-orange-400',
  amber: 'text-amber-500 dark:text-amber-400',
  yellow: 'text-yellow-500 dark:text-yellow-400',
  lime: 'text-lime-500 dark:text-lime-400',
  green: 'text-green-500 dark:text-green-400',
  emerald: 'text-emerald-500 dark:text-emerald-400',
  teal: 'text-teal-500 dark:text-teal-400',
  cyan: 'text-cyan-500 dark:text-cyan-400',
  sky: 'text-sky-500 dark:text-sky-400',
  blue: 'text-blue-500 dark:text-blue-400',
  indigo: 'text-indigo-500 dark:text-indigo-400',
  violet: 'text-violet-500 dark:text-violet-400',
  purple: 'text-purple-500 dark:text-purple-400',
  fuchsia: 'text-fuchsia-500 dark:text-fuchsia-400',
  pink: 'text-pink-500 dark:text-pink-400',
  rose: 'text-rose-500 dark:text-rose-400',
  zinc: 'text-zinc-500 dark:text-zinc-400',
}

type EyebrowProps = {
  color?: EyebrowColor
  className?: string
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<'span'>

export function Eyebrow({ color = 'zinc', className, children, ...props }: EyebrowProps) {
  return (
    <span className={clsx('font-mono tracking-widest uppercase', colorClasses[color], className)} {...props}>
      {children}
    </span>
  )
}
