'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Dialog } from '@headlessui/react'
import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { Button } from './Button'
import { FadeIn, FadeInStagger } from './FadeIn'
import { Logo } from './Logo'
import { SocialMedia } from './SocialMedia'
import { WavePattern } from './WavePattern'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Work', href: '/work' },
  { name: 'Playground', href: '/playground' },
]

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className=" inset-x-0 top-0 z-50 mx-auto w-full max-w-7xl">
      <nav
        className="flex items-center justify-between px-6 py-8 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center lg:space-x-20">
          <Link href="/" aria-label="Home" className="flex rounded-md">
            <Logo />
          </Link>
          <div className="hidden lg:flex lg:gap-x-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:text-sky-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center max-lg:space-x-4">
          <Button href="/contact">Contact</Button>
          <button
            type="button"
            className="rounded-md p-3 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars2Icon className="h-6 w-6 text-white" />
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-primary/75 px-6 py-8 backdrop-blur-xl sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="Home" className="flex rounded-md">
              <Logo />
            </Link>
            <button
              type="button"
              className="rounded-md p-3 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="mt-6">
            <div className="-my-6">
              <FadeInStagger
                faster
                className="flex flex-col space-y-3 pb-3 pt-6"
              >
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-2.5 rounded-lg px-2.5 py-1.5 text-base font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary"
                  >
                    <FadeIn className="flex">{item.name}</FadeIn>
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="-mx-2.5 rounded-lg px-2.5 py-1.5 text-base font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary"
                >
                  <FadeIn className="flex">Contact</FadeIn>
                </Link>
              </FadeInStagger>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="mt-32">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl border-t border-neutral-800 px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">
        <SocialMedia className="max-md:flex max-md:justify-center md:order-2" />
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-neutral-400">
            &copy; {new Date().getFullYear()} Jasper Gorchov. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export function RootLayout({ children, wavePattern = true }) {
  return (
    <>
      <Header />
      <main className="min-h-full w-screen overflow-hidden">
        {wavePattern && (
          <div className="absolute inset-0 -z-10 h-screen w-screen overflow-x-clip">
            <WavePattern className="absolute left-0 top-0 -z-10 w-[110vw] scale-[2.3] overflow-clip bg-cover bg-center [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] max-sm:-translate-x-36 sm:scale-150 lg:scale-100" />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </>
  )
}
