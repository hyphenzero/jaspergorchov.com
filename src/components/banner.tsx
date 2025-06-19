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
        className="flex flex-nowrap items-center gap-2 rounded-full px-3 py-2 text-xs/4 whitespace-nowrap ring ring-zinc-950/8 hover:bg-zinc-950/2 hover:ring-zinc-950/10 @max-[22rem]:hidden dark:ring-white/8 dark:hover:bg-white/2 dark:hover:ring-white/10 transition"
      >
        <MegaphoneIcon className="size-4 fill-sky-500 dark:fill-sky-400" />
        <span className="font-medium">{latestTitle}</span>
        <span className="size-0.75 rounded-full bg-current/50" />
        <div className="flex gap-0.5">
          <span>Learn more</span>
          <ChevronRightIcon className="-mr-1 size-4 fill-zinc-950/30 dark:fill-white/30" />
        </div>
      </a>
    </div>
  )
}
