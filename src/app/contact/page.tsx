import { Card } from '@/components/card'
import { Container } from '@/components/container'
import { PageIntro } from '@/components/page-intro'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description: 'We believe in efficiency and maximizing our resources to provide the best value to our clients.',
}

export default function Work() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Ask me anything!">
        <p className="">
          I create web-based apps and sites, 3D art, animations, and graphic design work. Here you can find a repository
          of all my work.
        </p>
      </PageIntro>

      <Container>
        <div className="min-h-96 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card></Card>
          <Card></Card>
          <Card></Card>
        </div>
      </Container>
    </>
  )
}
