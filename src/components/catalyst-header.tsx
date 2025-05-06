'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars2Icon, ChevronRightIcon, MegaphoneIcon, XMarkIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Logo } from './logo'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './navbar'
import { Banner } from "./banner"

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  let pathname = usePathname()

  return (
    <header>
      <Navbar className="mx-auto max-w-[96rem] p-6 lg:px-8">
        <Link href="/" aria-label="Home">
          <Logo className="size-10 sm:size-8" />
        </Link>
        {/* <div className="@container flex w-full justify-start pl-2 sm:pl-8">
          <a
            href="https://tailwindcss.com/blog/tailwind-plus"
            className="flex flex-nowrap items-center gap-2 rounded-full px-3 py-2 text-xs/4 whitespace-nowrap ring ring-zinc-950/8 dark:ring-white/8 hover:bg-zinc-950/2 dark:hover:bg-white/2 hover:ring-zinc-950/10 dark:hover:ring-white/10 @max-[22rem]:hidden"
          >
            <MegaphoneIcon className="size-4 fill-sky-500 dark:fill-sky-400" />
            <span className="font-medium">Tailwind UI is now Tailwind Plus</span>
            <span className="size-0.75 rounded-full bg-current/50" />
            <div className="flex gap-0.5">
              <span>Learn more</span>
              <ChevronRightIcon className="-mr-1 size-4 fill-zinc-950/30 dark:fill-white/30" />
            </div>
          </a>
        </div> */}
				{/* <Banner /> */}
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
