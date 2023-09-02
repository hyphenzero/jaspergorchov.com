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
        <p>
          Discover my creative experiments — projects created to explore new
          ideas and techniques.
        </p>
      </PageIntro>

      <Projects projects={experiments} className="sm:pt-26 pt-16" />
    </>
  )
}
