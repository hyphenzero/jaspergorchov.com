import { ChevronRightIcon, MegaphoneIcon } from '@heroicons/react/16/solid'
import Link from "next/link"

export function Banner() {
  return (
    <div className="@container flex w-full justify-start pl-2 sm:pl-8">
      <Link
        href="/blog/my-personal-website-reimagined"
        className="group relative flex flex-nowrap items-center gap-2 overflow-hidden rounded-full px-3.25 py-2.25 text-xs/4 whitespace-nowrap ring ring-zinc-950/10 transition ring-inset hover:bg-zinc-950/2 hover:ring-zinc-950/17 @max-[22rem]:hidden dark:ring-white/7.5 dark:hover:bg-white/2 dark:hover:ring-white/10"
      >
        <div className="absolute left-0 aspect-square h-full bg-sky-500/60 blur-2xl dark:bg-sky-400/40"></div>
        <MegaphoneIcon className="size-4 fill-sky-500 dark:fill-sky-400" />
        <span className="font-medium text-zinc-950 dark:text-white">My personal website, reimagined</span>
        <ChevronRightIcon className="-mx-1 size-4 fill-zinc-950/30 transition group-hover:translate-x-0.5 group-hover:fill-zinc-950/50 dark:fill-white/30 dark:group-hover:fill-white/50" />
      </Link>
    </div>
  )
}
