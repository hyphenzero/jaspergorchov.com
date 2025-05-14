import { Button } from '@/components/button'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

export default function Home() {
  return (
    <>
      <div className="mx-auto grid h-[calc(100vh-5.5rem)] grid-cols-5 gap-8 p-6 pb-8 sm:h-[calc(100vh-5.25rem)] lg:px-8">
        <div className="col-span-2 flex size-full flex-col justify-between">
          <div className="space-y-8">
            <h1 className="text-6xl tracking-tighter text-pretty sm:text-8xl">Jasper Gorchov</h1>
            <p className="max-w-2xl text-lg/7 font-medium text-pretty text-zinc-600 dark:text-zinc-400">
              I’m a 14-year-old developer, designer, and 3D artist with immense attention to detail and a love of
              minimalism.
            </p>
          </div>
          <div className="flex gap-x-4 *:w-full">
            <Button href="/projects" color="dark/white">
              Browse work <ChevronRightIcon className="translate-y-px" />
            </Button>
            <Button href="/blog" outline>
              Read blog <ChevronRightIcon className="translate-y-px" />
            </Button>
          </div>
        </div>
        <div className="col-span-3 size-full rounded-3xl bg-zinc-900/50" />
      </div>
    </>
  )
}
