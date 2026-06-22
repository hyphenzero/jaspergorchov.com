'use client'

import { ArrowPathIcon, CheckIcon, EnvelopeIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import { type FormEvent, useState } from 'react'
import { Button } from '@/components/button'
import { Input, InputGroup } from '@/components/input'

export function SubscribeForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to subscribe')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={clsx('relative', className)}>
      <div className="flex items-center gap-2">
        <InputGroup className="flex-1">
          <EnvelopeIcon className="translate-y-px" />
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
            placeholder="Email address"
            required
            aria-label="Email address"
          />
        </InputGroup>
        <Button type="submit" className={status !== 'idle' ? 'pointer-events-none' : ''}>
          {status === 'loading' ? (
            <ArrowPathIcon className="animate-spin text-white!" data-slot="icon" />
          ) : status === 'success' ? (
            <CheckIcon className="text-white!" data-slot="icon" />
          ) : (
            'Subscribe'
          )}
        </Button>
      </div>
      {message && status === 'error' ? (
        <p className="mt-1.5 text-red-500 text-xs dark:text-red-400">{message}</p>
      ) : null}
    </form>
  )
}
