import { clsx } from 'clsx'
import NextImage from 'next/image'

export function Video({ className, ...props }: React.VideoHTMLAttributes<HTMLVideoElement>) {
  return (
    <div data-media className={className}>
      <div className="not-prose relative overflow-hidden rounded-xl">
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10"></div>
        <video autoPlay playsInline loop muted {...props} />
      </div>
    </div>
  )
}

export function YouTubeVideo({ className, id, ...props }: React.IframeHTMLAttributes<HTMLIFrameElement>) {
  return (
    <div data-media className={className}>
      <div className="not-prose relative overflow-hidden rounded-xl">
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10"></div>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full border-0"
          {...props}
        />
      </div>
    </div>
  )
}

export function Iframe({ height = 500, children, className, ...props }: React.IframeHTMLAttributes<HTMLIFrameElement>) {
  return (
    <div data-media className={className}>
      <div className="not-prose relative overflow-hidden rounded-xl">
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10"></div>
        <iframe
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          className="w-full border-0"
          style={{ height }}
          {...props}
        />
      </div>
    </div>
  )
}

export function Image({ src, className, ...props }: React.ComponentProps<typeof NextImage>) {
  return (
    <div data-media className={className}>
      <div className="not-prose relative h-auto overflow-hidden rounded-xl">
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10" />
        <NextImage priority unoptimized width={1024} src={src} className="aspect-auto h-auto w-full" {...props} />
      </div>
    </div>
  )
}

// export function Image({ src, className, ...props }: React.ComponentProps<typeof NextImage>) {
//   return (
//     <>
//       <NextImage
//         data-media
//         priority
//         unoptimized
//         src={src}
//         className={clsx(
//           'not-prose relative aspect-auto h-auto w-full overflow-hidden rounded-xl after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:ring-1 after:ring-zinc-950/10 after:z-10 after:ring-inset dark:after:ring-white/10',
//           className
//         )}
//         {...props}
//       />
//     </>
//   )
// }

export function ImageGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-media data-image-grid className={clsx('grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8_', className)}>
      {children}
    </div>
  )
}
