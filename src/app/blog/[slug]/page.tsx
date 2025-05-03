import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { formatDate, getBlogPostBySlug, getBlogPostSlugs } from '../api'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  let slugs = await getBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  let params = await props.params
  let post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  return {
    metadataBase: new URL('https://tailwindcss.com'),
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: 'article',
      url: `/blog/${params.slug}`,
      images: [
        {
          url: post.meta.image ? post.meta.image.src : `/api/og?path=/blog/${params.slug}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.description,
      images: [
        {
          url: post.meta.image ? post.meta.image.src : `/api/og?path=/blog/${params.slug}`,
        },
      ],
      site: '@tailwindcss',
      creator: '@tailwindcss',
    },
  }
}

export default async function ArticlePage(props: Props) {
  let params = await props.params
  let post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  return (
    <>
      {/* Add a placeholder div so the Next.js router can find the scrollable element. */}
      <div hidden />

      <div className="max-w-(--breakpoint-md) mx-auto w-full px-6">
        <div className="mt-16 font-mono text-sm/7 font-medium uppercase tracking-widest text-zinc-500">
          <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
        </div>

        <div className="mb-6 xl:mb-16">
          <h1 className="max-w-(--breakpoint-md) inline-block text-pretty text-[2.5rem]/10 tracking-tight text-zinc-950 max-lg:font-medium lg:text-6xl dark:text-zinc-200">
            {post.meta.title}
          </h1>
        </div>
      </div>

      <article className="prose prose-blog px-6 *:mx-auto lg:px-8">
        <post.Component />
      </article>
    </>
  )
}
