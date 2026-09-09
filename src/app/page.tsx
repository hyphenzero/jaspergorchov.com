import { BlogPostRow } from '@/app/blog/blog-post-row'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { HeroSection } from '@/components/home/hero-section'
import { RecentProjects } from '@/components/home/recent-projects'
import {
  SectionDescription,
  SectionDescriptionLead,
  SectionEyebrow,
  SectionHeading,
} from '@/components/home/section-heading'
import { SoftwareUiGrid } from '@/components/home/software-ui-grid'
import { ThreeDArtGrid } from '@/components/home/three-d-art-grid'
import { NewsletterSection } from '@/components/newsletter-section'
import { NoteCard } from '@/components/note-card'
import { getAllBlogPosts, getAllNotes, getAllProjects } from '@/lib/api'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

export default async function Home() {
  const projects = await getAllProjects()
  const blogPosts = await getAllBlogPosts()
  const notes = await getAllNotes()

  const serializableProjects = projects.map(({ Component: _Omitted, ...rest }) => {
    // Component is intentionally stripped: it isn't serializable to the client.
    void _Omitted
    return rest
  })

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
        <SectionEyebrow color="zinc">Blog</SectionEyebrow>
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

      <div className="not-dark:bg-linear-to-b not-dark:via-zinc-100 mt-28">
        <Container className="pt-28">
          <SectionEyebrow color="sky">Software development</SectionEyebrow>
          <SectionDescription>
            <SectionDescriptionLead>Websites, native apps, and developer tools,</SectionDescriptionLead> built with focus on the
            details that make them work well and feel right.
          </SectionDescription>

          <div className="mt-12">
            <SoftwareUiGrid />
          </div>
        </Container>

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

        <section className="relative mt-56 pb-28">
          <Container>
            <SectionEyebrow color="orange">3D Art</SectionEyebrow>
            <SectionDescription>
              <SectionDescriptionLead>3D renders and motion design</SectionDescriptionLead> crafted in Blender, and
              interactive pieces brought to the web with Three.js.
            </SectionDescription>

            <div className="mt-12">
              <ThreeDArtGrid />
            </div>
          </Container>
        </section>
      </div>

      <Container className="mt-40">
        <NewsletterSection>
          <SectionEyebrow color="rose">Newsletter</SectionEyebrow>
          <SectionHeading className="max-w-2xl!">Get notified when I publish something new.</SectionHeading>
        </NewsletterSection>
      </Container>
    </>
  )
}
