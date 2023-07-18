import clsx from 'clsx'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'

export function PageIntro({ eyebrow, title, children, centered = false }) {
  return (
    <Container
      className={clsx('mt-24 sm:mt-32 lg:mt-40', centered && 'text-center')}
    >
      <FadeIn>
        <h1>
          <span className="block font-display text-base font-semibold text-neutral-300">
            {eyebrow}
          </span>
          <span className="sr-only"> - </span>
          <span
            className={clsx(
              'mt-6 block font-display text-5xl/[3.5rem] font-medium tracking-tight text-neutral-100 [text-wrap:balance] sm:text-5xl/[3.5rem]',
              centered && 'mx-auto'
            )}
          >
            {title}
          </span>
        </h1>
        <div
          className={clsx(
            'mt-6 max-w-3xl text-lg/8 text-neutral-400',
            centered && 'mx-auto'
          )}
        >
          {children}
        </div>
      </FadeIn>
    </Container>
  )
}
