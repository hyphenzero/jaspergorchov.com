import { PageIntro } from '@/components/PageIntro'

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
    </>
  )
}
