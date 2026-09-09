import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronUpDownIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  SparklesIcon,
  Squares2X2Icon,
} from '@heroicons/react/16/solid'
import { IpadBezelSvg, IphoneBezelSvg } from '@/components/home/device-bezels'
import { Logo } from '@/components/logo'
import { WebsitesBrowserEditor } from '@/components/home/websites-browser-editor'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/tooltip'
import { getHighlighter } from '@/lib/shiki'
import { RustDark, RustLight, TypeScript } from '@ridemountainpig/svgl-react'
import { clsx } from 'clsx'
import Image from 'next/image'
import type { ReactNode, SVGProps } from 'react'

function RustIcon(props: SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props
  const dark = typeof className === 'string' && className.includes('dark')
  const Light = RustLight as unknown as (p: Record<string, unknown>) => React.ReactNode
  const Dark = RustDark as unknown as (p: Record<string, unknown>) => React.ReactNode
  // Render both and let CSS dark-mode toggle them — svgl ships them as
  // separate colored assets.
  return (
    <>
      <span className="contents dark:hidden">
        <Light {...rest} className={className} />
      </span>
      <span className="contents hidden dark:contents">
        <Dark {...rest} className={className} />
      </span>
    </>
  )
}

// Bird-only Swift mark. Simple Icons' Swift glyph is the rounded-square app
// icon, so this is just its inner bird subpath re-rooted to an absolute
// moveto (previous subpath starts at 7.508,0, so m6.035 3.41 === M13.543 3.41).
function SwiftBirdIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.543 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z" />
    </svg>
  )
}

const SwiftIcon = SwiftBirdIcon

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
  desktop: 'Performant, native apps built with Rust & GPUI or Swift.',
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
                  {Icon ? <Icon className={`size-4 ${colorClass}`} /> : null}
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

const DESKTOP_SIDEBAR: { label: string; icon: 'back' | 'search' | 'overview' | 'tasks' | 'docs' | 'agent'; active?: boolean }[] = [
  { label: 'Projects', icon: 'back' },
  { label: 'Search', icon: 'search' },
  { label: 'Overview', icon: 'overview', active: true },
  { label: 'Tasks', icon: 'tasks' },
  { label: 'Documents', icon: 'docs' },
  { label: 'Agent', icon: 'agent' },
]

