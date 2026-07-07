'use client'

import { Tab, TabGroup, TabList } from '@headlessui/react'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { Link } from '@/components/link'

type TabItem = { label: string; value: string }

export function Tabs({
  tabs,
  activeTab,
  layoutId,
  className,
  paramName,
  onChange,
}: {
  tabs: TabItem[]
  activeTab: string
  layoutId: string
  className?: string
  paramName?: string
  onChange?: (value: string) => void
}) {
  const pathname = usePathname()
  const activeIndex = tabs.findIndex((t) => t.value === activeTab)

  return (
    <TabGroup selectedIndex={activeIndex} onChange={(index) => onChange?.(tabs[index].value)}>
      <nav className={clsx('relative', className)}>
        <TabList className="isolate flex flex-nowrap gap-4 overflow-x-visible">
          {tabs.map((tab) =>
            onChange ? (
              <Tab
                key={tab.value}
                className="group relative block rounded-full px-2.5 pt-0.75 pb-1 font-medium text-sm transition focus:outline-none"
              >
                {activeTab === tab.value && (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 -z-10 bg-zinc-200 dark:border-white/10 dark:border-t dark:bg-zinc-700"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span
                  className={clsx(
                    'text-zinc-950 transition dark:text-white',
                    activeTab !== tab.value && 'hover:text-zinc-600 dark:hover:text-zinc-300'
                  )}
                >
                  {tab.label}
                </span>
              </Tab>
            ) : (
              <Tab
                key={tab.value}
                as={Link}
                href={paramName && tab.value === 'all' ? pathname : `?${paramName}=${encodeURIComponent(tab.value)}`}
                scroll={false}
                className="group relative block rounded-full px-2.5 pt-0.75 pb-1 font-medium text-sm transition focus:outline-none"
              >
                {activeTab === tab.value && (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 -z-10 bg-zinc-200 dark:border-white/10 dark:border-t dark:bg-zinc-700"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span
                  className={clsx(
                    'text-zinc-950 transition dark:text-white',
                    activeTab !== tab.value && 'hover:text-zinc-600 dark:hover:text-zinc-300'
                  )}
                >
                  {tab.label}
                </span>
              </Tab>
            )
          )}
        </TabList>
      </nav>
    </TabGroup>
  )
}
