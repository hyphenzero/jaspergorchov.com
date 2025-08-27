import { ChevronRightIcon, MegaphoneIcon } from '@heroicons/react/16/solid'

interface BannerProps {
  latestTitle: string
  latestUrl: string
}

export function Banner({ latestTitle, latestUrl }: BannerProps) {
  return (
    <div className="@container flex w-full justify-start pl-2 sm:pl-8">
      <a
        href={latestUrl}
        className="relative overflow-hidden flex flex-nowrap items-center gap-2 rounded-full px-3.25 py-2.25 text-xs/4 whitespace-nowrap ring ring-inset ring-zinc-950/10 transition hover:bg-zinc-950/2 hover:ring-zinc-950/17 @max-[22rem]:hidden dark:ring-white/7.5 dark:hover:bg-white/2 dark:hover:ring-white/10"
			>
				<div className="absolute aspect-square h-full bg-sky-500/60 dark:bg-sky-400/40 blur-2xl left-0"></div>
        <MegaphoneIcon className="size-4 fill-sky-500 dark:fill-sky-400" />
        <span className="font-medium text-zinc-950 dark:text-white">{latestTitle}</span>
        <ChevronRightIcon className="-mx-1 size-4 fill-zinc-950/30 dark:fill-white/30" />
      </a>
    </div>
  )
}