function DesktopMockup() {
  return (
    <div className="flex h-[calc(100%+3rem)] w-[calc(100%+3rem)] flex-col overflow-hidden rounded-xl text-zinc-900 ring-1 ring-zinc-950/10 dark:text-zinc-100 dark:ring-white/10">
      {/* Title bar */}
      <div className="relative flex items-center border-b border-zinc-950/10 px-4 py-3 dark:border-white/10">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-6 shrink-0 text-xs font-medium text-zinc-700 dark:text-zinc-200">hyphenzero</span>
        <ChevronUpDownIcon className="ml-1.5 size-3 shrink-0 text-zinc-400" />
        <span className="shrink-0 ml-2 text-xs text-zinc-300 dark:text-zinc-600">/</span>
        <span className="truncate ml-3 text-xs font-medium text-zinc-700 dark:text-zinc-200">Relay</span>
        <ChevronUpDownIcon className="ml-1.5 size-3 shrink-0 text-zinc-400" />
      </div>
      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="flex w-36 shrink-0 flex-col border-r border-zinc-950/10 px-2.5 py-3 dark:border-white/10">
          <nav className="space-y-1">
            {DESKTOP_SIDEBAR.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${
                  item.active ? 'bg-zinc-950/5 dark:bg-white/10' : ''
                }`}
              >
                {item.icon === 'back' && <ChevronLeftIcon className="size-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />}
                {item.icon === 'search' && <MagnifyingGlassIcon className="size-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />}
                {item.icon === 'overview' && <Squares2X2Icon className="size-3.5 shrink-0 text-zinc-700 dark:text-zinc-100" />}
                {item.icon === 'tasks' && <CheckCircleIcon className="size-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />}
                {item.icon === 'docs' && <PencilSquareIcon className="size-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />}
                {item.icon === 'agent' && <SparklesIcon className="size-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />}
                <span className={`flex-1 truncate text-xs ${item.active ? 'font-medium text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'}`}>
                  {item.label}
                </span>
                {item.icon === 'search' && <span className="shrink-0 text-[10px] text-zinc-400 dark:text-zinc-600">⌘K</span>}
              </div>
            ))}
          </nav>
        </aside>
        {/* Main content */}
        <div className="min-w-0 flex-1 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="size-4 shrink-0 rounded-[5px] bg-[#2f7cf6]" />
            <span className="truncate text-xs font-semibold tracking-tight text-zinc-900 dark:text-white">Relay</span>
            <span className="shrink-0 rounded-full bg-zinc-950/5 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">In Progress</span>
          </div>
          <p className="mt-2 truncate text-xs text-zinc-500">Usage-based billing, trials and onboarding</p>
          {/* AI — up to one glanceable line */}
          <p className="mt-5 truncate text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Next</span>
            <span className="mx-2 text-zinc-300 dark:text-zinc-600">·</span>
            <span>Retry billing on the 3 flagged trials</span>
          </p>
          {/* Tasks */}
          <div className="mt-6 divide-y divide-zinc-950/[0.04] dark:divide-white/[0.06]">
            {[
              { title: 'Fix proration on plan change', meta: 'Billing', done: true },
              { title: 'Backfill trial events', meta: 'Engineering', done: false },
            ].map((task) => (
              <div key={task.title} className="flex items-center gap-2.5 py-2.5">
                {task.done ? (
                  <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-zinc-900 text-[8px] text-white dark:bg-zinc-100 dark:text-black">
                    ✓
                  </span>
                ) : (
                  <span className="size-3.5 shrink-0 rounded-full border border-zinc-300 dark:border-zinc-600" />
                )}
                <span className="min-w-0 flex-1 truncate text-xs text-zinc-600 dark:text-zinc-300">{task.title}</span>
                <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">{task.meta}</span>
              </div>
            ))}
          </div>
          {/* Documents */}
          <div className="mt-6 divide-y divide-zinc-950/[0.04] dark:divide-white/[0.06]">
            {[
              { title: 'Pricing RFC', meta: 'Spec' },
              { title: 'Onboarding copy v2', meta: 'Draft' },
            ].map((doc) => (
              <div key={doc.title} className="flex items-center gap-2.5 py-2.5">
                <DocumentIcon className="size-3.5 shrink-0 text-zinc-300 dark:text-zinc-500" />
                <span className="min-w-0 flex-1 truncate text-xs text-zinc-600 dark:text-zinc-300">{doc.title}</span>
                <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">{doc.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Your 15 markers, snapped to the exact anchor points of the 673×457 Logo
// path (segment endpoints, in path order). Sizing/positioning stays dynamic
// (cqw + % with -translate-1/2).
const LOGO_POINTS: [number, number][] = [
  [71.1, 0.0],
  [99.6, 33.7],
  [71.5, 84.5],
  [73.2, 63.5],
  [73.2, 50.0],
  [100.0, 50.0],
  [71.3, 99.9],
  [41.9, 69.9],
  [20.8, 99.7],
  [0.0, 63.6],
  [11.2, 63.6],
  [20.7, 85.1],
  [30.2, 1.6],
  [41.9, 1.6],
  [41.9, 32.9],
]

function LogoGuideScreen() {
  // One shared "image", rendered in code: a single centered artwork box
  // sized in cqw against the MobileMockup @container, so both screens show
  // the same pixels at the same scale — the iPhone is just a tighter center
  // crop of the iPad view. The box is an exact multiple of the grid cell on
  // both axes with left/top-anchored tiling, so a grid line always lands on
  // the box center (and the logo center) in both screens. Grid spacing = the
  // iPad screen's old 25% cells, logo guides = the logo bounding box
  // (14cqw × 9.5cqw) centered.
  const logoHalfW = '7cqw'
  const logoHalfH = '4.75cqw'
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 h-[73.068cqw] w-[106.704cqw] -translate-x-1/2 -translate-y-1/2">
        <div
          aria-hidden
          className="absolute inset-0 text-zinc-950/10 dark:text-white/15"
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 17.784cqw)',
            backgroundPosition: '8.892cqw top',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 text-zinc-950/10 dark:text-white/15"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 12.178cqw)',
            backgroundPosition: 'left 6.089cqw',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* cqw (not %) so the logo renders at the same px size in both
              the iPad and iPhone screens — both resolve against the shared
              @container ancestor in MobileMockup. */}
          <div className="relative w-[14cqw]">
            <Logo outline className="block h-auto w-full" />
            {LOGO_POINTS.map(([x, y], i) => (
              <span
                key={i}
                aria-hidden
                className="absolute aspect-square w-[5%] -translate-x-1/2 -translate-y-1/2 bg-zinc-900 dark:bg-white"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="absolute right-0 left-0 h-px bg-zinc-950/10 dark:bg-white/15"
          style={{ top: `calc(50% - ${logoHalfH})` }}
        />
        <div
          aria-hidden
          className="absolute right-0 left-0 h-px bg-zinc-950/10 dark:bg-white/15"
          style={{ top: `calc(50% + ${logoHalfH})` }}
        />
        <div
          aria-hidden
          className="absolute top-0 bottom-0 w-px bg-zinc-950/10 dark:bg-white/15"
          style={{ left: `calc(50% - ${logoHalfW})` }}
        />
        <div
          aria-hidden
          className="absolute top-0 bottom-0 w-px bg-zinc-950/10 dark:bg-white/15"
          style={{ left: `calc(50% + ${logoHalfW})` }}
        />
      </div>
    </div>
  )
}

function MobileMockup() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      {/* Width-driven: heights follow from aspect ratios, so the pair scales
          like an image at a constant % of the card and never clips.
          @container lets both LogoGuideScreens size their logos in cqw
          so they render identically at any viewport size. */}
      <div className="flex w-[86%] items-end justify-center @container">
        <div className="relative w-[76%] shrink-0" style={{ aspectRatio: '2640 / 1880' }}>
          <div className="absolute top-[5%] right-[3.2%] bottom-[5%] left-[3.2%] overflow-hidden rounded-[3px] bg-white dark:bg-zinc-900">
            <LogoGuideScreen />
          </div>
          <IpadBezelSvg className="pointer-events-none absolute inset-0 h-full w-full select-none" />
        </div>
        <div className="relative z-10 -ml-[7%] w-[24%] shrink-0" style={{ aspectRatio: '441 / 906' }}>
          <div className="absolute top-[1.8%] right-[4%] bottom-[1.8%] left-[4%] overflow-hidden rounded-[14px] bg-white dark:bg-zinc-900">
            <LogoGuideScreen />
          </div>
          <IphoneBezelSvg className="pointer-events-none absolute inset-0 h-full w-full select-none" />
        </div>
      </div>
    </div>
  )
}

const TOWER_CODE = `import { gatehouse } from '@towerjs/gatehouse'
import { defineTower, env } from '@towerjs/tower/blueprint'
import { vault } from '@towerjs/vault'

export default defineTower({
  modules: [
    vault({
      provider: 'neon',
      connectionString: env.string('DATABASE_URL'),
    }),
    gatehouse({
      provider: 'better-auth',
    }),
  ],
})`

async function TowerCode() {
  const highlighter = await getHighlighter()
  const html = highlighter.codeToHtml(TOWER_CODE, {
    lang: 'ts',
    themes: { light: 'theme-light', dark: 'theme-dark' },
  })
  return (
    <div
      className="font-mono text-xs/6 [&_code]:bg-transparent [&_.shiki]:bg-transparent! [&_.shiki_span]:dark:text-(--shiki-dark)! [&_pre]:bg-transparent! [&_pre]:p-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function DeveloperToolsMockup() {
  return (
    <div className="flex h-full flex-col rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10">
      <div className="relative flex items-center gap-4 px-3 py-1 sm:px-4">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="size-3 rounded-full bg-red-400 ring-1 ring-white/10 ring-inset" />
          <span className="size-3 rounded-full bg-yellow-400 ring-1 ring-white/10 ring-inset" />
          <span className="size-3 rounded-full bg-green-400 ring-1 ring-white/10 ring-inset" />
        </div>
        <div className="not-dark:ring-1 not-dark:ring-zinc-950/5 flex min-w-0 items-center gap-2 rounded-lg bg-white/70 px-5 py-1.5 text-xs text-zinc-600 shadow-sm dark:bg-zinc-950/50 dark:text-zinc-300 dark:shadow-none">
          <span className="hidden truncate sm:inline">tower.config.ts</span>
        </div>
      </div>
      <div className="flex-1 px-1 pb-1">
        <div className="relative h-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-950">
          <div className="h-full overflow-auto p-3">
            <TowerCode />
          </div>
        </div>
      </div>
    </div>
  )
}

function BentoCard({
  title,
  tools,
  description,
  children,
  className,
}: {
  title: string
  tools: Tool[]
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'relative rounded-2xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-2xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline min-h-130_',
        className
      )}
    >
      <div className="inset-0 flex flex-col size-full overflow-hidden rounded-2xl">
        <div className="relative px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-[15px] font-semibold tracking-tight text-zinc-950 dark:text-white">{title}</h3>
            <TechnologyIcons items={tools} />
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-950/50 dark:text-white/60 dark:mix-blend-plus-lighter">
            {description}
          </p>
        </div>

        <div className="relative mt-6 flex-1 rounded-b-2xl px-2 pb-2">
          <div className="h-full">{children}</div>
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
          className="lg:col-span-5 min-h-95"
        >
          <DesktopMockup />
        </BentoCard>

        <BentoCard
          title="Mobile Apps"
          tools={tools.mobile}
          description={descriptions.mobile}
          className="lg:col-span-6 min-h-85"
        >
          <MobileMockup />
        </BentoCard>

        <BentoCard
          title="Developer Tools"
          tools={tools.developerTools}
          description={descriptions.developerTools}
          className="lg:col-span-6 min-h-85"
        >
          <DeveloperToolsMockup />
        </BentoCard>
      </div>
    </TooltipProvider>
  )
}
