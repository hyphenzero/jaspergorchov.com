import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { Button } from './button'
import { FadeIn } from './fade-in'
import { Field, FieldGroup, Fieldset, Label, Legend } from './fieldset'
import { Input } from './input'
import { Logo } from './logo'
import { Navbar, NavbarSpacer } from './navbar'
import { GitHubIcon, socialMediaProfiles } from './social-media'
import { Strong, Text } from './text'

const navigation = [
  {
    title: 'Work',
    links: [
      { title: 'Compositions Vol. 1', href: '/work/family-fund' },
      { title: 'ChatGPT Redesign', href: '/work/unseal' },
      { title: 'Refractions', href: '/work/phobia' },
      {
        title: (
          <>
            See all <span aria-hidden="true">&rarr;</span>
          </>
        ),
        href: '/work',
      },
    ],
  },
  {
    title: 'Site',
    links: [
      { title: 'About', href: '/about' },
      { title: 'Work', href: '/work' },
      { title: 'Blog', href: '/blog' },
      { title: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Connect',
    links: socialMediaProfiles,
  },
]

function NewsletterForm() {
  return (
    <form className="col-span-2 col-start-5">
      <Fieldset>
        <Legend>Sign up for the newsletter</Legend>
        <Text>
          Subscribe for free to get my latest projects, blog posts, and more — directly in your inbox. No spam.
        </Text>
        <FieldGroup>
          <div className="flex w-full gap-4">
            <Field className="flex-1">
              <Label>Email address</Label>
              <Input type="email" required name="email" />
            </Field>
            <Button className="self-end">
              <ArrowRightIcon />
            </Button>
          </div>
        </FieldGroup>
      </Fieldset>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="pb-16 pt-16 lg:pt-24">
      <FadeIn>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-y-16 px-6 lg:grid-cols-6 lg:px-8">
          <nav className="col-span-3">
            <ul role="list" className="grid w-full grid-cols-2 sm:grid-cols-3">
              {navigation.map((section, sectionIndex) => (
                <li key={sectionIndex}>
                  <Text>
                    <Strong>{section.title}</Strong>
                  </Text>
                  <ul role="list" className="mt-3 space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li className="w-fit" key={linkIndex}>
                        <Link href={link.href}>
                          <Text className="transition hover:!text-zinc-950 dark:hover:!text-white">{link.title}</Text>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
          <NewsletterForm />
        </div>
        <Navbar className="mx-auto mt-24 w-full max-w-7xl px-6 lg:px-8">
          <Link href="/" aria-label="Home">
            <Logo className="size-10 sm:size-8" />
          </Link>

          <Button
            plain
            href="https://github.com/hyphenzero/jaspergorchov.com"
            className="w-fit font-normal max-sm:hidden sm:ml-8"
          >
            <GitHubIcon data-slot="icon" /> Source code <ArrowUpRightIcon className="ml-2 size-4" />
          </Button>

          <NavbarSpacer />

          <Text>&copy; {new Date().getFullYear()} Jasper Gorchov. All rights reserved.</Text>
        </Navbar>
      </FadeIn>
    </footer>
  )
}
