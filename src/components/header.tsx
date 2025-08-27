'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars2Icon, XMarkIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Banner } from './banner'
import { Logo } from './logo-box'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './navbar'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
]

export function Header({ latestTitle, latestUrl }: { latestTitle: string; latestUrl: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [animateIndicator, setAnimateIndicator] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const prevPathRef = useRef<string | null>(null)

  // helper to determine if a path belongs to the top-level nav group
  const isNavPath = (p: string | null) => {
    if (!p) return false
    return navigation.some((item) => p.startsWith(item.href))
  }

  useEffect(() => {
    // store previous pathname before it updates
    prevPathRef.current = pathname
  }, [pathname])

  useEffect(() => {
    // toggle scrolled state when user scrolls past 100px
    const onScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    // run once on mount to set initial state
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const router = useRouter()

  async function handleNavClick(e: React.MouseEvent | null, target: string) {
    if (e) e.preventDefault()
    const prev = prevPathRef.current ?? pathname
    const prevIsNav = isNavPath(prev)
    const targetIsNav = isNavPath(target)

    // Play enter animation when navigating from a non-nav page into a nav page.
    // Play exit animation when navigating from a nav page to a non-nav page (e.g. clicking the logo).
    const shouldAnimate = (targetIsNav && !prevIsNav) || (!targetIsNav && prevIsNav)
    setAnimateIndicator(shouldAnimate)

    // give React a moment to render the animate state before navigating so
    // the exit animation can run on the indicator.
    await new Promise((r) => setTimeout(r, 40))
    router.push(target)

    // Clear the flag shortly after navigation so subsequent nav-item-to-nav-item
    // transitions use the shared layout animation rather than the mount/unmount animation.
    setTimeout(() => setAnimateIndicator(false), 400)
  }

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-[-webkit-backdrop-filter,backdrop-filter] duration-500',
        // scrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'
        'backdrop-blur-md'
      )}
    >
      <Navbar className="relative mx-auto max-w-288 px-6 pt-5 pb-5.25 lg:px-8">
        <div
          className={clsx(
            'absolute inset-x-0 top-full mx-6 h-px -translate-y-px transition-colors duration-500 lg:mx-8',
            // scrolled ? 'bg-zinc-950/10 dark:bg-white/7.5' : 'bg-transparent',
            'bg-zinc-950/10 dark:bg-white/7.5'
          )}
        />
        <Link href="/" aria-label="Home" onClick={(e) => handleNavClick(e, '/')}>
          <Logo className="size-10 sm:size-8" />
        </Link>
        <Banner latestTitle={latestTitle} latestUrl={latestUrl} />
        <NavbarSpacer />
        <NavbarSection className="max-lg:hidden">
          {navigation.map((item) => (
            <NavbarItem
              key={item.href}
              current={pathname.startsWith(item.href)}
              href={item.href}
              onClick={(e: MouseEvent) => handleNavClick(e, item.href)}
              animateIndicator={animateIndicator}
            >
              {item.name}
            </NavbarItem>
          ))}
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
