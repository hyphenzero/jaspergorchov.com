import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { ThemeImage } from '@/components/theme-image'
import { TrackPageView } from '@/components/track-page-view'
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
    description: post.meta.lead,
    openGraph: {
      title: post.meta.title,
      description: post.meta.lead,
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
      description: post.meta.lead,
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
      <Container className="mt-9 xl:mt-28">
        <div className="mx-auto flex gap-12 max-xl:max-w-3xl max-xl:flex-col xl:items-center xl:gap-26">
          <Button href="/blog" plain className="w-fit -translate-x-2.5 py-0.5! pr-2.5! pl-1.5! font-medium!">
            <ChevronLeftIcon /> Back to Blog
          </Button>

          <span className="flex items-center font-mono text-sm/7 font-semibold tracking-widest text-sky-500 uppercase dark:text-sky-400">
            <time dateTime={releaseDate}>{formatDate(releaseDate, 'long')}</time>

            {updatedDate && updatedDate !== releaseDate ? (
              <>
                <div className="mx-4 size-1 rounded-full bg-current" />
                <span>Updated&nbsp;</span>
                <time>{formatDate(updatedDate, 'long')}</time>
              </>
            ) : null}
          </span>
        </div>
      </Container>
      <div hidden />
      <div className="w-full px-6">
        <div className="mx-auto mt-5 flex w-full max-w-3xl flex-col">
          <h1 className="inline-block max-w-3xl text-5xl font-medium tracking-tight text-pretty text-zinc-950 dark:text-zinc-200">
            {post.meta.title}
          </h1>

          {post.meta.lead ? (
            <p className="mt-5 text-base/8 text-zinc-700 dark:text-zinc-300">{post.meta.lead}</p>
          ) : null}

          <div className="mt-6 flex items-center gap-x-3">
            {post.meta.tags.map((tag: string) => (
              <Link
                className="rounded-full bg-zinc-200 px-2.5 pt-0.75 pb-1 text-sm font-medium text-zinc-950 transition hover:text-zinc-600 dark:border-t dark:border-white/10 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                key={tag}
                href={`/blog?category=${tag.toLowerCase().replace(/\s+/g, '+')}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <article className="prose prose-blog mx-auto mt-26 max-w-7xl px-6 *:mx-auto lg:px-8">
        {post.meta.image?.src ? (
          <div data-media>
            <div className="not-prose relative overflow-hidden rounded-xl">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />
              <div
                className="relative w-full"
                style={
                  post.meta.image.width && post.meta.image.height
                    ? { aspectRatio: `${post.meta.image.width} / ${post.meta.image.height}` }
                    : { aspectRatio: '16 / 9' }
                }
              >
                <ThemeImage
                  priority
                  unoptimized
                  fill
                  src={post.meta.image.src}
                  darkSrc={post.meta.imageDark?.src}
                  alt={post.meta.title ?? ''}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ) : null}
        <post.Component />
      </article>
      <TrackPageView />
    </>
  )
}
