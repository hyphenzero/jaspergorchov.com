import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/Button'

export default function NotFound() {
  return (
    <Container className="my-24 flex h-full items-center sm:my-32 lg:my-40">
      <FadeIn className="flex flex-col items-center text-center">
        <p className="font-display text-6xl font-semibold tracking-wide text-sky-300 sm:text-8xl">
          404
        </p>
        <h1 className="mt-8 font-display text-2xl font-semibold text-white">
          Page not found
        </h1>
        <p className="mt-2 text-neutral-400">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
        <Button href="/" className="mt-6">
          Back to home
        </Button>
      </FadeIn>
    </Container>
  )
}
