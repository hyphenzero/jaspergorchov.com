import clsx from 'clsx'

import { FadeIn, FadeInStagger } from '@/components/fade-in'
import { Container } from './container'

export function PageIntro({
  eyebrow,
  title,
  children,
  centered = false,
}: {
  eyebrow?: string
  title: string
  children?: React.ReactNode
  centered?: boolean
}) {
  return (
    <>
      <Container as={FadeInStagger} className={clsx('px-6 py-16 lg:px-8 lg:py-24', centered && 'text-center')}>
        <h1>
          <FadeIn>
            <span className="block font-mono text-sm/5 font-semibold uppercase tracking-widest text-sky-500 dark:text-sky-400">
              {eyebrow}
            </span>
          </FadeIn>
          <span className="sr-only"> - </span>
          <FadeIn>
            <span
              className={clsx(
                'mt-5 block max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-[length:clamp(2rem,3.75vw,3rem)] dark:text-white',
                centered && 'mx-auto'
              )}
            >
              {title}
            </span>
          </FadeIn>
        </h1>
        <FadeIn>
          <div className={clsx('*:text-balance mt-6 max-w-3xl text-lg/8 text-zinc-500 dark:text-zinc-400', centered && 'mx-auto')}>
            {children}
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
