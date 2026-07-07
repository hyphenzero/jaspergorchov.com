import clsx from 'clsx'
import { Logo } from '@/components/logo'
import { ThemeImage } from '@/components/theme-image'
import { timeAgo } from '@/lib/api-utils'

type NoteMeta = {
  date: string
  image?: {
    src: string
    width?: number
    height?: number
  }
}

type NoteCardProps = {
  meta: NoteMeta
  className?: string
  children: React.ReactNode
}

export function NoteCard({ meta, className, children }: NoteCardProps) {
  return (
    <div className={clsx('rounded-3xl border border-zinc-200 p-4 dark:border-zinc-800', className)}>
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-950/8 dark:bg-zinc-900">
          <Logo className="size-5" />
        </span>
        <div>
          <p className="font-semibold text-sm text-zinc-950 dark:text-white">Jasper Gorchov</p>
          <p className="font-mono text-xs/5 text-zinc-500 uppercase tracking-widest">{timeAgo(meta.date)}</p>
        </div>
      </div>
      <div className="prose prose-blog mt-4 max-w-none">{children}</div>
      {meta.image ? (
        <div className="not-prose relative mt-6 overflow-hidden rounded-lg">
          <div className="pointer-events-none absolute inset-0 z-10 rounded-lg ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />
          <ThemeImage
            unoptimized
            src={meta.image.src}
            width={meta.image.width!}
            height={meta.image.height!}
            alt=""
            className="aspect-auto h-auto w-full"
          />
        </div>
      ) : null}
    </div>
  )
}
