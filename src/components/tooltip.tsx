'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { clsx } from 'clsx'
import * as React from 'react'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={clsx(
        'pointer-events-none z-10 flex translate-y-0.5 items-center gap-1 rounded-full bg-white/75 px-2 py-0.5 text-center text-xs/6 font-medium whitespace-nowrap text-zinc-950 opacity-100 shadow ring-1 ring-zinc-950/10 backdrop-blur transition-opacity dark:bg-zinc-800/75 dark:text-white dark:ring-white/10 dark:ring-inset starting:opacity-0',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
