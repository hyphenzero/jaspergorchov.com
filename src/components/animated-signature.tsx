'use client'

import { motion, useAnimation } from 'motion/react'
import { useEffect } from 'react'

const PATH_D =
  'M10.394 17.2139C10.3821 17.2139 9.52996 16.5609 7.66569 14.9204C6.60079 13.9833 5.48267 12.6303 4.48632 11.3514C2.59966 8.9297 1.60213 6.85747 1.09961 5.28655C0.151457 2.32257 0.568178 1.14135 0.74381 0.854963C1.17215 0.156511 2.33389 0.655771 3.09786 0.924752C3.51515 1.07167 4.55972 2.08774 6.23283 3.78729C7.05841 4.62592 7.71877 5.528 8.52045 7.11907C9.32213 8.71013 10.2151 10.9914 10.7721 12.7142C11.3291 14.437 11.5232 15.5321 11.6379 17.0553C11.8964 20.4898 11.7902 22.6782 11.6398 23.2946C11.132 25.3756 10.2935 26.0956 9.98226 26.2862C9.83239 26.3779 9.63933 26.3373 9.44708 26.2095C8.56245 25.6216 8.3973 24.4829 8.11848 23.0552C7.86081 21.7358 8.01423 20.6895 8.09437 20.2921C8.26828 19.4297 9.47863 18.5642 10.9625 17.6915C13.2447 16.3492 16.0283 16.6225 17.5008 16.8006C19.1918 17.0051 20.5508 17.5196 21.4893 17.435C23.7178 17.2342 25.2704 13.5221 25.7726 13.4537C26.7061 13.3265 28.2251 15.9679 29.2569 17.1009C29.6969 17.5841 30.7163 16.7471 31.9564 16.0293C33.4187 15.1828 35.0391 15.3198 36.4527 15.4945C38.305 15.7234 39.4178 16.1588 42.0864 15.2482C43.2104 14.8646 44.6073 14.8227 46.3457 14.8862C47.9765 15.1109 49.8327 15.3023 51.5698 15.3739C52.2561 15.4116 52.546 15.4517 52.8446 15.4931'
const DRAW_DURATION = 1.8
const WIPE_DURATION = 0.8
const HOLD_DRAWN = 1500
const STAGGER = 340
const EASE: [number, number, number, number] = [0.42, 0, 0.2, 1]

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

export function AnimatedSignature() {
  const a = useAnimation()
  const b = useAnimation()

  useEffect(() => {
    let cancelled = false

    async function draw(ctrl: ReturnType<typeof useAnimation>) {
      ctrl.set({ pathLength: 0, pathOffset: 0, opacity: 0 })
      await ctrl.start({
        pathLength: 1,
        pathOffset: 0,
        opacity: 1,
        transition: {
          pathLength: { duration: DRAW_DURATION, ease: EASE },
          pathOffset: { duration: 0 },
          opacity: { duration: 0.12 },
        },
      })
    }

    async function wipe(ctrl: ReturnType<typeof useAnimation>) {
      await ctrl.start({
        pathLength: 1,
        pathOffset: 1,
        opacity: 1,
        transition: {
          pathOffset: { duration: WIPE_DURATION, ease: EASE },
          pathLength: { duration: 0 },
          opacity: { duration: 0 },
        },
      })
    }

    async function run() {
      // both hidden
      a.set({ pathLength: 0, pathOffset: 0, opacity: 0 })
      b.set({ pathLength: 0, pathOffset: 0, opacity: 0 })

      // initial draw of A
      await draw(a)
      if (cancelled) return

      while (!cancelled) {
        // hold A fully drawn
        await delay(HOLD_DRAWN)
        if (cancelled) return

        // start wiping A
        const wipeA = wipe(a)
        // stagger: start drawing B shortly after A starts wiping
        await delay(STAGGER)
        if (cancelled) return
        b.set({ pathLength: 0, pathOffset: 0, opacity: 0 })
        const drawB = draw(b)

        await Promise.all([wipeA, drawB])
        if (cancelled) return

        // A is now wiped (offset 1) — hide it for reuse
        a.set({ pathLength: 0, pathOffset: 0, opacity: 0 })
        // hold B
        await delay(HOLD_DRAWN - STAGGER)
        if (cancelled) return

        // wipe B + draw A overlapping
        const wipeB = wipe(b)
        await delay(STAGGER)
        if (cancelled) return
        a.set({ pathLength: 0, pathOffset: 0, opacity: 0 })
        const drawA = draw(a)

        await Promise.all([wipeB, drawA])
        if (cancelled) return
        b.set({ pathLength: 0, pathOffset: 0, opacity: 0 })
        // loop: A is now visible, will hold at top of next iteration
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [a, b])

  return (
    <div className="flex justify-start py-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 54 27"
        width={320}
        height={160}
        className="-ml-1 overflow-visible text-zinc-900 dark:text-white"
        aria-hidden="true"
      >
        {/* Two identical paths stacked — staggered wipe/draw creates the catch-up effect */}
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.15}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
          animate={a}
        />
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.15}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
          animate={b}
        />
      </svg>
    </div>
  )
}
