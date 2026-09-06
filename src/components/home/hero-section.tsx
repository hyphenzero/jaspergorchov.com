'use client'

import { Button } from '@/components/button'
import type { SerializableProject } from '@/types/post'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { JSX, SVGProps, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Hero } from './hero'

const IMAGE_GAP = 26
const HEADER_BOTTOM_PADDING = 13

const socialMedia = [
  {
    name: 'GitHub',
    href: 'https://github.com/hyphenzero',
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" data-slot="icon" viewBox="0 0 24 24" {...props}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: 'NPM',
    href: 'https://www.npmjs.com/~hyphenzero',
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" data-slot="icon" viewBox="0 0 24 24" {...props}>
        <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
      </svg>
    ),
  },
  {
    name: 'Dribbble',
    href: 'https://dribbble.com/hyphenzero',
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" data-slot="icon" viewBox="0 0 24 24" {...props}><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/></svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@jaspergorchov',
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" data-slot="icon" viewBox="0 0 24 24" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

type Props = {
  projects: SerializableProject[]
}

export function HeroSection({ projects }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [imageHeight, setImageHeight] = useState(800)
  const [focusCenterY, setFocusCenterY] = useState(460)

  const measure = useCallback(() => {
    const header = document.querySelector('header')
    const content = contentRef.current
    if (!header || !content) return

    const headerRect = header.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const height = contentRect.top - headerRect.bottom

    if (height > 0) {
      setImageHeight(Math.max(height - 2 * IMAGE_GAP + HEADER_BOTTOM_PADDING, 1))
      setFocusCenterY(headerRect.bottom + height / 2 - HEADER_BOTTOM_PADDING / 2)
    }
  }, [])

  useLayoutEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    const header = document.querySelector('header')
    if (header) observer.observe(header)
    if (contentRef.current) observer.observe(contentRef.current)
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  return (
    <>
      <div className="absolute inset-x-0 top-0 isolate h-dvh">
        <Hero projects={projects} imageHeight={imageHeight} focusCenterY={focusCenterY} />
      </div>

      <div
        ref={contentRef}
        className="relative mx-auto mt-[100dvh] flex translate-y-[calc(-100%-70px)] flex-col gap-10 px-6 pb-6 sm:translate-y-[calc(-100%-62px)] md:flex-row md:items-end md:justify-between md:gap-8 md:px-12 md:pb-12 lg:translate-y-[calc(-100%-60px)] lg:px-14 lg:pb-14"
      >
        <h1 className="max-w-5xl text-3xl/11 font-medium tracking-tight text-balance text-zinc-950 [text-box:trim-both_cap_alphabetic] sm:text-[clamp(2rem,3.4vw,3rem)]/tight dark:text-white">
          I’m Jasper Gorchov, a software developer, design engineer, and 3D artist.
        </h1>

        <div className="flex flex-col items-center justify-between max-sm:*:w-full sm:max-md:flex-row sm:max-md:items-center md:self-stretch">
          <div className="flex h-fit gap-x-6 *:w-full sm:*:w-32">
            <Button href="/projects" color="sky" data-track="hero-projects">
              Projects <ChevronRightIcon className="-mr-1.5!" />
            </Button>
            <Button outline href="/blog" data-track="hero-blog">
              Blog <ChevronRightIcon className="-mr-1! text-zinc-950/30! dark:text-white/30!" />
            </Button>
          </div>

          <div className="flex w-full items-center justify-between px-6 max-sm:mt-10 sm:max-md:ml-12 sm:max-md:px-0 md:pt-6">
            {socialMedia.map((item) => (
              <Link key={item.name} href={item.href} data-track={`hero-social-${item.name.toLowerCase()}`} target="_blank" rel="noopener norefferer">
                <item.icon className="size-5 text-zinc-950/75 mix-blend-plus-lighter transition-colors duration-200 hover:text-zinc-950 dark:text-white/75 dark:hover:text-white" />
                <span className="sr-only">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
