'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars2Icon } from '@heroicons/react/16/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Minecraft', href: 'https://hyphenzero.jaspergorchov.com' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header>
      <nav aria-label="Global" className="mx-auto flex max-w-[96rem] items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Jasper Gorchov</span>
            <svg
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="size-10 text-zinc-950 sm:size-8 dark:text-white"
            >
              <path d="M7.36541 29.7343C5.11834 29.7343 3.329 29.1101 1.9974 27.8617C0.6658 26.6134 0 24.8292 0 22.5093V21.0425H3.96359V22.5249C3.96359 23.7213 4.26528 24.6368 4.86866 25.2714C5.48244 25.8956 6.29909 26.2077 7.3186 26.2077C8.3485 26.2077 9.16515 25.8956 9.76853 25.2714C10.3823 24.6368 10.6892 23.7213 10.6892 22.5249V6.15564H14.8244V22.5718C14.8244 24.8709 14.1482 26.6394 12.7958 27.8774C11.4538 29.1153 9.64369 29.7343 7.36541 29.7343Z" />
              <path d="M20.052 28.4314C21.6957 29.4405 23.5891 29.945 25.7321 29.945C27.6879 29.945 29.4304 29.5341 30.9597 28.7122C32.489 27.88 33.6905 26.7356 34.5644 25.2792C35.4486 23.8228 35.8908 22.1531 35.8908 20.2701V17.945H26.4187V21.2063H31.796C31.7221 22.1012 31.4641 22.9023 31.0221 23.6095C30.502 24.4418 29.7894 25.092 28.8843 25.5601C27.9896 26.0178 26.9701 26.2467 25.8258 26.2467C24.4317 26.2467 23.2198 25.9086 22.1899 25.2324C21.1704 24.5458 20.3797 23.5835 19.818 22.3455C19.2562 21.0972 18.9753 19.6355 18.9753 17.9606C18.9753 16.2753 19.251 14.8137 19.8024 13.5757C20.3641 12.3273 21.1548 11.3598 22.1743 10.6732C23.1938 9.98662 24.4005 9.64332 25.7946 9.64332C27.2822 9.64332 28.5358 10.049 29.5553 10.8605C30.5852 11.6615 31.2458 12.7174 31.5371 14.0282H35.7347C35.5059 12.4262 34.9233 11.0217 33.987 9.81497C33.0611 8.5978 31.8804 7.65112 30.4447 6.97492C29.0091 6.28831 27.4226 5.94501 25.6853 5.94501C23.6047 5.94501 21.7425 6.43916 20.0988 7.42745C18.4656 8.41575 17.1756 9.80977 16.2289 11.6095C15.2926 13.4092 14.8245 15.5263 14.8245 17.9606C14.8245 20.3325 15.2822 22.4184 16.1977 24.2181C17.1236 26.0178 18.4083 27.4223 20.052 28.4314Z" />
            </svg>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-500 dark:text-zinc-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars2Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm/6 font-medium text-zinc-950 dark:text-white">
              {item.name}
            </a>
          ))}
        </div>
      </nav>
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
