import Link from 'next/link'

import clsx from 'clsx'

export function Button({ href, className, children, ...props }) {
  className = clsx(
    className,
    'group inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-sm font-display font-semibold text-neutral-950 backdrop-blur-3xl transition duration-200 hover:bg-neutral-300',
  )

  let inner = <span className="relative top-px">{children}</span>

  if (href) {
    return (
      <Link href={href} className={className} {...props}>
        {inner}
      </Link>
    )
  }

  return (
    <button className={className} {...props}>
      {inner}
    </button>
  )
}
