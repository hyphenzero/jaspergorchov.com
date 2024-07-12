import { PageIntro } from '@/components/page-intro'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'We believe in efficiency and maximizing our resources to provide the best value to our clients.',
}

export default function About() {
  return (
    <>
      <PageIntro eyebrow="About" title="Web developer and digital creative since age 9.">
        <p className="pb-[96rem]">
          I create web-based apps and sites, 3D art, animations, graphic design work, and web-powered 3D experiences.
          Here you can find a repository of all my work.
        </p>
      </PageIntro>
    </>
  )
}
