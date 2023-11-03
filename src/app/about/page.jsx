import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { StyledLink } from '@/components/StyledLink'
import { loadMDXMetadata } from '@/lib/loadMDXMetadata'

let numberOfProjects = (await loadMDXMetadata('work')).length

let numberOfExperiments = (await loadMDXMetadata('playground')).length

const yearsOfExperience = new Date().getFullYear() - 2021

function Stats() {
  return (
    <Container className="pt-30 pb-10 sm:pb-12 sm:pt-36">
      <FadeInStagger>
        <dl className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none">
          {[
            ['Projects', numberOfProjects],
            ['Experiments', numberOfExperiments],
            ['Years of experience', yearsOfExperience],
          ].map(([label, value]) => (
            <FadeIn
              key={label}
              className="flex flex-col-reverse border-l border-zinc-800 pl-8"
            >
              <dt className="mt-2 text-base text-zinc-400">{label}</dt>
              <dd className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {value}
              </dd>
            </FadeIn>
          ))}
        </dl>
      </FadeInStagger>
    </Container>
  )
}

export const metadata = {
  title: 'About',
  description:
    'We believe in efficiency and maximizing our resources to provide the best value to our clients.',
}

export default function About() {
  return (
    <>
      <PageIntro eyebrow="About" title="Hi, I’m Jasper">
        <p>
					I’m Jasper Gorchov, a 13-year-old developer creating immersive web-based apps and vibrant 3D illustrations. I combine these mediums to shape the future of digital interactions and experiences.
        </p>
        <div className="mt-10 max-w-2xl space-y-6 text-base">
          <p>
            I started creating websites when I learned HTML with an{' '}
            <StyledLink href="https://mimo.org">app</StyledLink> on my iPad at
            age 9. When I first downloaded VScode on my Mac, I was introduced to
            a world of creative computing as I began to learn about tools like{' '}
            <StyledLink href="https://tailwindcss.com">Tailwind CSS</StyledLink>
            . <StyledLink href="https://adamwathan.me">Adam Wathan</StyledLink>{' '}
            and the Tailwind team have always been a big inspiration for me. In
            2021 when I was 11, I decided to start learning React and{' '}
            <StyledLink href="https://nextjs.org">Next.js</StyledLink>, because
            I knew it would take me to the next level. Now, I create web-based
            apps, sites, and experiences that are meticulously crafted to
            transform ideas into tangible works.
          </p>
        </div>
      </PageIntro>

      <Stats />

      <ContactSection />
    </>
  )
}
