import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { MDXComponents } from '@/components/MDXComponents'
import { Projects } from '@/components/Projects'
import { PageIntro } from '@/components/PageIntro'
import { TagList, TagListItem } from '@/components/TagList'
import { loadMDXMetadata } from '@/lib/loadMDXMetadata'

export default async function ProjectLayout({ children, _segments }) {
  let id = _segments.at(-2)
  let allProjects = await loadMDXMetadata('work')
  let project = allProjects.find((project) => project.id === id)
  let moreProjects = allProjects
    .filter((project) => project.id !== id)
    .slice(0, 2)

  return (
    <>
      <article className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <header>
            <PageIntro
              fadeIn={false}
              eyebrow="Project"
              title={project.title}
              centered
            >
              <p>{project.description}</p>
              <div className="mt-16">
                <Container>
                  <TagList className="mx-auto flex max-w-5xl items-center justify-center">
                    <TagListItem>
                      <time dateTime={project.date.split('-')[0]}>
                        {project.date.split('-')[0]}
                      </time>
                    </TagListItem>
                    <TagListItem>{project.service}</TagListItem>
                  </TagList>
                </Container>
              </div>
            </PageIntro>
          </header>

          <Container className="mt-24 sm:mt-32 lg:mt-40">
            <MDXComponents.wrapper>{children}</MDXComponents.wrapper>
          </Container>
        </FadeIn>
      </article>

      {moreProjects.length > 0 && (
        <Projects
          className="mt-24 bg-gradient-to-b from-neutral-912 pt-24 sm:mt-32 sm:pt-32 lg:mt-40"
          title="More projects"
          images={false}
          projects={moreProjects}
        />
      )}

      <ContactSection />
    </>
  )
}
