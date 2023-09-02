import { PageIntro } from '@/components/PageIntro'
import { Projects } from '@/components/Projects'
import { loadMDXMetadata } from '@/lib/loadMDXMetadata'

export const metadata = {
  title: 'Work',
  description:
    'Explore my creative endeavors — meticulously crafted to transform ideas into tangible works.',
}

export default async function Work() {
  let projects = await loadMDXMetadata('work')

  return (
    <>
      <PageIntro eyebrow="Work" title="Crafting experiences">
        <p>
          Explore my creative endeavors — meticulously crafted to transform
          ideas into tangible works.
        </p>
      </PageIntro>

      <Projects projects={projects} className="sm:pt-26 pt-16" />
    </>
  )
}
