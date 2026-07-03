'use client'

import clsx from 'clsx'
import { type ReactNode, useState } from 'react'
import { Envelope } from '@/components/envelope'
import { SubscribeForm } from '@/components/subscribe-form'

export function NewsletterSection({ className, children }: { className?: string; children?: ReactNode }) {
  const [envelopeState, setEnvelopeState] = useState({ email: '', flipped: false })

  return (
    <div className={clsx('flex items-center gap-8', className)}>
      <div className="flex-1">
        {children}
        <SubscribeForm onStateChangeAction={setEnvelopeState} className="mt-10" source="homepage" />
      </div>
      <Envelope email={envelopeState.email} flipped={envelopeState.flipped} className="hidden md:block" />
    </div>
  )
}
