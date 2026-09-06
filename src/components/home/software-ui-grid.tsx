import { WebsitesBrowserEditor } from '@/components/home/websites-browser-editor'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/tooltip'
import { TypeScript } from '@ridemountainpig/svgl-react'
import { clsx } from 'clsx'
import Image from 'next/image'
import type { ReactNode, SVGProps } from 'react'

function RustIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  )
}

function SwiftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  )
}

function TauriIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  )
}

function NextjsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
    </svg>
  )
}

function TailwindIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zM6.001 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
    </svg>
  )
}

function VercelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 -2 24 24" fill="currentColor">
      <path d="m12 1.608 12 20.784H0Z" />
    </svg>
  )
}

function ThreejsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.38 0a.268.268 0 0 0-.256.332l2.894 11.716a.268.268 0 0 0 .01.04l2.89 11.708a.268.268 0 0 0 .447.128L23.802 7.15a.268.268 0 0 0-.112-.45l-5.784-1.667a.268.268 0 0 0-.123-.035L6.38 1.715a.268.268 0 0 0-.144-.04L.456.01A.268.268 0 0 0 .38 0zm.374.654L5.71 2.08 1.99 5.664zM6.61 2.34l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.877-1.4zm6.28 1.538l4.878 1.404-3.662 3.53zm-.52.13l1.208 4.9-4.853-1.392zm6.3 1.534l4.947 1.424-3.715 3.574zm-.524.12l1.215 4.926-4.876-1.398zm-15.432.696l4.964 1.424-3.726 3.586zM8.047 8.15l4.877 1.4-3.66 3.527zm-.518.137l1.236 5.017-4.963-1.432zm6.274 1.535l4.965 1.425-3.73 3.586zm-.52.127l1.235 5.012-4.958-1.43zm-9.63 2.438l4.873 1.406-3.656 3.523zm5.854 1.687l4.863 1.403-3.648 3.51zm-.54.04l1.214 4.927-4.875-1.4zm-3.896 4.02l5.037 1.442-3.782 3.638z" />
    </svg>
  )
}

function BlenderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 0 1-2.374.938 3.393 3.393 0 0 1-2.376-.938c-.58-.567-.91-1.33-.865-2.152M7.35 14.831c.006.314.106.922.256 1.398a7.372 7.372 0 0 0 1.593 2.757 8.227 8.227 0 0 0 2.787 2.001 8.947 8.947 0 0 0 3.66.76 8.964 8.964 0 0 0 3.657-.772 8.285 8.285 0 0 0 2.785-2.01 7.428 7.428 0 0 0 1.592-2.762 6.964 6.964 0 0 0 .25-3.074 7.123 7.123 0 0 0-1.016-2.779 7.764 7.764 0 0 0-1.852-2.043h.002L13.566 2.55l-.02-.015c-.492-.378-1.319-.376-1.86.002-.547.382-.609 1.015-.123 1.415l-.001.001 3.126 2.543-9.53.01h-.013c-.788.001-1.545.518-1.695 1.172-.154.665.38 1.217 1.2 1.22V8.9l4.83-.01-8.62 6.617-.034.025c-.813.622-1.075 1.658-.563 2.313.52.667 1.625.668 2.447.004L7.414 14s-.069.52-.063.831zm12.09 1.741c-.97.988-2.326 1.548-3.795 1.55-1.47.004-2.827-.552-3.797-1.538a4.51 4.51 0 0 1-1.036-1.622 4.282 4.282 0 0 1 .282-3.519 4.702 4.702 0 0 1 1.153-1.371c.942-.768 2.141-1.183 3.396-1.185 1.256-.002 2.455.41 3.398 1.175.48.391.87.854 1.152 1.367a4.28 4.28 0 0 1 .522 1.706 4.236 4.236 0 0 1-.239 1.811 4.54 4.54 0 0 1-1.035 1.626" />
    </svg>
  )
}

function NeonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 0V24l-9.365-8.045V24H0V0ZM2.942 21.087h8.751V9.563l9.365 8.204V2.919L2.942 2.914Z" />
    </svg>
  )
}

type Tool = {
  icon?: 'typescript' | 'rust' | 'swift' | 'tauri' | 'nextjs' | 'tailwind' | 'vercel' | 'threejs' | 'blender' | 'neon'
  name: string
}

