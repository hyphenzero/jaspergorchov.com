import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'

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
        <div className="mx-auto mt-12 max-w-304 px-6 sm:mt-20 lg:mt-24 lg:px-8">
          <h1 className="text-balance font-medium text-2xl text-white tracking-tight sm:text-[clamp(2rem,3.75vw,3rem)]/tight">
            I’m Jasper Gorchov, a 14-year-old developer, designer, and 3D artist.
          </h1>
          <TabList className="@container flex flex-1 grow space-y-2 overflow-y-scroll">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={clsx(
                  'group relative flex items-center justify-center gap-4 rounded-xl p-4 transition focus:not-data-focus:outline-none sm:p-6'
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
        <div className="mx-auto mt-20 max-w-[107rem] px-6 lg:px-8">
          <div className="aspect-video w-full rounded-4xl bg-zinc-200 dark:bg-zinc-900">
            <TabPanels>
              <TabPanel>Websites</TabPanel>
              <TabPanel>Web Apps</TabPanel>
              <TabPanel>3D Art</TabPanel>
              <TabPanel>Minecraft</TabPanel>
            </TabPanels>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-304 px-6 sm:mt-20 lg:mt-24 lg:px-8">
          <p className="text-pretty font-mono font-semibold text-[0.8125rem]/6 text-sky-500 uppercase tracking-widest">
            Projects
          </p>
          <h2 className="max-w-3xl text-pretty font-medium text-3xl tracking-tight md:text-[2.5rem]/14">
            Creating high-quality websites, web apps, and 3D illustrations.
          </h2>
        </div>
      </TabGroup>
    </>
  )
}
