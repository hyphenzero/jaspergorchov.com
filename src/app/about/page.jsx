import { Container } from '@/components/Container'
import { PageIntro } from '@/components/PageIntro'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'

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
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque
            vitae modi debitis facilis pariatur possimus cumque quas suscipit,
            repudiandae deleniti accusamus quod molestias libero sit ullam
            perspiciatis animi, eligendi labore veniam sunt saepe magnam quos
            ducimus nihil. Eius, quam a nulla eveniet amet velit. Vitae
            voluptatum, est quaerat ipsum obcaecati inventore iusto.
          </p>
        </div>
      </PageIntro>
    </>
  )
}
