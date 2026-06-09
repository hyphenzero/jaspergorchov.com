'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars2Icon, XMarkIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { Banner } from './banner'
import { Logo } from './logo-box'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './navbar'

const navigation = [
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]
const SCROLL_TRIGGER_OFFSET = 28

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [animateIndicator, setAnimateIndicator] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const prevPathRef = useRef<string | null>(null)

  /** Return true when the given path is inside a top-level nav route. */
  const isNavPath = (p: string | null) => {
    if (!p) return false
    return navigation.some((item) => p.startsWith(item.href))
  }

  useEffect(() => {
    // keep the previous pathname for transition decisions
    prevPathRef.current = pathname
  }, [pathname])

  useEffect(() => {
    // update `scrolled` once the sticky header has reached the viewport top.
    const onScroll = () => setScrolled(window.scrollY >= SCROLL_TRIGGER_OFFSET)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const router = useRouter()

  /**
   * Handle navigation clicks:
   * - Prevent default navigation.
   * - Set animation flag when transitioning between nav and non-nav pages.
   * - Wait briefly to allow the animation state to render, then navigate.
   */
  async function handleNavClick(e: React.MouseEvent | null, target: string) {
    if (e) e.preventDefault()
    const prev = prevPathRef.current ?? pathname
    const prevIsNav = isNavPath(prev)
    const targetIsNav = isNavPath(target)

    const shouldAnimate = (targetIsNav && !prevIsNav) || (!targetIsNav && prevIsNav)
    setAnimateIndicator(shouldAnimate)

    // Allow the indicator animation state to apply before routing.
    await new Promise((r) => setTimeout(r, 40))
    router.push(target)
    setTimeout(() => setAnimateIndicator(false), 400)
  }

  return (
    <header
      className={clsx(
        'sticky inset-x-0 top-0 z-50 mt-5 transition-[background-color,box-shadow,-webkit-backdrop-filter,backdrop-filter] duration-500',
        scrolled &&
          'bg-white/85 shadow-[0_1px_0_0_--alpha(var(--color-zinc-950)/10%)] backdrop-blur-xl dark:bg-zinc-950/85 dark:shadow-[0_1px_0_0_--alpha(var(--color-white)/10%)]'
      )}
    >
      <Navbar className={clsx('relative mx-auto py-3.25 px-6 lg:px-18')}>
        <Link href="/" aria-label="Home" onClick={(e) => handleNavClick(e, '/')}>
          <Logo className="size-10 sm:size-8" />
        </Link>
        <Banner />
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
                    className="-mx-3 block rounded-lg px-3 py-2 font-semibold text-base/7 text-zinc-900 hover:bg-zinc-50"
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
