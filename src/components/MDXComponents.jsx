import Image from 'next/image'

import clsx from 'clsx'

import { TagList, TagListItem } from '@/components/TagList'

export const MDXComponents = {
  img: function Img({ className, ...props }) {
    return (
      <div
        className={clsx(
          'group isolate relative my-10 overflow-hidden rounded-3xl bg-neutral-912 max-sm:-mx-6',
          className,
        )}
			>
				<div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
        <Image {...props} className="aspect-[16/10] w-full object-cover" />
      </div>
    )
  },
  table: function Table({ className, ...props }) {
    return (
      <div
        className={clsx(
          'my-10 max-sm:-mx-6 max-sm:flex max-sm:overflow-x-auto',
          className,
        )}
      >
        <div className="max-sm:min-w-full max-sm:flex-none max-sm:px-6">
          <table {...props} />
        </div>
      </div>
    )
  },
  TagList({ className, ...props }) {
    return <TagList className={clsx('my-6', className)} {...props} />
  },
  TagListItem,
  TopTip({ className, children }) {
    return (
      <div className={clsx('my-10 pl-8', className)}>
        <p className="font-display text-sm font-bold uppercase tracking-widest text-neutral-950">
          Top tip
        </p>
        <div className="mt-4">{children}</div>
      </div>
    )
  },
  Typography({ className, ...props }) {
    return <div className={clsx('typography', className)} {...props} />
  },
  wrapper({ className, ...props }) {
    return (
      <div
        className={clsx(
          '[&>*]:mx-auto [&>*]:max-w-3xl [&>:first-child]:!mt-0 [&>:last-child]:!mb-0',
          className,
        )}
        {...props}
      />
    )
  },
}
