import {
  CubeIcon,
  GlobeAltIcon,
  RectangleStackIcon,
  WindowIcon,
} from '@heroicons/react/24/outline'

import { Button } from '@/components/Button'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { Embed3D } from '@/components/Embed3D'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { Projects } from '@/components/Projects'
import { Section } from '@/components/Section'
import { TagListItem } from '@/components/TagList'
import { TextSection } from '@/components/TextSection'
import { Window } from '@/components/Window'
import { loadMDXMetadata } from '@/lib/loadMDXMetadata'

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

function Services() {
  return (
    <Section className="py-24 sm:py-32">
      <FadeIn className="flex items-center gap-x-8">
        <h2 className="font-display text-sm font-semibold tracking-wider text-white">
          A wide range of possibilities
        </h2>
        <div className="h-px flex-auto bg-neutral-800/50" />
      </FadeIn>
      <FadeInStagger faster>
        <ul
          role="list"
          className="relative mt-10 grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-10"
        >
          {services.map((service) => (
            <li key={service.name}>
              <FadeIn className="flex items-center">
                <TagListItem as="div">{service.name}</TagListItem>
              </FadeIn>
            </li>
          ))}
        </ul>
      </FadeInStagger>
    </Section>
  )
}

function Demo() {
  return (
    <Section>
      <Window fadeIn>
        <Embed3D
          scene="https://prod.spline.design/QCe-iZKiwWvj9Zex/scene.splinecode"
          className="mt-3 sm:mt-5"
        />
      </Window>
    </Section>
  )
}

export const metadata = {
  description:
    'I’m Jasper Gorchov, and I craft immersive web-based apps and beautiful 3D illustrations.',
}

export default async function Home({ social }) {
  let projects = (await loadMDXMetadata('work')).slice(0, 3)

  return (
    <>
      <Container className="py-24 sm:py-32 md:py-56">
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
            <Button href="/work">Browse work</Button>
          </div>
        </FadeIn>
      </Container>

      <Services />

      <TextSection
        className="py-32"
        title="Building digital experiences"
        text="I create stunning web-based apps, sites, and experiences that immerse users in the future of 3D. I deeply incorporate 3D content into my designs, seamlessly blending virtual and real elements to elevate user engagement and create unforgettable interactions."
      />

      <Demo />

      <Projects projects={projects} featured className="py-24 sm:py-32" />

      <ContactSection social={social} />
    </>
  )
}
