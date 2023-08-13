import Link from 'next/link'

import { ChevronLeftIcon } from '@heroicons/react/24/outline'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/Button'

export default function NotFound() {
  return (
    <Container className="flex h-full items-center pb-12 pt-44 sm:pb-32 sm:pt-52 lg:pt-80">
      <FadeIn className="flex flex-col items-center">
        <p className="font-display text-6xl font-semibold text-sky-300 sm:text-8xl">
          404
        </p>
        <h1 className="mt-8 font-display text-2xl font-semibold text-white">
          Page not found
        </h1>
        <p className="mt-2 text-neutral-400">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
        {/* <Link
					href="/"
					className="mt-6 flex items-center text-sm font-semibold text-neutral-400 transition hover:text-sky-300"
				>
					<ArrowLeftIcon className="mb-0.5 mr-1 h-4 w-4" /> Go to the home page
				</Link> */}
        <Button href="/" className="mt-6">
          Go to home page
        </Button>
      </FadeIn>
    </Container>
  )
}
