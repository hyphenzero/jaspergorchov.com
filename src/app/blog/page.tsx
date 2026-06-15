import type { Metadata } from 'next'
import { Container } from '@/components/container'
import { getAllBlogPosts } from '@/lib/api'
import { BlogPostRow } from './blog-post-row'
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

  const tags = [
    { label: 'All categories', value: 'all' },
    ...Array.from(new Set(publicPosts.flatMap((post) => post.meta.tags))).map((t) => ({
      label: t,
      value: t.toLowerCase(),
    })),
  ]

  const category = searchParams?.category?.toLowerCase() ?? 'all'

  const posts =
    category === 'all'
      ? publicPosts
      : publicPosts.filter((post) => post.meta.tags.some((tag) => tag.toLowerCase() === category))

  return (
    <Container className="relative mt-28">
      <span className="absolute -z-10 -mt-3 -ml-3 text-balance font-semibold text-7xl text-zinc-200 sm:-mt-4 sm:-ml-4 sm:text-8xl lg:-mt-6 lg:-ml-4 lg:text-9xl dark:text-zinc-800">
        /
      </span>
      <h1 className="text-balance text-6xl text-zinc-950 tracking-tighter sm:text-7xl lg:text-8xl dark:text-white">
        Blog
      </h1>
      <p className="mt-8 max-w-2xl text-pretty font-medium text-lg/9 text-zinc-600 dark:text-zinc-400">
        My latest updates, as well as things I find interesting in the worlds of programming, design, 3D art, and
        digital creativity.
      </p>

      <CategorySelector tags={tags} category={category} />

      <div className="mt-6">
        {posts.length === 0 ? (
          <p className="py-32 text-center text-zinc-500 dark:text-zinc-400">No posts found.</p>
        ) : (
          posts.map(({ meta, slug }) => <BlogPostRow key={slug} meta={meta} slug={slug} />)
        )}
      </div>
    </Container>
  )
}
