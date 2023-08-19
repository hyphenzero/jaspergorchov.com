'use client'

import clsx from 'clsx'

import { FadeIn } from './FadeIn'

export function TextSection({ title, text, className, ...props }) {
  return (
    <div
      className={clsx('flex items-center justify-center', className)}
      {...props}
    >
      <div className="relative w-full">
        <FadeIn className="mx-auto flex w-fit max-w-5xl gap-5 px-6 max-sm:flex-col sm:gap-8 sm:px-12">
          <h2 className="w-full font-display text-3xl font-medium text-white [text-wrap:balance] sm:text-right sm:text-4xl">
            {title}
          </h2>
          <span className="sr-only"> - </span>
          <p className="text-lg text-neutral-400 [text-wrap:balance] sm:text-xl">
            {text}
          </p>
        </FadeIn>
      </div>
    </div>
  )
}
