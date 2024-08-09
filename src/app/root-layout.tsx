'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { clsx } from 'clsx'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import { useEffect, useState } from 'react'

export function RootLayout({ children }: { children: React.ReactNode }) {
  let scrollYProgress = useMotionValue(0)

  let padding = useTransform(scrollYProgress, [0, 150], ['1.5rem', '0.2rem'])
	let borderOpacity = useTransform(scrollYProgress, [0, 150], [0, 0.1])
	
  useEffect(() => {
    function onScroll() {
      scrollYProgress.set(window.scrollY)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [scrollYProgress])

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <>
      <motion.header
        style={{ paddingTop: padding, paddingBottom: padding }}
        className={clsx('fixed inset-x-0 top-0 z-10 flex items-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg')}
      >
        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute bottom-0 h-px w-full bg-zinc-950 dark:bg-white"
        />
        <Header />
      </motion.header>

      <div className="mt-[6.5625rem]">{children}</div>

      <Footer />
    </>
  )
}
