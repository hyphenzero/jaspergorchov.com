'use client'

import clsx from 'clsx'
import { motion } from 'motion/react'
import { Link } from '@/components/link'

export function CategorySelector({
  allTags,
  selectedCategory,
}: {
  allTags: { original: string; normalized: string }[]
  selectedCategory: string
}) {
  const tags = allTags.map(({ original, normalized }) => ({ label: original, value: normalized }))
  const category = selectedCategory

  const unknownCategory = !tags.some(({ value }) => value === category) && category !== 'all'

  return (
    <nav className="relative mt-28">
      <div className="pointer-events-none absolute inset-0 z-10 brightness-200" />
      <ul className="flex gap-4">
        <li key="all">
          <Link
            href={`/blog`}
            className={clsx('group relative block rounded-full px-2.5 py-1 font-medium text-sm transition')}
          >
            {category === 'all' && (
              <motion.span
                layoutId="blog-selected-background"
                className="absolute inset-0 -z-10 bg-zinc-200 dark:border-white/10 dark:border-t dark:bg-zinc-700"
                style={{ borderRadius: 9999 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}

            <span
              className={clsx(
                'text-zinc-950 transition dark:text-white',
                category !== 'all' && 'group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
              )}
            >
              All categories
            </span>
          </Link>
        </li>
        {tags.map((tag) => (
          <li key={tag.value}>
            <Link
              href={`?category=${encodeURIComponent(tag.value)}`}
              className={clsx('group relative block rounded-full px-2.5 py-1 font-medium text-sm transition')}
            >
              {category === tag.value && (
                <motion.span
                  layoutId="selected-background"
                  className="absolute inset-0 -z-10 bg-zinc-200 dark:border-white/10 dark:border-t dark:bg-zinc-700"
                  style={{ borderRadius: 9999 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              <span
                className={clsx(
                  'text-zinc-950 transition dark:text-white',
                  category !== tag.value && 'group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
                )}
              >
                {tag.label}
              </span>
            </Link>
          </li>
        ))}

        {unknownCategory && (
          <li>
            <Link
              href={`?category=${encodeURIComponent(category)}`}
              className={clsx('group relative block rounded-full px-2.5 py-1 font-medium text-sm transition')}
            >
              <motion.span
                layoutId="selected-background"
                className="absolute inset-0 -z-10 bg-zinc-200 dark:border-white/10 dark:border-t dark:bg-zinc-700"
                style={{ borderRadius: 9999 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
              <span className="text-zinc-950 capitalize transition dark:text-white">{category}</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
