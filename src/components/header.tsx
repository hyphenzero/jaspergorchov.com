'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars2Icon, XMarkIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Banner } from './banner'
import { Logo } from './logo'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './navbar'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
]

export function Header({ latestTitle, latestUrl }: { latestTitle: string; latestUrl: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header>
      <Navbar className="mx-auto max-w-[96rem] p-6 lg:px-8">
        <Link href="/" aria-label="Home">
          <Logo className="size-10 sm:size-8" />
        </Link>
        <Banner latestTitle={latestTitle} latestUrl={latestUrl} />
        <NavbarSpacer />
        <NavbarSection className="max-lg:hidden">
          <NavbarItem current={pathname.startsWith('/about')} href="/about">
            About
          </NavbarItem>
          <NavbarItem current={pathname.startsWith('/projects')} href="/projects">
            Projects
          </NavbarItem>
          <NavbarItem current={pathname.startsWith('/blog')} href="/blog">
            Blog
          </NavbarItem>
        </NavbarSection>
        <NavbarSection className="lg:hidden">
          <NavbarItem onClick={() => setMobileMenuOpen(true)}>
            <Bars2Icon />
          </NavbarItem>
        </NavbarSection>
      </Navbar>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-zinc-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-zinc-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-zinc-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-zinc-900 hover:bg-zinc-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
