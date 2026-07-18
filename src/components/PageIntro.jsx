import clsx from 'clsx'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'

export function PageIntro({
  fadeIn = true,
  eyebrow,
  title,
  children,
  centered = false,
}) {
  const pageIntroContent = (
    <>
      <h1>
        <span className="block font-display text-base font-semibold text-white">
          {eyebrow}
        </span>
        <span className="sr-only"> - </span>
        <span
          className={clsx(
            'mt-6 block max-w-5xl font-display text-5xl font-medium tracking-tight text-white [text-wrap:balance] sm:text-6xl',
            centered && 'mx-auto',
          )}
        >
          {title}
        </span>
      </h1>
      <div
        className={clsx(
          'mt-6 max-w-3xl text-xl text-zinc-400',
          centered && 'mx-auto',
        )}
      >
        {children}
      </div>
    </>
  )

  return (
    <Container
      className={clsx('mt-24 sm:mt-32 lg:mt-40', centered && 'text-center')}
    >
      {fadeIn ? <FadeIn>{pageIntroContent}</FadeIn> : pageIntroContent}
    </Container>
  )
}
