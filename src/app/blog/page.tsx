import type { Metadata } from 'next'
import type React from 'react'
import { Container } from '@/components/container'
import { SubscribeForm } from '@/components/subscribe-form'
import { getAllBlogPosts, getAllNotes } from '@/lib/api'
import { BlogPostRow } from './blog-post-row'
import { CategorySelector } from './category-selector'
import { NoteRow } from './note-row'
import { NotesToggle } from './notes-toggle'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'My latest updates, as well as things I find interesting in the worlds of programming, design, 3D art, and digital creativity.',
  openGraph: {
    type: 'article',
    title: 'Latest updates - Blog',
    description: 'All the latest Tailwind CSS news, straight from the team.',
    images: 'https://jaspergorchov.com/api/og?path=/blog',
    url: 'https://jaspergorchov.com/blog',
  },
}

async function getAllEntries() {
  const [allPosts, allNotes] = await Promise.all([getAllBlogPosts(), getAllNotes()])

  const publicPosts = allPosts.filter((post) => !post.meta.private)

  const entries: (
    | { kind: 'blog'; Component: React.FC; meta: (typeof publicPosts)[number]['meta']; slug: string }
    | { kind: 'note'; Component: React.FC; meta: (typeof allNotes)[number]['meta']; slug: string }
  )[] = [
    ...publicPosts.map((p) => ({ ...p, kind: 'blog' as const })),
    ...allNotes.map((p) => ({ ...p, kind: 'note' as const })),
  ]

  entries.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

  return entries
}

export default async function Blog(props: { searchParams?: Promise<{ category?: string; notes?: string }> }) {
  const searchParams = await props.searchParams
  const entries = await getAllEntries()

  const tags = [
    { label: 'All categories', value: 'all' },
    ...Array.from(new Set(entries.flatMap((e) => (e.kind === 'blog' ? e.meta.tags : [])))).map((t) => ({
      label: t,
      value: t.toLowerCase(),
    })),
  ]

  const category = searchParams?.category?.toLowerCase() ?? 'all'
  const showNotes = (searchParams?.notes ?? 'show') !== 'hide'

  const filteredEntries = entries.filter((e) => {
    // Apply notes filter first
    if (e.kind === 'note' && !showNotes) return false
    // Apply category filter to blog posts only
    if (category !== 'all' && e.kind === 'blog' && !e.meta.tags.some((tag: string) => tag.toLowerCase() === category)) {
      return false
    }
    return true
  })

  return (
    <Container className="relative mt-28">
      <span className="absolute -z-10 -mt-3 -ml-3 text-balance font-semibold text-7xl text-zinc-200 sm:-mt-4 sm:-ml-4 sm:text-8xl lg:-mt-6 lg:-ml-4 lg:text-9xl dark:text-zinc-800">
        /
      </span>
      <div className="flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="w-full">
          <h1 className="text-balance text-6xl text-zinc-950 tracking-tighter sm:text-7xl lg:text-8xl dark:text-white">
            Blog
          </h1>
          <p className="mt-8 max-w-2xl text-pretty font-medium text-lg/9 text-zinc-600 dark:text-zinc-400">
            My latest updates, as well as things I find interesting in the worlds of programming, design, 3D art, and
            digital creativity.
          </p>
        </div>
        <SubscribeForm label="Subscribe via email" className="shrink-0 sm:mb-3" />
      </div>

      <div className="mt-28 flex items-start justify-between">
        <CategorySelector tags={tags} category={category} />
        <NotesToggle defaultValue="show" />
      </div>

      <div className="mt-6">
        {filteredEntries.length === 0 ? (
          <p className="py-32 text-center text-zinc-500 dark:text-zinc-400">No posts found.</p>
        ) : (
          filteredEntries.map((entry) =>
            entry.kind === 'blog' ? (
              <BlogPostRow key={entry.slug} meta={entry.meta} slug={entry.slug} />
            ) : (
              <NoteRow key={entry.slug} meta={entry.meta}>
                <entry.Component />
              </NoteRow>
            )
          )
        )}
      </div>
    </Container>
  )
}
