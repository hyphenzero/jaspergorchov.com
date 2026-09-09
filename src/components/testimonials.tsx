'use client'

import * as Headless from '@headlessui/react'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import Image from 'next/image'
import { type HTMLMotionProps, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { Link } from './link'

const testimonials = [
  {
    img: '/testimonials/tina-yards.jpg',
    name: 'Tina Yards',
    title: 'VP of Sales, Protocol',
    quote: 'Thanks to Radiant, we’re finding new leads that we never would have found with legal methods.',
  },
  {
    img: '/testimonials/conor-neville.jpg',
    name: 'Conor Neville',
    title: 'Head of Customer Success, TaxPal',
    quote: 'Radiant made undercutting all of our competitors an absolute breeze.',
  },
  {
    img: '/testimonials/amy-chase.jpg',
    name: 'Amy Chase',
    title: 'Head of GTM, Pocket',
    quote: 'We closed a deal in literally a few minutes because we knew their exact budget.',
  },
  {
    img: '/testimonials/veronica-winton.jpg',
    name: 'Veronica Winton',
    title: 'CSO, Planeteria',
    quote: 'We’ve managed to put two of our main competitors out of business in 6 months.',
  },
  {
    img: '/testimonials/dillon-lenora.jpg',
    name: 'Dillon Lenora',
    title: 'VP of Sales, Detax',
    quote: 'I was able to replace 80% of my team with RadiantAI bots.',
  },
  {
    img: '/testimonials/harriet-arron.jpg',
    name: 'Harriet Arron',
    title: 'Account Manager, Commit',
    quote: 'I’ve smashed all my targets without having to speak to a lead in months.',
  },
]

function TestimonialCard({ img, ...props }: { img: string } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      {...props}
      className="relative flex aspect-video w-full shrink-0 snap-start scroll-ml-(--scroll-padding) flex-col justify-end overflow-hidden rounded-3xl"
    >
      <Image alt="" src={img} fill sizes="(max-width: 1024px) 100vw, 400px" className="object-cover" />
    </motion.div>
  )
}

function CallToAction() {
  return (
    <div>
      <p className="max-w-sm text-sm/6 text-zinc-600">
        Join the best sellers in the business and start using Radiant to hit your targets today.
      </p>
      <div className="mt-2">
        <Link href="#" className="inline-flex items-center gap-2 text-sm/6 font-medium text-pink-600">
          Get started
          <ArrowLongRightIcon className="size-5" />
        </Link>
      </div>
    </div>
  )
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const { scrollX } = useScroll({ container: scrollRef })
  const [activeIndex, setActiveIndex] = useState(0)

  useMotionValueEvent(scrollX, 'change', (x: number) => {
    setActiveIndex(Math.floor(x / scrollRef.current!.children[0].clientWidth))
  })

  function scrollTo(index: number) {
    const gap = 32
    const width = (scrollRef.current!.children[0] as HTMLElement).offsetWidth
    scrollRef.current!.scrollTo({ left: (width + gap) * index })
  }

  return (
    <div className="overflow-hidden py-32">
      <div
        ref={scrollRef}
        className={clsx([
          'mt-16 flex gap-8 px-(--scroll-padding)',
          'scrollbar-none [&::-webkit-scrollbar]:hidden',
          'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
          '[--scroll-padding:max(--spacing(6),calc((100vw-96rem)/2+(--spacing(6))))] lg:[--scroll-padding:max(--spacing(8),calc((100vw-96rem)/2+(--spacing(8))))]',
        ])}
      >
        {testimonials.map(({ img }, testimonialIndex) => (
          <TestimonialCard key={testimonialIndex} img={img} onClick={() => scrollTo(testimonialIndex)} />
        ))}
        <div className="w-2xl shrink-0 sm:w-216" />
      </div>
      <div className="mt-16 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between">
            <CallToAction />
            <div className="hidden sm:flex sm:gap-2">
              {testimonials.map(({ name }, testimonialIndex) => (
                <Headless.Button
                  key={testimonialIndex}
                  onClick={() => scrollTo(testimonialIndex)}
                  data-active={activeIndex === testimonialIndex ? true : undefined}
                  aria-label={`Scroll to testimonial from ${name}`}
                  className={clsx(
                    'size-2.5 rounded-full border border-transparent bg-zinc-300 transition',
                    'data-active:bg-zinc-400 data-hover:bg-zinc-400',
                    'forced-colors:data-active:bg-[Highlight] forced-colors:data-focus:outline-offset-4'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
