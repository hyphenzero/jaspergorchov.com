'use client'

import { Link } from '@/components/link'
import clsx from 'clsx'
import { motion } from 'motion/react'

export function CategorySelector({ tags, category }: { tags: { label: string; value: string }[]; category: string }) {
  return (
    <nav className="relative mt-20">
      <div className="pointer-events-none absolute inset-0 z-10 brightness-200" />
      <ul className="flex gap-4">
        {tags.map((tag) => (
          <li key={tag.value}>
            <Link
              href={`?category=${encodeURIComponent(tag.value)}`}
              className={clsx('relative block rounded-full px-2.5 py-1 text-sm font-medium transition')}
            >
              {category === tag.value && (
                <motion.span
                  layoutId="selected-background"
                  className="absolute inset-0 z-10 bg-[#F6F6F4] not-dark:mix-blend-difference dark:-z-10 dark:border-t-1 dark:border-white/7 dark:bg-zinc-800"
                  style={{ borderRadius: 9999 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              <span className="text-zinc-950 dark:text-white">{tag.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
