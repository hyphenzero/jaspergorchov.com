import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { BlogPostRow } from '@/app/blog/blog-post-row'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { HeroSection } from '@/components/home/hero-section'
import { RecentProjects } from '@/components/home/recent-projects'
import { TextureLab } from '@/components/home/texture-lab-client'
import { Logo } from '@/components/logo'
import { MiniEditor } from '@/components/mini-editor/mini-editor'
import { NewsletterSection } from '@/components/newsletter-section'
import { ThemeImage } from '@/components/theme-image'
import { getAllBlogPosts, getAllNotes, getAllProjects } from '@/lib/api'
import { timeAgo } from '@/lib/api-utils'

export default async function Home() {
  const projects = await getAllProjects()
  const blogPosts = await getAllBlogPosts()
  const notes = await getAllNotes()

  const serializableProjects = projects.map(({ Component, ...rest }) => rest)

  const recentPosts = blogPosts
    .filter((post) => !post.meta.private)
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    .slice(0, 3)

  const sortedNotes = notes.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

  return (
    <>
      <HeroSection projects={serializableProjects} />

      <RecentProjects projects={serializableProjects} />

      <Container className="mt-56">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono font-semibold text-indigo-500 text-sm uppercase tracking-widest max-2xl:mb-4 dark:text-indigo-400">
              Blog
            </p>
            <h2 className="mt-5 max-w-[40ch] text-pretty text-[2.5rem]/[2.75rem] text-zinc-950 tracking-tight sm:text-[3.5rem]/[3.75rem] dark:text-white">
              Thoughts on the craft.
            </h2>
          </div>
        </div>
        <div className="mt-16 divide-y divide-zinc-100 dark:divide-zinc-800">
          {recentPosts.map((post) => (
            <BlogPostRow key={post.slug} meta={post.meta} slug={post.slug} basePath="/blog" />
          ))}
        </div>
        <Button href="/blog" className="mt-12" data-track="blog-section-view-more">
          View more <ChevronRightIcon className="-mr-1!" />
        </Button>
      </Container>

      <Container className="mt-56 mb-24">
        <h2 className="font-mono font-semibold text-sky-500 text-sm uppercase tracking-widest max-2xl:mb-4 dark:text-sky-400">
          Software development
        </h2>
        <p className="mt-6 max-w-[40ch] text-pretty text-[2.5rem]/[2.75rem] tracking-tight sm:text-[3.5rem]/[3.75rem]">
          <strong className="font-normal text-zinc-950 dark:text-white">High-quality software experiences</strong>{' '}
          <span className="text-zinc-500 dark:text-zinc-400">
            built with modern technologies and a focus on both design and functionality.
          </span>
        </p>
      </Container>

      <div className="absolute inset-x-0 z-10 h-px bg-zinc-950/10 dark:bg-white/10" />
      <Container className="relative aspect-16/10">
        <div className="absolute -inset-y-12 z-10 w-px bg-zinc-950/10 dark:bg-white/10" />
        <MiniEditor />
        <div className="absolute -inset-y-12 right-6 z-10 w-px bg-zinc-950/10 lg:right-8 dark:bg-white/10" />
      </Container>
      <div className="absolute inset-x-0 z-10 h-px bg-zinc-950/10 dark:bg-white/10" />

      <Container className="mt-56">
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedNotes.map((note) => (
            <div key={note.slug} className="rounded-3xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-950/8 dark:bg-zinc-900">
                  <Logo className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-sm text-zinc-950 dark:text-white">Jasper Gorchov</p>
                  <p className="font-mono text-xs/5 text-zinc-500 uppercase tracking-widest">
                    {timeAgo(note.meta.date)}
                  </p>
                </div>
              </div>
              <div className="prose prose-blog mt-4 max-w-none">
                <note.Component />
              </div>
              {note.meta.image ? (
                <div className="not-prose relative mt-6 overflow-hidden rounded-lg">
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-lg ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />
                  <ThemeImage
                    unoptimized
                    src={note.meta.image.src}
                    width={note.meta.image.width!}
                    height={note.meta.image.height!}
                    alt=""
                    className="aspect-auto h-auto w-full"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 w-fit">
          <Button outline href="/projects" data-track="notes-section-view-more">
            View more <ChevronRightIcon className="-mr-1!" />
          </Button>
        </div>
      </Container>

      <Container className="mt-56">
        <h2 className="font-mono font-semibold text-amber-500 text-sm uppercase tracking-widest max-2xl:mb-4 dark:text-amber-400">
          3D Art
        </h2>
        <p className="mt-6 max-w-[40ch] text-pretty text-[2.5rem]/[2.75rem] tracking-tight sm:text-[3.5rem]/[3.75rem]">
          <strong className="font-normal text-zinc-950 dark:text-white">3D renders and motion design</strong>{' '}
          <span className="text-zinc-500 dark:text-zinc-400">
            crafted in Blender, and interactive pieces brought to the web with Three.js.
          </span>
        </p>

        <TextureLab className="mt-24" />
      </Container>

      <Container className="mt-56">
        <NewsletterSection>
          <p className="font-mono font-semibold text-rose-500 text-sm uppercase tracking-widest max-2xl:mb-4 dark:text-rose-400">
            Newsletter
          </p>
          <p className="mt-6 max-w-2xl text-pretty text-[2.5rem]/[2.75rem] tracking-tight sm:text-[3.5rem]/[3.75rem]">
            <strong className="font-normal text-zinc-950 dark:text-white">
              Get notified when I publish something new.
            </strong>
          </p>
        </NewsletterSection>
      </Container>
    </>
  )
}
