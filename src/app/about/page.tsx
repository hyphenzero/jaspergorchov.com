import { Container } from '@/components/container'

export default function About() {
  return (
    <>
      <Container className="relative mt-12 xl:mt-24">
        <h1 className="text-5xl font-medium tracking-tight text-balance lg:text-6xl">Programming since age 9.</h1>
        <p className="mt-6 text-lg/8 text-pretty text-zinc-700 dark:text-zinc-300">
          Browse my programming, design, and 3D art projects.
        </p>
      </Container>
    </>
  )
}
