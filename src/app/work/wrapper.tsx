import { Container } from '@/components/container'
import { FadeIn } from '@/components/fade-in'
import { MDXComponents } from '@/components/mdx-components'
import {} from '@/components/social-icons'
import { FacebookIcon, InstagramIcon, XIcon } from '@/components/social-media'
import { Tag } from '@/components/tag'
// import { PageLinks } from '@/components/PageLinks'
import { formatDate } from '@/lib/formatDate'
import { loadArticles, type Article, type MDXEntry } from '@/lib/mdx'
import { LinkIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import Link from 'next/link'

export default async function BlogArticleWrapper({
  article,
  children,
}: {
  article: MDXEntry<Article>
  children: React.ReactNode
}) {
  let allArticles = await loadArticles()
  let moreArticles = allArticles.filter(({ metadata }) => metadata !== article).slice(0, 2)

  const articleTitle = article.title
  const matchingArticle = allArticles.find((article) => article.title === articleTitle)
  const articleHref = matchingArticle ? matchingArticle.href : null

  return (
    <>
      <article className="pt-8 sm:pt-12 lg:pt-24">
        <FadeIn>
          <header className="mx-auto flex max-w-3xl flex-col px-6 text-center lg:px-8">
            <h1 className="mt-5 block text-balance text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-[length:clamp(2rem,3.75vw,3rem)] dark:text-white">
              {article.title}
            </h1>
            <time
              dateTime={article.date}
              className="order-first block font-mono text-sm/5 font-semibold uppercase tracking-widest text-sky-500 dark:text-sky-400"
            >
              {formatDate(article.date, true)}
            </time>
            <div className="mt-6 flex items-center justify-center gap-4 [&_[data-slot=icon]]:size-5 [&_[data-slot=icon]]:text-zinc-600 [&_[data-slot=icon]]:transition hover:[&_[data-slot=icon]]:text-zinc-950 dark:[&_[data-slot=icon]]:text-zinc-400 dark:hover:[&_[data-slot=icon]]:text-white">
              {article.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
              {article.tags && <div aria-hidden="true" className="h-6 w-px bg-zinc-950/10 dark:bg-white/10" />}
              <Link
                href={`https://x.com/intent/tweet?original_referer=https%3A%2F%2Fjaspergorchov.com${articleHref}&text=Check%20out%20this%20article%20by%20Jasper%20Gorchov,%20a%2013-year-old%20developer,%20designer,%20and%20digital%20artist%3A&url=https%3A%2F%2Fjaspergorchov.com${articleHref}`}
                aria-label="Share this article via X"
              >
                <XIcon />
              </Link>
              <InstagramIcon />
              <FacebookIcon />
              <LinkIcon />
            </div>
          </header>
        </FadeIn>

        <FadeIn wait={2}>
          <Image src={article.cover} alt="" className="max-sm:hidden_ mt-16 w-dvw sm:mt-24" />

          {/* <div className="sm:hidden mx-auto max-w-3xl px-3">
            <div className="relative my-12 overflow-clip rounded-2xl">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              <Image
                src={article.cover}
                alt=""
                sizes="(min-width: 768px) 42rem, 100vw"
                className="inset-0 object-cover"
              />
            </div>
          </div> */}
        </FadeIn>

        <FadeIn>
          <Container>
            <MDXComponents.wrapper className="mt-16">{children}</MDXComponents.wrapper>
          </Container>
        </FadeIn>
      </article>

      {/* {moreArticles.length > 0 && (
        <PageLinks className="mt-24 sm:mt-32 lg:mt-40" title="More articles" pages={moreArticles} />
      )} */}

      {/* <ContactSection /> */}
    </>
  )
}
