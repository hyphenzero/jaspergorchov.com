import { PageIntro } from '@/components/PageIntro'
import { Projects } from '@/components/Projects'
import { loadMDXMetadata } from '@/lib/loadMDXMetadata'

export const metadata = {
  title: 'Playground',
  description:
    'Discover my creative experiments — projects created to explore new ideas and techniques.',
}

export default async function Playground() {
  let experiments = await loadMDXMetadata('playground')

  return (
    <>
			<PageIntro eyebrow="Playground" title="Exploring new ideas">
				Discover my creative experiments — projects created to explore new ideas and techniques.
			</PageIntro>

      <Projects projects={experiments} className="pt-16 sm:pt-26" />
    </>
  )
}
