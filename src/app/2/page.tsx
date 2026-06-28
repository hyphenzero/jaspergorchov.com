import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { Button } from '@/components/button'

const tabs = [
  {
    name: 'Websites',
    description: 'Over 500+ professionally designed, fully responsive, expertly crafted components.',
    icon: ChevronRightIcon,
    color: 'sky',
  },
  {
    name: 'Web Apps',
    description: 'Over 500+ professionally designed, fully responsive, expertly crafted components.',
    icon: ChevronRightIcon,
    color: 'indigo',
  },
  {
    name: '3D Art',
    description: 'Over 500+ professionally designed, fully responsive, expertly crafted components.',
    icon: ChevronRightIcon,
    color: 'fuchsia',
  },
  {
    name: 'Minecraft',
    description: 'Over 500+ professionally designed, fully responsive, expertly crafted components.',
    icon: ChevronRightIcon,
    color: 'red',
  },
]

export default function Home() {
  return (
    <>
      <TabGroup>
        <div className="mx-auto grid h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] max-w-[128rem] grid-cols-10 gap-12 p-6 pb-8 sm:h-[calc(100vh-5.25rem)] sm:max-h-[calc(100vh-5.25rem)] lg:px-8 2xl:pt-10">
          <div className="col-span-4 flex size-full flex-col justify-between space-y-8 2xl:col-span-3">
            <div className="flex h-full flex-1 grow flex-col space-y-8">
              <h1 className="text-pretty text-6xl tracking-tighter sm:text-8xl">Jasper Gorchov</h1>
              <p className="max-w-2xl text-pretty font-medium text-lg/7 text-zinc-600 dark:text-zinc-400">
                I’m a 14-year-old developer, designer, and 3D artist with immense attention to detail and a love of
                minimalism.
              </p>
              <TabList className="@container flex flex-1 grow flex-col space-y-2 overflow-y-scroll">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={clsx(
                      'group relative flex items-center justify-center gap-4 rounded-xl p-4 transition focus:not-data-focus:outline-none max-lg:flex-col sm:p-6'
                    )}
                  >
                    <div
                      className={clsx(
                        'absolute -inset-x-px inset-y-0 -z-10 rounded-xl transition not-group-data-selected:group-hover:bg-zinc-100/70',
                        tab.color === 'sky' && 'group-data-selected:bg-sky-500/5',
                        tab.color === 'indigo' && 'group-data-selected:bg-indigo-500/5',
                        tab.color === 'fuchsia' && 'group-data-selected:bg-fuchsia-500/5',
                        tab.color === 'red' && 'group-data-selected:bg-red-500/5'
                      )}
                    />
                    <div className="size-20 shrink-0 bg-zinc-950/5 sm:size-30" />
                    <div className="text-left text-xs/5 sm:text-sm/7 xl:flex-1">
                      <p
                        className={clsx(
                          'font-mono font-semibold uppercase tracking-widest transition',
                          tab.color === 'sky' && 'group-data-selected:text-sky-600',
                          tab.color === 'indigo' && 'group-data-selected:text-indigo-600',
                          tab.color === 'fuchsia' && 'group-data-selected:text-fuchsia-600',
                          tab.color === 'red' && 'group-data-selected:text-red-600'
                        )}
                      >
                        {tab.name}
                      </p>
                      <p
                        className={clsx(
                          'mt-2 text-zinc-600 transition dark:text-zinc-400'
                          // tab.color === 'sky' && 'group-data-selected:text-sky-900/80',
                          // tab.color === 'indigo' && 'group-data-selected:text-indigo-900/80',
                          // tab.color === 'fuchsia' && 'group-data-selected:text-fuchsia-950/80',
                          // tab.color === 'red' && 'group-data-selected:text-red-900/80'
                        )}
                      >
                        {tab.description}
                      </p>
                    </div>
                  </Tab>
                ))}
              </TabList>
            </div>
            <div className="flex gap-x-4 *:w-full">
              <Button href="/projects" className="group">
                Browse work <ChevronRightIcon className="translate-y-px group-hover:translate-x-0.5" />
              </Button>
              <Button href="/blog" outline className="group">
                Read blog <ChevronRightIcon className="translate-y-px group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
          <div className="col-span-6 size-full rounded-3xl bg-zinc-900/50 2xl:col-span-7">
            <TabPanels>
              <TabPanel>Websites</TabPanel>
              <TabPanel>Web Apps</TabPanel>
              <TabPanel>3D Art</TabPanel>
              <TabPanel>Minecraft</TabPanel>
            </TabPanels>
          </div>
        </div>
      </TabGroup>
    </>
  )
}
