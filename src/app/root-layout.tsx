'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { clsx } from 'clsx'
import { useScroll, easeOut, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function RootLayout({ children }: { children: React.ReactNode }) {
  let [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let offset = 24
    function onScroll() {
      if (!isScrolled && window.scrollY > offset) {
        setIsScrolled(true)
      } else if (isScrolled && window.scrollY <= offset) {
        setIsScrolled(false)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [isScrolled])

  return (
    <>
      <motion.header
        initial={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}
        animate={{ paddingTop: isScrolled ? '0.2rem' : '1.5rem', paddingBottom: isScrolled ? '0.2rem' : '1.5rem' }}
        transition={{ duration: 1, ease: easeOut, type: 'spring' }}
        className={clsx(
          'fixed inset-x-0 top-0 z-10 flex items-center border-b bg-white dark:bg-zinc-950 backdrop-blur-xl [transition:background-color_800ms_cubic-bezier(0.4,0,0.2,1),border-color_800ms_cubic-bezier(0.4,0,0.2,1)]',
          isScrolled ? 'border-zinc-950/10 dark:border-white/10' : 'border-transparent'
        )}
      >
        <Header isScrolled={isScrolled} />
      </motion.header>

      <div className="mt-[6.5625rem]">{children}</div>

      <Footer />
    </>
  )
}