const tools = {
  websites: [
    { name: 'Next.js', icon: 'nextjs' as const },
    { name: 'Tailwind CSS', icon: 'tailwind' as const },
    { name: 'Vercel', icon: 'vercel' as const },
  ],
  desktop: [
    { name: 'Rust (GPUI)', icon: 'rust' as const },
    { name: 'Swift', icon: 'swift' as const },
  ],
  mobile: [{ name: 'Swift', icon: 'swift' as const }],
  developerTools: [{ name: 'TypeScript', icon: 'typescript' as const }],
}

const descriptions = {
  websites: 'Responsive, performant sites and web apps — crafted with a focus on design, speed, and UX.',
  desktop: 'Native desktop apps built with Rust (GPUI) and Swift for maximum performance and platform integration.',
  mobile: 'iOS apps written in Swift and SwiftUI — fluid, platform-native experiences.',
  developerTools: 'Reusable frameworks and tooling that make building faster and more consistent.',
}

function TechnologyIcons({ items }: { items: Tool[] }) {
  const icons = {
    typescript: TypeScript,
    rust: RustIcon,
    swift: SwiftIcon,
    tauri: TauriIcon,
    nextjs: NextjsIcon,
    tailwind: TailwindIcon,
    vercel: VercelIcon,
    threejs: ThreejsIcon,
    blender: BlenderIcon,
    neon: NeonIcon,
  } as const

  const iconColors = {
    rust: 'text-orange-400 dark:text-orange-400',
    swift: 'text-orange-400 dark:text-orange-400',
    tailwind: 'text-sky-400 dark:text-sky-400',
    nextjs: 'text-zinc-900 dark:text-white',
    vercel: 'text-zinc-900 dark:text-white',
    tauri: 'text-teal-400 dark:text-teal-400',
    threejs: 'text-zinc-900 dark:text-white',
    blender: 'text-orange-500 dark:text-orange-500',
    neon: 'text-emerald-400 dark:text-emerald-400',
    typescript: 'text-blue-500 dark:text-blue-400',
  } as const

  return (
    <div className="flex gap-1.5">
      {items.map((tool) => {
        const Icon = tool.icon ? icons[tool.icon] : null
        const colorClass = tool.icon ? iconColors[tool.icon] : ''
        return (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <span className="group grid size-6 cursor-default place-items-center">
                <span className="transition-transform duration-150 group-data-[state=delayed-open]:-translate-y-1 group-data-[state=instant-open]:-translate-y-1">
                  {Icon ? (
                    <Icon className={`size-4 ${colorClass}`} />
                  ) : null}
                </span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={10}>
              {tool.name}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

function MockupSurface({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
      {children}
    </div>
  )
}

function WindowControls() {
  return (
    <div className="flex gap-1">
      <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
    </div>
  )
}

function WebsiteMockup() {
  return (
    <MockupSurface>
      <div className="flex items-end gap-2 border-b border-zinc-950/10 pb-2 dark:border-white/10">
        <WindowControls />
        <div className="h-3 w-16 rounded-t bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-3 w-12 rounded-t bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="size-2 rounded-full border border-zinc-300 dark:border-zinc-600" />
        <div className="size-2 rounded-full border border-zinc-300 dark:border-zinc-600" />
        <div className="h-3 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="mt-3 grid flex-1 grid-cols-[1.2fr_1fr] grid-rows-[auto_1fr] gap-x-3 gap-y-2">
        <div className="rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="row-span-2 rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-2 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2 w-3/5 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-2 w-2/3 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
    </MockupSurface>
  )
}

function DesktopMockup() {
  return (
    <div className="relative h-full perspective-distant transform-3d translate-x-10 translate-y-0 rotate-x-50 -rotate-z-30 rotate-y-20">
      <div className="absolute inset-0 w-300 h-300 transform-3d rounded-lg bg-zinc-100 dark:bg-zinc-950 transform-gpu" />
      <div className="relative z-10 -translate-y-2 transform-3d transform-gpu">
        <div className="flex items-center gap-3 border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 backdrop-blur-sm shadow-xl" style={{ backgroundColor: 'rgb(255 255 255 / 0.8)' }}>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="size-3 rounded-full bg-red-400 ring-1 ring-inset" style={{ boxShadow: 'inset 0 0 0 1px rgb(9 9 11 / 0.05)' }} />
            <span className="size-3 rounded-full bg-yellow-400 ring-1 ring-inset" style={{ boxShadow: 'inset 0 0 0 1px rgb(9 9 11 / 0.05)' }} />
            <span className="size-3 rounded-full bg-green-400 ring-1 ring-inset" style={{ boxShadow: 'inset 0 0 0 1px rgb(9 9 11 / 0.05)' }} />
          </div>
          <div className="mx-auto ml-1 px-8 flex min-w-0 items-center gap-2 rounded-full bg-white py-1.5 text-xs text-zinc-500 shadow-sm ring-1" style={{ boxShadow: '0 0 0 1px rgb(9 9 11 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
            <span className="hidden truncate sm:inline">Project.app</span>
          </div>
        </div>
        <div className="absolute -left-2 -top-8 w-36 -translate-y-3 transform-gpu">
          <div className="rounded-lg border border-zinc-200 p-2 dark:border-zinc-900 backdrop-blur-sm shadow-2xl" style={{ backgroundColor: 'rgb(255 255 255 / 0.9)' }}>
            <div className="mb-3 px-2">
              <div className="h-1.5 w-10 rounded-full bg-zinc-900 dark:bg-white" />
            </div>
            <nav className="space-y-1">
              <div className="flex items-center gap-2 rounded-md bg-zinc-900 px-2 py-1.5 dark:bg-white">
                <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-medium text-white dark:text-zinc-900">Inbox</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1.5 dark:bg-zinc-800">
                <span className="size-1.5 shrink-0 rounded-full bg-sky-500" />
                <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">Projects</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1.5 dark:bg-zinc-800">
                <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
                <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">Today</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1.5 dark:bg-zinc-800">
                <span className="size-1.5 shrink-0 rounded-full bg-violet-500" />
                <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">Team</span>
              </div>
            </nav>
            <div className="mt-auto pt-2 border-t border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1.5 dark:bg-zinc-800">
                <span className="size-1.5 shrink-0 rounded-full bg-zinc-400" />
                <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">Settings</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-2 -top-8 w-[calc(100%+1.5rem)] -translate-y-4 transform-gpu">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-900 backdrop-blur-sm shadow-2xl ml-36" style={{ backgroundColor: 'rgb(255 255 255 / 0.9)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="h-4 w-24 rounded-full bg-zinc-900 dark:bg-white" />
                <div className="h-2 w-32 rounded-full bg-zinc-400 dark:bg-zinc-600" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full border border-zinc-300 dark:border-zinc-600" />
                <div className="h-2 w-2 rounded-full border border-zinc-300 dark:border-zinc-600" />
                <div className="h-2 w-2 rounded-full border border-zinc-300 dark:border-zinc-600" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 dark:bg-white">
                <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="flex-1 space-y-1">
                  <span className="block h-1.5 w-3/4 rounded-full" style={{ backgroundColor: 'rgb(255 255 255 / 0.9)' }} />
                  <span className="block h-1 w-1/2 rounded-full" style={{ backgroundColor: 'rgb(255 255 255 / 0.5)' }} />
                </span>
                <span className="size-2 shrink-0 rounded-full border" style={{ borderColor: 'rgb(255 255 255 / 0.7)' }} />
              </div>
              <div className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                <span className="size-2 shrink-0 rounded-full bg-sky-500" />
                <span className="flex-1 space-y-1">
                  <span className="block h-1.5 w-3/4 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <span className="block h-1 w-1/2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                </span>
                <span className="size-2 shrink-0 rounded-full border border-zinc-400 dark:border-zinc-500" />
              </div>
              <div className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                <span className="size-2 shrink-0 rounded-full bg-amber-500" />
                <span className="flex-1 space-y-1">
                  <span className="block h-1.5 w-3/4 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <span className="block h-1 w-1/2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                </span>
                <span className="size-2 shrink-0 rounded-full border border-zinc-400 dark:border-zinc-500" />
              </div>
              <div className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                <span className="size-2 shrink-0 rounded-full bg-violet-500" />
                <span className="flex-1 space-y-1">
                  <span className="block h-1.5 w-3/4 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <span className="block h-1 w-1/2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                </span>
                <span className="size-2 shrink-0 rounded-full border border-zinc-400 dark:border-zinc-500" />
              </div>
              <div className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                <span className="size-2 shrink-0 rounded-full bg-rose-500" />
                <span className="flex-1 space-y-1">
                  <span className="block h-1.5 w-3/4 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <span className="block h-1 w-1/2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                </span>
                <span className="size-2 shrink-0 rounded-full border border-zinc-400 dark:border-zinc-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function IPhoneAppUi() {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="flex items-center justify-between px-2 pt-1.5">
        <span className="text-[5px] font-semibold text-zinc-900 dark:text-zinc-100">9:41</span>
        <span className="flex items-center gap-0.5">
          <span className="h-1 w-1 rounded-full bg-zinc-900 dark:bg-zinc-100" />
          <span className="h-1 w-2 rounded-sm bg-zinc-900 dark:bg-zinc-100" />
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between px-2">
        <div className="space-y-1">
          <div className="h-1.5 w-10 rounded-full bg-zinc-900 dark:bg-white" />
          <div className="h-1 w-7 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <div className="size-4 rounded-full bg-linear-to-br from-zinc-400 to-zinc-600" />
      </div>
      <div className="mx-2 mt-1.5 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800" />
      <div className="mt-1.5 space-y-1 px-2">
        {['bg-emerald-500', 'bg-sky-500', 'bg-amber-500'].map((dot, index) => (
          <div
            key={dot}
            className={
              index === 0
                ? 'flex items-center gap-1.5 rounded-md bg-zinc-900 p-1.5 dark:bg-white'
                : 'flex items-center gap-1.5 rounded-md bg-zinc-100 p-1.5 dark:bg-zinc-800'
            }
          >
            <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
            <span className="flex-1 space-y-1">
              <span
                className={
                  index === 0
                    ? 'block h-1 w-4/5 rounded-full bg-white/90 dark:bg-zinc-900/90'
                    : 'block h-1 w-4/5 rounded-full bg-zinc-400 dark:bg-zinc-500'
                }
              />
              <span
                className={
                  index === 0
                    ? 'block h-1 w-3/5 rounded-full bg-white/50 dark:bg-zinc-900/50'
                    : 'block h-1 w-3/5 rounded-full bg-zinc-300 dark:bg-zinc-600'
                }
              />
            </span>
            <span
              className={
                index === 0
                  ? 'size-2 shrink-0 rounded-full border border-white/70 dark:border-zinc-900/70'
                  : 'size-2 shrink-0 rounded-full border border-zinc-400 dark:border-zinc-500'
              }
            />
          </div>
        ))}
      </div>
      <div className="mx-2 mt-1 rounded-md bg-zinc-100 p-1.5 dark:bg-zinc-800">
        <div className="h-1 w-1/2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-300 dark:bg-zinc-700">
          <div className="h-full w-2/3 rounded-full bg-zinc-900 dark:bg-white" />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-around border-t border-zinc-950/10 px-2 py-1.5 dark:border-white/10">
        <span className="size-1.5 rounded-full bg-zinc-900 dark:bg-white" />
        <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>
    </div>
  )
}

function IPadAppUi() {
  return (
    <div className="flex h-full bg-white dark:bg-zinc-950">
      <div className="flex w-[30%] flex-col gap-1 bg-zinc-50 p-1.5 dark:bg-zinc-900">
        <div className="h-1.5 w-2/3 rounded-full bg-zinc-900 dark:bg-white" />
        <div className="mt-1 space-y-1">
          <div className="h-2.5 rounded bg-zinc-900 dark:bg-white" />
          <div className="h-2.5 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2.5 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2.5 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="mt-auto flex items-center gap-1">
          <div className="size-2 rounded-full bg-linear-to-br from-zinc-400 to-zinc-600" />
          <div className="h-1 w-2/3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-1.5">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-1/3 rounded-full bg-zinc-900 dark:bg-white" />
          <div className="h-2.5 w-8 rounded-full bg-zinc-900 dark:bg-white" />
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          <div className="h-7 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-7 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-7 rounded bg-zinc-900 p-1 dark:bg-white">
            <div className="h-1 w-2/3 rounded-full bg-white/80 dark:bg-zinc-900/80" />
            <div className="mt-1 h-1 w-1/2 rounded-full bg-white/50 dark:bg-zinc-900/50" />
          </div>
        </div>
        <div className="mt-1 flex-1 space-y-1 rounded bg-zinc-50 p-1 dark:bg-zinc-900">
          <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-1 w-11/12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-1 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  )
}

function MobileMockup() {
  return (
    <div className="flex h-full items-center justify-center px-6 pb-8" aria-hidden="true">
      <div className="flex items-end justify-center">
        <div
          className="relative h-52 shrink-0 drop-shadow-xl sm:h-56 lg:h-52 xl:h-56"
          style={{ aspectRatio: '2640 / 1880' }}
        >
          <div className="absolute top-[5%] right-[3.2%] bottom-[5%] left-[3.2%] overflow-hidden rounded-[3px] bg-white dark:bg-zinc-950">
            <IPadAppUi />
          </div>
          <Image
            src="/ipad-bezel.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 280px, 320px"
            className="pointer-events-none absolute inset-0 h-full w-full object-fill select-none"
            draggable={false}
          />
        </div>
        <div
          className="relative z-10 -ml-8 h-44 shrink-0 drop-shadow-xl sm:h-48 lg:h-44 xl:h-48"
          style={{ aspectRatio: '1350 / 2760' }}
        >
          <div className="absolute top-[1.8%] right-[4%] bottom-[1.8%] left-[4%] overflow-hidden rounded-[14px] bg-white dark:bg-zinc-950">
            <IPhoneAppUi />
          </div>
          <Image
            src="/iphone-bezel.png"
            alt=""
            fill
            sizes="130px"
            className="pointer-events-none absolute inset-0 h-full w-full object-fill select-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}

function DeveloperToolsMockup() {
  return (
    <MockupSurface>
      <div className="flex items-center gap-2 border-b border-zinc-950/10 pb-2.5 dark:border-white/10">
        <WindowControls />
        <div className="h-2 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="mt-3 grid flex-1 grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
        <div className="h-3/5 rounded border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-800" />
        <div className="h-px w-3 bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-4/5 rounded border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-800" />
        <div className="h-px w-3 bg-zinc-300 dark:bg-zinc-600" />
        <div className="h-3/5 rounded border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-800" />
      </div>
    </MockupSurface>
  )
}

type Bleed = {
  right?: boolean
  bottom?: boolean
}

function BentoCard({
  title,
  tools,
  description,
  children,
  bleed,
  className,
}: {
  title: string
  tools: Tool[]
  description: string
  children: ReactNode
  bleed?: Bleed
  className?: string
}) {
  const clipRight = bleed?.right
  const clipBottom = bleed?.bottom

  return (
    <div
      className={clsx(
        'relative flex flex-col rounded-2xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-2xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline',
        className
      )}
    >
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-[15px] font-semibold tracking-tight text-zinc-950 dark:text-white">{title}</h3>
          <TechnologyIcons items={tools} />
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>

      <div className="relative mt-6 flex-1 overflow-hidden rounded-2xl">
        <div className={clsx('h-full', clipRight ? 'ml-3' : 'mx-3', clipBottom ? 'pb-0' : 'pb-3')}>
          <div className={clsx('h-full', clipRight && '-mr-6 sm:-mr-8', clipBottom && '-mb-6 sm:-mb-8')}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SoftwareUiGrid() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-12">
        <BentoCard
          title="Websites"
          tools={tools.websites}
          description={descriptions.websites}
          className="lg:col-span-7 min-h-95"
        >
          <WebsitesBrowserEditor />
        </BentoCard>

        <BentoCard
          title="Desktop Apps"
          tools={tools.desktop}
          description={descriptions.desktop}
          bleed={{ right: true, bottom: true }}
          className="lg:col-span-5 min-h-95"
        >
          <DesktopMockup />
        </BentoCard>

        <BentoCard
          title="Mobile Apps"
          tools={tools.mobile}
          description={descriptions.mobile}
          bleed={{ bottom: true }}
          className="lg:col-span-6 min-h-85"
        >
          <MobileMockup />
        </BentoCard>

        <BentoCard
          title="Developer Tools"
          tools={tools.developerTools}
          description={descriptions.developerTools}
          bleed={{ right: true }}
          className="lg:col-span-6 min-h-85"
        >
          <DeveloperToolsMockup />
        </BentoCard>
      </div>
    </TooltipProvider>
  )
}
