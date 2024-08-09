"use client"

import { Bars2Icon, ChevronRightIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BadgeButton } from './badge'
import { Logo } from './logo'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './navbar'

export function Header() {
  let pathname = usePathname()

  return (
    <Navbar className={clsx('mx-auto max-w-7xl px-6 lg:pl-8')}>
      <Link href="/" aria-label="Home">
        <Logo className="size-10 sm:size-8" />
      </Link>
      <BadgeButton
        color="sky"
        href="/"
        className="font-normal max-sm:hidden sm:ml-8"
      >
        <div className="inline-flex items-center gap-x-1.5 font-normal">
          <strong className="font-semibold">jaspergorchov.com v2.0</strong>
          <svg width="2" height="2" fill="currentColor" aria-hidden="true" className="mx-">
            <circle cx="1" cy="1" r="1"></circle>
          </svg>
          <span>My personal website, reimagined</span>
          <ChevronRightIcon className="-ml-1 size-3" />
        </div>
      </BadgeButton>
      <NavbarSpacer />
      <NavbarSection className="max-lg:hidden">
        <NavbarItem current={pathname.startsWith('/about')} href="/about">
          About
        </NavbarItem>
        <NavbarItem current={pathname.startsWith('/work')} href="/work">
          Work
        </NavbarItem>
        <NavbarItem current={pathname.startsWith('/blog')} href="/blog">
          Blog
        </NavbarItem>
        <NavbarItem current={pathname.startsWith('/contact')} href="/contact">
          Contact
        </NavbarItem>
      </NavbarSection>
      <NavbarSection className="lg:hidden">
        <NavbarItem>
          <Bars2Icon />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  )
}
