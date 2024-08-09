import { Container } from '@/components/container'
import { FadeIn, FadeInStagger } from '@/components/fade-in'
import { Input, InputGroup } from '@/components/input'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox'
import { PageIntro } from '@/components/page-intro'
import { loadWork } from '@/lib/mdx'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { type Metadata } from 'next'
import Image from 'next/image'
import { ProjectsGrid } from './projects-grid'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Projects I’ve been working on.',
}

export default async function Work({ params }: { params: URLSearchParams }) {
  let projects = await loadWork()
	const uniqueTags = new Set(projects.reduce((acc, project) => [...acc, ...project.tags], [] as string[]))

  return (
    <>
      <PageIntro eyebrow="Work" title="Projects I’ve been working on.">
        <p className="">
          I create web-based apps and sites, 3D art, animations, graphic design work, and web-powered 3D experiences.
          Here you can find a repository of all my work.
        </p>
      </PageIntro>

      <Container className="">
        <ProjectsGrid projects={projects} />
      </Container>
    </>
  )
}
