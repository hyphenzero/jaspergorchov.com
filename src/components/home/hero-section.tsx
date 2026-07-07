'use client'

import { ChevronRightIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { JSX, SVGProps, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/button'
import type { SerializableProject } from '@/types/post'
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
    name: 'YouTube',
    href: 'https://youtube.com/@jaspergorchov',
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" data-slot="icon" viewBox="0 0 24 24" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Bluesky',
    href: '#',
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" data-slot="icon" viewBox="0 0 24 24" {...props}>
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
      </svg>
    ),
  },
  {
    name: 'Behance',
    href: '#',
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" data-slot="icon" viewBox="0 0 24 24" {...props}>
        <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z" />
      </svg>
    ),
  },
]

type Props = {
  projects: SerializableProject[]
}

export function HeroSection({ projects }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [imageHeight, setImageHeight] = useState(400)
  const [focusCenterY, setFocusCenterY] = useState(0)

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

  useEffect(() => {
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
      <div className="absolute inset-x-0 top-0 isolate -z-10 h-dvh">
        <Hero projects={projects} imageHeight={imageHeight} focusCenterY={focusCenterY} />
      </div>

      <div
        ref={contentRef}
        className="relative mx-auto mt-[100dvh] flex translate-y-[calc(-100%-70px)] flex-col gap-10 px-6 pb-6 sm:translate-y-[calc(-100%-62px)] md:flex-row md:items-end md:justify-between md:gap-8 md:px-12 md:pb-12 lg:translate-y-[calc(-100%-60px)] lg:px-14 lg:pb-14"
      >
        <h1 className="max-w-5xl text-balance font-medium text-3xl/11 text-zinc-950 tracking-tight [text-box:trim-both_cap_alphabetic] sm:text-[clamp(2rem,3.4vw,3rem)]/tight dark:text-white">
          I'm Jasper Gorchov, a software developer, design engineer, and 3D artist.
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
              <Link key={item.name} href={item.href} data-track={`hero-social-${item.name.toLowerCase()}`}>
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
