import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import Image from 'next/image'
import { Text } from './text'

export const MDXComponents = {
  pre: function Pre({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <>
        <pre
          className={clsx(
            'my-8 max-w-full overflow-x-auto rounded-xl border border-zinc-950/10 px-5 py-4 text-sm/6 dark:border-transparent dark:bg-zinc-900',
            className
          )}
        >
          {children}
        </pre>
      </>
    )
  },
  code: function Code({ children, className }: { children: React.ReactNode; className?: string }) {
    return <code className={clsx('relative inset-0 size-full min-w-full', className)}>{children}</code>
  },
  ins: function Ins({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <ins
        className={clsx(
          'before:content-[&quot;+&quot;] absolute inset-x-0 flex select-none border-l-2 border-teal-400/75 bg-teal-400/[0.15] pl-3 before:text-teal-400',
          className
        )}
      >
        {children}
      </ins>
    )
  },
  del: function Del({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <ins
        className={clsx(
          'before:content-[&quot;-&quot;] absolute inset-x-0 flex select-none border-l-2 border-rose-400/75 bg-rose-500/[0.15] pl-3 before:text-rose-400',
          className
        )}
      >
        {children}
      </ins>
    )
  },
  img: function Img({ className, ...props }: React.ComponentPropsWithoutRef<typeof Image>) {
    return (
      <div className={clsx('relative my-9 overflow-clip rounded-xl', className)}>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
        <Image {...props} sizes="(min-width: 768px) 42rem, 100vw" className="aspect-video w-full object-cover" alt="" />
      </div>
    )
  },
  table: function Table({ className, ...props }: React.ComponentPropsWithoutRef<'table'>) {
    return (
      <div className={clsx('my-10 max-sm:flex max-sm:overflow-x-auto', className)}>
        <div className="max-sm:min-w-full max-sm:flex-none max-sm:px-6">
          <table {...props} />
        </div>
      </div>
    )
  },
  Info({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={clsx('my-10 flex w-full gap-6 rounded-lg bg-zinc-950/5 p-6 dark:bg-white/5', className)}>
        <InformationCircleIcon className="size-5 text-zinc-950 dark:text-white" />
        <Text>{children}</Text>
      </div>
    )
  },
  Warning({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={clsx('my-10 flex w-full gap-6 rounded-xl bg-yellow-300/50 p-6 dark:bg-yellow-400/50', className)}>
        <ExclamationTriangleIcon className="size-5 text-zinc-950 dark:text-white" />
        <Text>{children}</Text>
      </div>
    )
  },
  Typography({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    return <div className={clsx('typography', className)} {...props} />
  },
  wrapper({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    return (
      <div
        className={clsx('*:mx-auto *:max-w-3xl [&>:first-child]:!mt-0 [&>:last-child]:!mb-0', className)}
        {...props}
      />
    )
  },
}
