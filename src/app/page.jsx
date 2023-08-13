import Link from 'next/link'
import Image from 'next/image'

import clsx from 'clsx'
import { PlayIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  CubeIcon,
  GlobeAltIcon,
  RectangleStackIcon,
  WindowIcon,
} from '@heroicons/react/24/outline'

import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { Tag } from '@/components/Tags'
import { LargeText } from '@/components/LargeText'
import { Button } from '@/components/Button'
import { SpinOnScroll } from '@/components/SpinOnScroll'
import { ProjectsGrid, Project } from '@/components/ProjectsGrid'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { ContactSection } from '@/components/ContactSection'
import imageDashedRings from '@/images/dashed-rings.webp'
import imageTorusKnot from '@/images/torus-knot.webp'

const services = [
  {
    name: 'UI/UX',
    icon: WindowIcon,
  },
  {
    name: '3D',
    icon: CubeIcon,
  },
  {
    name: 'Web Design',
    icon: GlobeAltIcon,
  },
  {
    name: 'AR/VR',
    icon: RectangleStackIcon,
  },
]

const projects = [
  {
    id: '1',
    href: '/work/',
    title: 'Client 1',
    date: 'March 2023',
    description: 'Project description 1',
    medium: '3D Design',
    image: null,
  },
  {
    id: '2',
    href: '/work/',
    title: 'Client 2',
    date: 'April 2023',
    description: 'Project description 2',
    medium: '3D Design',
    image: null,
  },
  {
    id: '3',
    href: '/work/',
    title: 'Client 3',
    date: 'June 2023',
    description: 'Project description 3',
    medium: '3D Design',
    image: null,
  },
  {
    id: '4',
    href: '/work/',
    title: 'Client 4',
    date: 'July 2023',
    description: 'Project description 4',
    medium: '3D Design',
    image: null,
  },
  {
    id: '5',
    href: '/work/',
    title: 'Client 5',
    date: 'July 2023',
    description: 'Project description 5',
    medium: '3D Design',
    image: null,
  },
  {
    id: '6',
    href: '/work/',
    title: 'Client 6',
    date: 'July 2023',
    description: 'Project description 6',
    medium: '3D Design',
    image: null,
  },
]

function Services() {
  return (
    <Section className="mt-32">
      <FadeIn className="flex items-center gap-x-8">
        <h2 className="font-display text-sm font-semibold tracking-wider text-white">
          A wide range of possibilities
        </h2>
        <div className="h-px flex-auto bg-neutral-800/50" />
      </FadeIn>
      <FadeInStagger faster>
        <ul
          role="list"
          className="relative mt-10 grid grid-cols-2 gap-10 sm:grid-cols-2"
        >
          {services.map((service) => (
            <li key={service.name}>
              <FadeIn className="flex items-center">
                <Tag>{service.name}</Tag>
              </FadeIn>
            </li>
          ))}
        </ul>
      </FadeInStagger>
    </Section>
  )
}

export const metadata = {
  description:
    'I’m Jasper Gorchov, and I craft immersive web-based apps and beautiful 3D illustrations.',
}

export default function Home({ social }) {
  return (
    <>
      <Container className="mt-24 py-32 sm:py-48 lg:py-56">
        <FadeIn className="max-w-2xl sm:mx-auto sm:text-center">
          <h1 className="font-display text-5xl font-medium tracking-tight text-white [text-wrap:balance] sm:text-7xl">
            Software Developer <br className="max-sm:hidden" />& 3D Designer
          </h1>
          <p className="mt-6 text-xl text-neutral-400">
            I’m Jasper Gorchov, and I craft immersive web-based apps and
            aesthetic 3D illustrations.{' '}
            <span className="max-sm:hidden">
              I harness the combination of these powerful mediums to create the
              future of digital interations and experiences.
            </span>
          </p>
          <div className="mt-8 w-full items-center sm:flex sm:justify-center">
            {/* <Link href="https://youtube.com/watch/" className="rounded-full">
							<Button className="shadow-neutral-950 sm:w-fit">
								Browse work
							</Button>
						</Link> */}
            <Button
              href="/work"
              // leadingIcon={<PlayIcon className="text-neutral-500 group-hover:text-neutral-300 transition-colors duration-200" />}
            >
              Browse work
            </Button>
          </div>

          {/* <ArrowDownIcon className="mt-8 w-5 h-5 text-neutral-700 mx-auto" /> */}
        </FadeIn>
      </Container>

      <Services />

      <div aria-hidden={true} className="flex w-full justify-center">
        <div className="relative flex w-full max-w-3xl items-center justify-center py-20 max-sm:scale-150 max-sm:py-48">
          <Image src={imageDashedRings} alt="" className="w-full" />
          <FadeIn className="absolute">
            <h2 className="font-display text-[40vw] font-bold text-white lg:text-[20rem]">
              3D<span className="absolute">.</span>
            </h2>
          </FadeIn>
          <SpinOnScroll className="absolute w-full">
            <Image src={imageTorusKnot} alt="" />
          </SpinOnScroll>
        </div>
      </div>

      <LargeText text="I create stunning web-based apps, sites, and experiences that immerse users in another dimension." />

      <ProjectsGrid title="Featured Projects" moreButton moreButtonHref="/work">
        {projects.map((project) => (
          <Project
            key={project.id}
            client={project.title}
            description={project.description}
            href={project.href}
          />
        ))}
      </ProjectsGrid>

      <ContactSection social={social} />
    </>
  )
}
