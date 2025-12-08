import { Container } from '@/components/container'
import { TagButton } from '@/components/tag'
import { formatDate, getAllBlogPosts } from '@/lib/api'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CategorySelector } from './category-selector'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Interesting articles and news from 14-year-old Jasper Gorchov.',
  openGraph: {
    type: 'article',
    title: 'Latest updates - Blog',
    description: 'All the latest Tailwind CSS news, straight from the team.',
    images: 'https://tailwindcss.com/api/og?path=/blog',
    url: 'https://tailwindcss.com/blog',
  },
}

export default async function Blog(props: { searchParams?: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams
  const allPosts = await getAllBlogPosts()
  const publicPosts = allPosts.filter((post) => !post.meta.private)

  const allTags = Array.from(new Set(publicPosts.flatMap((post) => post.meta.tags))).map((tag) => ({
    original: tag,
    normalized: tag.toLowerCase(),
  }))

  const category = searchParams?.category?.toLowerCase() ?? 'all'

  const posts =
    category === 'all'
      ? publicPosts
      : publicPosts.filter((post) => post.meta.tags.some((tag) => tag.toLowerCase() === category))

  return (
    <Container className="relative mt-48">
      <h1 className="text-5xl font-medium tracking-tight text-balance text-zinc-950 lg:text-6xl dark:text-white">
        Blog
      </h1>
      <p className="mt-8 max-w-2xl text-lg/9 font-medium text-pretty text-zinc-600 dark:text-zinc-400">
        My latest updates, as well as things I find interesting in the worlds of programming, design, 3D art, and
        digital creativity.
			</p>
			
			<CategorySelector allTags={allTags} selectedCategory={category} />
			
      <div className="mt-6">
        {posts.length === 0 ? (
          <p className="py-32 text-center text-zinc-500 dark:text-zinc-400">No posts found.</p>
        ) : (
          posts.map(({ meta, slug }) => (
            <div
              key={slug}
              className="group relative grid grid-cols-1 border-b border-b-zinc-100 py-10 **:cursor-pointer first:border-t first:border-t-zinc-200 max-sm:gap-3 sm:grid-cols-3 dark:border-b-zinc-900 dark:first:border-t-zinc-800"
            >
              <Link href={`/blog/${slug}`} className="absolute inset-0 z-10" />
              <div>
                <div className="px-2 font-mono text-sm/6 font-medium tracking-widest text-gray-500 uppercase">
                  {formatDate(meta.date)}
                </div>
                <div className="mt-4.5 flex items-center gap-x-3">
                  {meta.tags.map((tag) => (
                    <TagButton
                      className="z-10"
                      href={`/blog?category=${tag.toLowerCase().replace(/\s+/g, '+')}`}
                      key={tag}
                    >
                      {tag}
                    </TagButton>
                  ))}
                </div>
              </div>
              <div className="relative sm:col-span-2 sm:max-w-2xl">
                <h2 className="font-semibold text-zinc-950 dark:text-white">{meta.title}</h2>
                <p className="prose prose-blog mt-4 line-clamp-3 leading-7">{meta.excerpt}</p>
                <p className="mt-4 flex w-fit items-end gap-1 text-sm font-semibold text-sky-500 dark:text-sky-400">
                  Read more
                  <ChevronRightIcon className="size-4 -translate-x-2 -translate-y-0.25 text-sky-500/50 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 dark:text-sky-400/50" />
                </p>
                <div className="scale-95_ absolute -inset-5 -z-10 bg-zinc-100/80 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:rounded-2xl dark:bg-zinc-900/50" />
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  )
}
