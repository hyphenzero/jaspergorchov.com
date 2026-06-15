import { clsx } from 'clsx'
import NextImage from 'next/image'

type NextImageProps = React.ComponentProps<typeof NextImage>

export function ThemeImage({ src, darkSrc, alt, className, ...props }: NextImageProps & { darkSrc?: string }) {
  if (!darkSrc) {
    return <NextImage src={src} alt={alt} className={className} {...props} />
  }

  // For fill mode, the parent container provides explicit sizing.
  // We wrap in a relative div so both absolutely-positioned images overlap.
  if (props.fill) {
    return (
      <div className={clsx('relative size-full', className)}>
        <NextImage src={src} alt={alt} className="dark:hidden! size-full object-cover" {...props} />
        <NextImage
          src={darkSrc}
          alt={alt}
          className="not-dark:hidden! absolute inset-0 size-full object-cover"
          {...props}
        />
      </div>
    )
  }

  // For non-fill images, use CSS grid to overlay them.
  // Each image contributes to the grid sizing only when it's visible,
  // so the container always has the correct intrinsic height.
  return (
    <div className={clsx('grid grid-cols-1 grid-rows-1', className)}>
      <NextImage src={src} alt={alt} className="col-start-1 row-start-1 dark:hidden" {...props} />
      <NextImage src={darkSrc} alt={alt} className="col-start-1 row-start-1 not-dark:hidden" {...props} />
    </div>
  )
}
