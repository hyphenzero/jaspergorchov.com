'use client'

import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Bars2Icon, XMarkIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { Banner } from './banner'
import { Button } from './button'
import { ClickTracker } from './click-tracker'
import { Logo } from './logo-box'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './navbar'

const navigation = [
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
]
const SCROLL_TRIGGER_OFFSET = 28

export function Header() {
  const pathname = usePathname()
  const [animateIndicator, setAnimateIndicator] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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

  // track the uncontrolled Popover close (Escape, outside click) to our state
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

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
      data-scrolled={scrolled ? 'true' : undefined}
      className={clsx(
        'sticky inset-x-0 top-0 z-50',
        scrolled && 'bg-white/85 backdrop-blur-3xl dark:bg-zinc-950/90',
        scrolled &&
          !menuOpen &&
          'shadow-[0_1px_0_0_--alpha(var(--color-zinc-950)/10%)] dark:shadow-[0_1px_0_0_--alpha(var(--color-white)/10%)]'
      )}
      style={{
        transition: 'background-color 500ms, box-shadow 300ms, -webkit-backdrop-filter 500ms, backdrop-filter 500ms',
      }}
    >
      <Navbar className="relative mx-auto px-6 py-3.25 lg:px-8">
        <Link href="/" aria-label="Home" onClick={(e) => handleNavClick(e, '/')} className="z-60">
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
        <Popover className="relative inset-0 lg:hidden">
          {({ open }) => (
            <>
              <PopoverButton
                as={Button}
                plain
                className="z-60 **:data-[slot=icon]:text-zinc-950/40! sm:px-2.75! dark:**:data-[slot=icon]:text-white/40!"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {open ? <XMarkIcon /> : <Bars2Icon />}
              </PopoverButton>
              <PopoverBackdrop
                transition
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  'fixed inset-x-0 bottom-0 z-50 h-screen w-screen bg-linear-to-b to-zinc-950/10 to-20% transition duration-200 ease-out not-dark:top-0 data-closed:opacity-0 dark:top-17.5 dark:to-zinc-950/50 dark:sm:top-15.5',
                  scrolled && 'from-zinc-950/90'
                )}
              />
              <PopoverPanel
                anchor="bottom end"
                transition
                className="z-60 w-full origin-top-right rounded-2xl bg-white p-2 shadow-lg ring-1 ring-zinc-950/10 transition duration-200 ease-in-out [--anchor-gap:--spacing(3.25)] [--anchor-padding:--spacing(3)] data-closed:scale-95 data-closed:opacity-0 dark:bg-zinc-900 dark:ring-white/10"
              >
                <nav>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-4 py-3 text-lg font-semibold text-zinc-900 transition not-first:mt-1 hover:bg-zinc-950/5 dark:text-white dark:hover:bg-white/5"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </PopoverPanel>
            </>
          )}
        </Popover>
      </Navbar>
      <ClickTracker />
    </header>
  )
}
