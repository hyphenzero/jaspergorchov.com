import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { MDXComponents } from '@/components/MDXComponents'
import { Projects } from '@/components/Projects'
import { PageIntro } from '@/components/PageIntro'
import { TagList, TagListItem } from '@/components/TagList'
import { loadMDXMetadata } from '@/lib/loadMDXMetadata'

export default async function ExperimentLayout({ children, _segments }) {
  let id = _segments.at(-2)
  let allExperiments = await loadMDXMetadata('playground')
  let experiment = allExperiments.find((experiment) => experiment.id === id)
  let moreExperiments = allExperiments
    .filter((experiment) => experiment.id !== id)
    .slice(0, 2)

  return (
    <>
			<article className="mt-24 sm:mt-32 lg:mt-40">
				<FadeIn>
					<header>
						<PageIntro fadeIn={false} eyebrow="Experiment" title={experiment.title} centered>
							<p>{experiment.description}</p>
							<div className="mt-16">
								<Container>
									<TagList className="mx-auto flex justify-center items-center max-w-5xl">
									<TagListItem>
											<time dateTime={experiment.date.split('-')[0]}>
												{experiment.date.split('-')[0]}
											</time>
										</TagListItem>
										<TagListItem>{experiment.service}</TagListItem>
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

      {moreExperiments.length > 0 && (
        <Projects
          className="pt-24 sm:pt-32 mt-24 sm:mt-32 lg:mt-40 bg-gradient-to-b from-neutral-912"
					title="More experiments"
					images={false}
          projects={moreExperiments}
        />
      )}

      <ContactSection />
    </>
  )
}
