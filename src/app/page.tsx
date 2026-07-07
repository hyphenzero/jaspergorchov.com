import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { BlogPostRow } from '@/app/blog/blog-post-row'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { HeroSection } from '@/components/home/hero-section'
import { RecentProjects } from '@/components/home/recent-projects'
import { TextureLab } from '@/components/home/texture-lab-client'
import { MiniEditor } from '@/components/mini-editor/mini-editor'
import { NewsletterSection } from '@/components/newsletter-section'
import { NoteCard } from '@/components/note-card'
import { SectionDescription, SectionDescriptionLead, SectionEyebrow, SectionHeading } from '@/components/home/section-heading'
import { getAllBlogPosts, getAllNotes, getAllProjects } from '@/lib/api'

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
        <SectionEyebrow color="violet">Blog</SectionEyebrow>
        <SectionHeading>Thoughts on the craft.</SectionHeading>
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
        <SectionEyebrow color="sky">Software development</SectionEyebrow>
        <SectionDescription>
          <SectionDescriptionLead>High-quality software experiences</SectionDescriptionLead> built with modern technologies and a focus on both design and functionality.
        </SectionDescription>
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
            <NoteCard key={note.slug} meta={note.meta}>
              <note.Component />
            </NoteCard>
          ))}
        </div>

        <div className="mx-auto mt-12 w-fit">
          <Button outline href="/projects" data-track="notes-section-view-more">
            View more <ChevronRightIcon className="-mr-1!" />
          </Button>
        </div>
      </Container>

      <Container className="mt-56">
        <SectionEyebrow color="orange">3D Art</SectionEyebrow>
        <SectionDescription>
          <SectionDescriptionLead>3D renders and motion design</SectionDescriptionLead> crafted in Blender, and interactive pieces brought to the web with Three.js.
        </SectionDescription>

        <TextureLab className="mt-24" />
      </Container>

      <Container className="mt-56">
        <NewsletterSection>
          <SectionEyebrow color="pink">Newsletter</SectionEyebrow>
          <SectionHeading className="max-w-2xl!">Get notified when I publish something new.</SectionHeading>
        </NewsletterSection>
      </Container>
    </>
  )
}
