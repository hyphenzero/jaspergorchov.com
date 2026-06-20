'use client'

import { EnvelopeIcon } from '@heroicons/react/16/solid'
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
      setMessage('Subscribed!')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={clsx('relative', className)}>
      <div className="flex items-center gap-2">
        <InputGroup className="flex-1">
          <EnvelopeIcon data-slot="icon" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Subscribe via email"
            required
            aria-label="Email address"
          />
        </InputGroup>
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Subscribe'}
        </Button>
      </div>
      {message ? (
        <p
          className={clsx(
            'mt-1.5 text-xs',
            status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          )}
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}
