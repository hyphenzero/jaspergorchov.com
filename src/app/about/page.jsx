import { Container } from '@/components/Container'
import { PageIntro } from '@/components/PageIntro'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { ContactSection } from '@/components/ContactSection'
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
						<FadeIn key={label} className="flex flex-col-reverse border-l border-neutral-800 pl-8">
              <dt className="mt-2 text-base text-neutral-400">{label}</dt>
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
          I’m Jasper Gorchov, and I craft immersive web-based apps and aesthetic
          3D illustrations. I harness the combination of these powerful mediums
          to create the future of digital interations and experiences.
        </p>
        <div className="mt-10 max-w-2xl space-y-6 text-base">
          <p>
            I create stunning web-based apps, sites, and experiences that are
            meticulously crafted to transform ideas into tangible works. I
            deeply incorporate 3D content into my designs, seamlessly blending
            virtual and real elements to elevate user engagement and create
            unforgettable interactions.
          </p>
        </div>
      </PageIntro>

      <Stats />

      <ContactSection />
    </>
  )
}
