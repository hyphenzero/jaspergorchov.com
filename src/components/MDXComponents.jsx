import Image from 'next/image'

import clsx from 'clsx'

import { TagList, TagListItem } from '@/components/TagList'

export const MDXComponents = {
  img: function Img({ className, ...props }) {
    return (
      <div
        className={clsx(
          'relative isolate my-12 overflow-hidden rounded-xl bg-neutral-912',
          className,
        )}
      >
        <div className="absolute inset-0 z-10 rounded-xl ring-1 ring-inset ring-white/10" />
        <Image
          {...props}
          alt=""
          sizes="(min-width: 768px) 42rem, 100vw"
          className="aspect-[3/2] w-full object-cover"
          quality={100}
        />
      </div>
    )
  },
  TagList({ className, ...props }) {
    return <TagList className={clsx('my-6', className)} {...props} />
  },
  TagListItem,
  Tip({ className, children }) {
    return (
      <div className={clsx('my-10 pl-8', className)}>
        <p className="font-display text-sm font-bold uppercase tracking-widest text-white">
          {' '}
          Tip
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
