'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
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
  { name: 'Uses', href: '/uses' },
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
  }

  return (
    <header
      className={clsx(
        'sticky inset-x-0 top-0 z-50 transition-[background-color,box-shadow,-webkit-backdrop-filter,backdrop-filter] duration-500',
        scrolled &&
          'bg-white/85 shadow-[0_1px_0_0_--alpha(var(--color-zinc-950)/10%)] backdrop-blur-xl dark:bg-zinc-950/85 dark:shadow-[0_1px_0_0_--alpha(var(--color-white)/10%)]'
      )}
    >
      <Navbar className={clsx('relative mx-auto px-6 py-3.25 lg:px-8')}>
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
          <NavbarItem onClick={() => setMobileMenuOpen((v) => !v)}>
            {mobileMenuOpen ? <XMarkIcon /> : <Bars2Icon />}
          </NavbarItem>
        </NavbarSection>
      </Navbar>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-zinc-950/15 transition duration-100 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in dark:bg-zinc-950/50"
        />

        <div className="fixed inset-x-0 top-0 z-10 px-6 pt-16.5 sm:pt-14.5">
          <DialogPanel
            transition
            className="w-full origin-top-right rounded-2xl bg-white p-6 shadow-lg ring-1 ring-zinc-950/10 transition duration-100 will-change-transform data-closed:data-enter:scale-90 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in dark:bg-zinc-900 dark:ring-white/10"
          >
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 font-semibold text-base/7 text-zinc-900 transition hover:bg-zinc-50 dark:text-white dark:hover:bg-white/5"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </DialogPanel>
        </div>
      </Dialog>
    </header>
  )
}
