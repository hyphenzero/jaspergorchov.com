'use client'

import Image from 'next/image'
import Link from 'next/link'

import Tilt from 'react-parallax-tilt'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

import { LinkCaret } from './LinkCaret'
import { FadeIn, FadeInStagger } from './FadeIn'
import { Button } from './Button'

export function ProjectsGrid({
  title,
  moreButton = false,
  moreButtonHref,
  children,
}) {
  return (
    <div className="py-24 text-white sm:py-32">
      <h2 className="mb-20 mt-6 text-center font-display text-3xl font-medium sm:text-4xl">
        {title}
      </h2>
      <FadeInStagger faster>
        <ul
          role="list"
          className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8"
        >
          {children}
        </ul>
      </FadeInStagger>
      {moreButton && (
        <div className="mt-20 flex items-center justify-center">
          <Button href={moreButtonHref} className="w-fit items-center">
            See more...
          </Button>
        </div>
      )}
    </div>
  )
}

export function Project({ client, image, href, description }) {
  return (
    <li className="group rounded-3xl border-t-[1.5px] border-transparent bg-neutral-950 transition-colors duration-200">
      <FadeIn className="h-full w-full">
        <Link href={href} className="rounded-3xl">
          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            transitionSpeed={2000}
            glareEnable
            glarePosition="all"
            glareMaxOpacity={0.05}
            scale={1.075}
            className="z-10 overflow-clip rounded-xl"
          >
            <div className="pointer-events-none relative flex aspect-[672/494] items-center justify-center overflow-clip rounded-xl bg-neutral-925 shadow-xl">
              <div className="absolute z-50 h-full w-full rounded-xl border-[1.5px] border-white/5" />
              <Image
                src={image}
                alt=""
                className="object-cover object-center transition-all duration-300"
              />
            </div>
          </Tilt>
          <div className="mt-6 flex flex-wrap items-center">
            <h2 className="flex items-center font-display font-semibold text-white transition-colors duration-200">
              {client}
              <LinkCaret />
            </h2>
            <p className="w-full flex-none text-sm text-neutral-400">
              {description}
            </p>
          </div>
        </Link>
      </FadeIn>
    </li>
  )
}
