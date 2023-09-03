import Link from 'next/link'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'

const social = [
  {
    name: 'Dribbble',
    href: 'https://dribbble.com/hyphenzero',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/hyphenzero',
  },
]

export function ContactSection() {
  return (
    <Container className="py-24 sm:py-32">
      <FadeIn className="-mx-6 rounded-3xl bg-secondary px-6 py-20 sm:mx-0 sm:py-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-medium text-white [text-wrap:balance] sm:text-4xl">
              Let’s talk
            </h2>
            <div className="mt-6 flex items-center space-x-6">
              <Button arrow href="/contact">
                Contact
              </Button>
              <span className="text-neutral-700">/</span>
              <p className="text-base font-medium text-white">
                Not currently available <br className="sm:hidden" /> for
                projects
              </p>
            </div>
            <ul
              role="list"
              className="mt-10 grid grid-cols-1 gap-10 border-t border-neutral-800 pt-10 text-sm text-neutral-300 sm:grid-cols-2"
            >
              <li className="flex flex-col space-y-2">
                <div className="font-display text-sm font-semibold tracking-wider text-white">
                  Email
                </div>
                <Link
                  href="mailto:hello@jaspergorchov.com"
                  className="w-fit transition-colors duration-200 hover:text-sky-300"
                >
                  hello@jaspergorchov.com
                </Link>
              </li>
              <li className="flex flex-col space-y-2">
                <div className="font-display text-sm font-semibold tracking-wider text-white">
                  Socials
                </div>
                {social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="w-fit transition-colors duration-200 hover:text-sky-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </li>
            </ul>
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}
