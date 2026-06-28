'use client'

import clsx from 'clsx'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { Link } from '@/components/link'

export function CategorySelector({ tags, category }: { tags: { label: string; value: string }[]; category: string }) {
  const pathname = usePathname()

  return (
    <nav className="relative mt-28">
      <div className="pointer-events-none absolute inset-0 z-10 brightness-200" />
      <ul className="flex flex-nowrap gap-4 overflow-x-auto">
        {tags.map((tag) => (
          <li key={tag.value}>
            <Link
              href={tag.value === 'all' ? pathname : `?category=${encodeURIComponent(tag.value)}`}
              scroll={false}
              className={clsx('group relative block rounded-full px-2.5 py-1 font-medium text-sm transition')}
            >
              {category === tag.value && (
                <motion.span
                  layoutId="projects-selected-background"
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
      </ul>
    </nav>
  )
}
