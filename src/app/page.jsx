import {
  CubeIcon,
  GlobeAltIcon,
  RectangleStackIcon,
  WindowIcon,
} from '@heroicons/react/24/outline'

import { Button } from '@/components/Button'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { Projects } from '@/components/Projects'
import { Section } from '@/components/Section'
import { ServicesDetail } from '@/components/ServicesDetail'
import { StyledLink } from '@/components/StyledLink'
import { TagListItem } from '@/components/TagList'
import { currentAge } from '@/lib/currentAge'
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
    name: (
      <>
        <span className="max-sm:hidden">Web</span> Development
      </>
    ),
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

function TextSection() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-full">
        <FadeIn className="mx-auto flex max-w-5xl gap-6 px-6 max-sm:flex-col sm:gap-8">
          <h2 className="w-full font-display text-3xl font-medium text-white [text-wrap:balance] sm:text-right sm:text-4xl">
            Building digital experiences
          </h2>
          <span className="sr-only"> - </span>
          <div className="flex flex-col space-y-6">
            <p className="text-lg text-neutral-400 [text-wrap:balance] sm:text-xl">
              Since I taught myself to code at age 9, I have been creating
              web-based apps, sites, and experiences that are meticulously
              crafted to transform ideas into tangible works.
            </p>
            <StyledLink underline={false} arrow href="/about">
              Read more
            </StyledLink>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

export const metadata = {
  description: `I’m Jasper Gorchov, a 13-year-old developer passionate about creating immersive web-based apps and vibrant 3D illustrations.`,
}

export default async function Home({ social }) {
  let projects = (await loadMDXMetadata('work')).slice(0, 3)

  return (
    <>
      <Container className="py-24 sm:py-32 md:py-56">
        <FadeIn className="max-w-2xl sm:mx-auto sm:text-center">
          <h1 className="font-display text-5xl font-medium tracking-tight text-white [text-wrap:balance] sm:text-7xl">
            Full-Stack Developer <br className="max-sm:hidden" />& 3D Designer
          </h1>
          <p className="mt-6 text-xl text-neutral-400">
            I’m Jasper Gorchov, a 13-year-old developer passionate about creating immersive web-based apps and vibrant 3D illustrations.{' '}
            <span className="max-sm:hidden">
              I combine these mediums to shape the future of digital interactions
              and experiences.
            </span>
          </p>
          <div className="mt-8 w-full items-center sm:flex sm:justify-center">
            <Button arrow href="/work">
              Browse work
            </Button>
          </div>
        </FadeIn>
      </Container>

      <Services />

      <TextSection />

      <ServicesDetail />

      <Projects projects={projects} featured className="py-24 sm:py-32" />

      <ContactSection social={social} />
    </>
  )
}
