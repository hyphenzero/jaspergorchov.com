import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { formatDate, getBlogPostBySlug, getBlogPostSlugs } from '@/lib/api'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug((await props.params).slug)

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
      url: `/blog/${(await props.params).slug}`,
      images: [
        {
          url: post.meta.image ? post.meta.image.src : `/api/og?path=/blog/${(await props.params).slug}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.description,
      images: [
        {
          url: post.meta.image ? post.meta.image.src : `/api/og?path=/blog/${(await props.params).slug}`,
        },
      ],
      site: '@tailwindcss',
      creator: '@tailwindcss',
    },
  }
}

export default async function ArticlePage(props: Props) {
  const post = await getBlogPostBySlug((await props.params).slug)

  if (!post) {
    return notFound()
  }

  const meta = post.meta
  const releaseDate = meta.date
  const updatedDate = (meta as any).updatedDate ?? (meta as any).updated

  return (
    <>
      <Container className="mt-28">
        <Button href="/blog" plain className="-translate-x-3.75 px-2! py-0.5! font-medium!">
          <ChevronLeftIcon /> Back to Blog
        </Button>
      </Container>
      <div hidden />
      <div className="w-full px-6">
        <div className="mx-auto mt-16 flex w-full max-w-3xl flex-col">
          <span className="flex items-center font-mono text-sm/7 font-semibold tracking-widest text-sky-500 uppercase dark:text-sky-400">
            <time dateTime={releaseDate}>{formatDate(releaseDate)}</time>

            {updatedDate && updatedDate !== releaseDate ? (
              <>
                <div className="mx-4 size-1 rounded-full bg-current" />
                <span>Updated&nbsp;</span>
                <time>{formatDate(updatedDate)}</time>
              </>
            ) : null}
          </span>

          <h1 className="mt-5 inline-block max-w-3xl text-5xl font-medium tracking-tight text-pretty text-zinc-950 dark:text-zinc-200">
            {post.meta.title}
          </h1>

          <div className="mt-10 flex items-center gap-x-3">
            {post.meta.tags.map((tag: string) => (
              <Link
                className="rounded-full bg-zinc-200 px-2.5 py-1 text-sm font-medium text-zinc-950 dark:border-t dark:border-white/10 dark:bg-zinc-700 dark:text-white"
                key={tag}
                href={`/blog?category=${tag.toLowerCase().replace(/\s+/g, '+')}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <article className="prose prose-blog mx-auto mt-20 max-w-7xl px-6 *:mx-auto lg:px-8">
        <post.Component />
      </article>
    </>
  )
}
