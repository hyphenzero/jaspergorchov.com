'use client'

import { FadeIn, FadeInStagger } from '@/components/fade-in'
import { Input, InputGroup } from '@/components/input'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox'
import { Tag } from '@/components/tag'
import { Text } from '@/components/text'
import { Project } from '@/lib/mdx'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tagFromURL = searchParams.get('tag') ?? 'all'

	const [selectedTag, setSelectedTag] = useState(tagFromURL)
	
  // Collect unique tags from projects for filtering options
  const uniqueTags = new Set(projects.reduce((acc, project) => [...acc, ...project.tags], [] as string[]))

	const filterProjectsByTag = (projects: Project[], tag: string): Project[] => {
    // Filter projects by tag, or return all projects if 'all' is selected
    return tag === 'all' ? projects : projects.filter((project) => project.tags.includes(decodeURIComponent(tag)))
  }

  const [filteredProjects, setFilteredProjects] = useState(() => filterProjectsByTag(projects, tagFromURL))

  useEffect(() => {
    const newFilteredProjects = filterProjectsByTag(projects, tagFromURL)

    setFilteredProjects(newFilteredProjects)
  }, [projects, tagFromURL])

  useEffect(() => {
    if (selectedTag !== 'all') {
      router.push(`${pathname}?tag=${encodeURIComponent(selectedTag)}`)
    } else {
      router.push(pathname)
    }
  }, [selectedTag, router])

  return (
    <>
      <FadeIn wait={1} className="flex w-full gap-4">
        <div className="w-full">
          <InputGroup>
            <MagnifyingGlassIcon />
            <Input className="flex-1" name="search" placeholder="Search projects&hellip;" aria-label="Search" />
          </InputGroup>
        </div>

        <Listbox className="max-w-56" name="status" value={selectedTag} onChange={setSelectedTag}>
          <ListboxOption value="all">
            <ListboxLabel>All projects</ListboxLabel>
          </ListboxOption>
          {Array.from(uniqueTags).map((tag) => (
            <ListboxOption key={tag} value={tag}>
              <ListboxLabel>{tag}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
      </FadeIn>

      <FadeIn wait={3} className="mt-12 grid min-h-96 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project.date}>
            <div className="relative isolate aspect-[16/10] overflow-clip rounded-2xl">
              <div className="absolute inset-0 z-10 rounded-2xl ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              <Image
                alt=""
                src={project.cover}
                fill
                unoptimized
                className="aspect-video w-full object-cover object-top"
              />
            </div>
            <h3 className="mt-5 text-base font-medium text-zinc-950 lg:pt-0 dark:text-white">{project.title}</h3>
            <Text className="mt-2 line-clamp-2">{project.description}</Text>
            <div className="mt-3 flex gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        ))}
      </FadeIn>
    </>
  )
}
