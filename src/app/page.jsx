import Image from 'next/image'

import {
  CubeIcon,
  GlobeAltIcon,
  RectangleStackIcon,
  WindowIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeIn, FadeInFromSide, FadeInStagger } from '@/components/FadeIn'
import { Projects } from '@/components/Projects'
import { Section } from '@/components/Section'
import { StyledLink } from '@/components/StyledLink'
import { TagListItem } from '@/components/TagList'
import image1 from '@/images/image1.webp'
import image2 from '@/images/image1.webp'
import image3 from '@/images/image1.webp'
import image4 from '@/images/image1.webp'
import image5 from '@/images/image1.webp'
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
        <div className="h-px flex-auto bg-zinc-800/50" />
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
            <p className="text-lg text-zinc-400 [text-wrap:balance] sm:text-xl">
              Since I taught myself to code at age 10, I have been creating
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

function ImageShowcase() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 overflow-x-clip bg-gradient-to-b from-primary to-secondary sm:mt-20">
      <div className="flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-800 transition-transform duration-300 hover:rotate-0 hover:scale-110 sm:w-72 sm:rounded-2xl',
              rotations[imageIndex % rotations.length],
            )}
          >
            <Image
              src={image}
              alt=""
              unoptimized
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function NewSection() {
  return (
    <section className="h-screen w-screen bg-secondary p-6 sm:p-8">
      <div className="relative flex h-full w-full items-center justify-center rounded-md border border-zinc-800">
        <h1 className="px-6 text-center font-display text-3xl font-medium italic tracking-tight text-white [text-wrap:balance] sm:text-5xl">
          Creating stunning digital worlds
          <br className="max-sm:hidden" /> and experiences
        </h1>
        <div className="absolute inset-x-0 bottom-0 flex w-full items-center justify-between border-t border-zinc-800 p-2 text-sm text-zinc-600">
          <p>com.jaspergorchov</p>
          <p>(UTC -08:00)</p>
        </div>
      </div>
    </section>
  )
}

function Software() {
  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="relative pl-7 lg:max-w-lg">
              <div className="absolute -top-20 left-[calc(0.35rem)] h-48 w-px bg-gradient-to-b from-transparent via-white/20 group-first:top-3" />
              <div className="absolute left-0 top-2 h-3 w-3 rounded-full border border-sky-300 bg-zinc-950" />

              <FadeInFromSide>
                <span className="text-sm font-semibold uppercase leading-7 tracking-wide text-sky-300">
                  01
                </span>
              </FadeInFromSide>
              <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Websites and web apps
              </h3>
              <p className="mt-6 text-base text-zinc-400">
                Using the latest professional tools and frameworks, I create
              </p>
            </div>
          </div>
          <FadeIn className="relative aspect-square w-full">
            <Image src="" alt="Product screenshot" className="" fill />
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

function Art() {
  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="relative pl-7 lg:max-w-lg">
              <div className="absolute -top-20 left-[calc(0.35rem)] h-48 w-px bg-gradient-to-b from-transparent via-white/20 group-first:top-3" />
              <div className="absolute left-0 top-2 h-3 w-3 rounded-full border border-sky-300 bg-zinc-950" />

              <FadeInFromSide>
                <span className="text-sm font-semibold uppercase leading-7 tracking-wide text-sky-300">
                  02
                </span>
              </FadeInFromSide>
              <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                A better workflow
              </h3>
              <p className="mt-6 text-base text-zinc-400">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Maiores impedit perferendis suscipit eaque, iste dolor
                cupiditate blanditiis ratione.
              </p>
            </div>
          </div>
          <FadeIn className="flex items-start justify-end lg:order-first">
            <div className="relative aspect-square w-full">
              <Image src="" alt="Product screenshot" className="" fill />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

function Experiences() {
  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="relative pl-7 lg:max-w-lg">
              <div className="absolute -top-20 left-[calc(0.35rem)] h-48 w-px bg-gradient-to-b from-transparent via-white/20 group-first:top-3" />
              <div className="absolute left-0 top-2 h-3 w-3 rounded-full border border-sky-300 bg-zinc-950" />

              <FadeInFromSide>
                <span className="text-sm font-semibold uppercase leading-7 tracking-wide text-sky-300">
                  03
                </span>
              </FadeInFromSide>
              <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                A better workflow
              </h3>
              <p className="mt-6 text-base text-zinc-400">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Maiores impedit perferendis suscipit eaque, iste dolor
                cupiditate blanditiis ratione.
              </p>
            </div>
          </div>
          <FadeIn className="relative aspect-square w-full">
            <Image src="" alt="Product screenshot" className="" fill />
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  description: `I’m Jasper Gorchov, a 13-year-old developer creating immersive web-based apps and vibrant 3D illustrations.`,
}

export default async function Home({ social }) {
  let projects = (await loadMDXMetadata('work')).slice(0, 3)

  return (
    <>
      <Container className="py-32 md:py-56">
        <FadeInStagger className="sm:mx-auto sm:text-center">
          <FadeIn>
            <h1 className="font-display text-5xl font-medium tracking-tight text-white [text-wrap:balance] sm:text-7xl">
              Full-Stack Developer <br className="max-sm:hidden" />& 3D Designer
            </h1>
          </FadeIn>
          <FadeIn>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-400">
              I’m <span className="text-white">Jasper Gorchov</span>, a
              13-year-old developer creating immersive web-based apps and
              vibrant 3D illustrations.
            </p>
          </FadeIn>
          <FadeIn>
            <div className="mt-8 w-full items-center sm:flex sm:justify-center">
              <Button arrow href="/work">
                Browse work
              </Button>
            </div>
          </FadeIn>
        </FadeInStagger>
      </Container>

      <ImageShowcase />

      <NewSection />

      <Projects projects={projects} featured className="py-24 sm:py-32" />

      <Software />

      <Art />

      <Experiences />
    </>
  )
}
