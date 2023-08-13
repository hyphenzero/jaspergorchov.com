import Link from 'next/link'

import { LinkCaret } from './LinkCaret'
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
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <FadeIn className="rounded-4xl -mx-6 rounded-3xl bg-white px-6 py-20 sm:mx-0 sm:py-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-medium text-neutral-950 [text-wrap:balance] sm:text-4xl">
              Let’s talk
            </h2>
            <div className="mt-6 flex items-center space-x-4">
              <Button
                href="/contact"
                className="!bg-neutral-950 !text-white hover:!bg-neutral-800"
              >
                Contact
              </Button>
              <p className="font-medium text-neutral-950">
                Not currently available <br className="sm:hidden" /> for
                projects
              </p>
            </div>
            <div className="mt-10 border-t border-neutral-950 pt-10">
              <Link
                href="mailto:hello@jaspergorchov.com"
                className="group flex w-fit items-center font-display text-base font-semibold text-neutral-950"
              >
                hello@jaspergorchov.com
                <LinkCaret className="!text-neutral-950" />
              </Link>
              <div className="mt-8 flex flex-col space-y-2">
                {social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex w-fit items-center font-medium text-neutral-950"
                  >
                    {item.name}
                    <LinkCaret className="!text-neutral-950" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}
