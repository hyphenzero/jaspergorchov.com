'use client'

import { useRef } from 'react'

import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'

import { Section } from './Section'
import { FadeIn } from './FadeIn'

export function LargeText({ text, className, overlay = false, ...props }) {
  return (
    <Section
      className={clsx('flex items-center justify-center', className)}
      {...props}
    >
      <div className="relative mx-auto w-fit max-w-5xl py-16 max-sm:px-2 sm:py-32">
        <FadeIn className="text-center font-display text-4xl font-light tracking-tight text-white [text-wrap:balance] sm:text-6xl">
          {text}
        </FadeIn>
      </div>
    </Section>
  )
}
