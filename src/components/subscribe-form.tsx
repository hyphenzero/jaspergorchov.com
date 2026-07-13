'use client'

import { type SubscribeState, subscribeToNewsletter } from '@/actions/subscribe'
import { Button } from '@/components/button'
import { ErrorMessage, Field, Label } from '@/components/fieldset'
import { Input, InputGroup } from '@/components/input'
import { EnvelopeIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { useActionState, useEffect, useRef, useState } from 'react'

const IDLE_WIDTH = 99
const SUCCESS_SIZE = 36

const SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const

function Checkmark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="size-4 text-white!" data-slot="icon">
      <motion.path
        d="M4 9 L7.5 12 L13 4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
      />
    </svg>
  )
}

function SubmitButton({ status, onClick }: { status: SubscribeState['status']; onClick: () => void }) {
  const isSuccess = status === 'success'
  const target = isSuccess ? SUCCESS_SIZE : IDLE_WIDTH

  return (
    <div className="relative shrink-0" style={{ height: SUCCESS_SIZE }}>
      <motion.div
        animate={{ width: target }}
        transition={SPRING}
        style={{ width: IDLE_WIDTH, height: SUCCESS_SIZE, borderRadius: 9999 }}
        className="overflow-hidden"
      >
        <Button
          type="submit"
          onClick={onClick}
          className={clsx('relative size-full! justify-center px-0', status !== 'idle' && 'pointer-events-none')}
        >
          <motion.span
            animate={{ opacity: isSuccess ? 0 : 1, scale: isSuccess ? 0.5 : 1 }}
            transition={SPRING}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          >
            Subscribe
          </motion.span>
          <motion.span
            animate={{ opacity: isSuccess ? 1 : 0, scale: isSuccess ? 1 : 0.5 }}
            transition={SPRING}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Checkmark key={String(isSuccess)} />
          </motion.span>
        </Button>
      </motion.div>
    </div>
  )
}

export function SubscribeForm({
  className,
  label,
  onStateChangeAction,
  source,
}: {
  className?: string
  label?: string
  onStateChangeAction?: (state: { email: string; flipped: boolean }) => void
  source?: string
}) {
  const [state, formAction] = useActionState(subscribeToNewsletter, { status: 'idle' })
  const [email, setEmail] = useState('')
  const [optimistic, setOptimistic] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmed = email.trim()
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  useEffect(() => {
    setOptimistic(false)
    setDismissed(false)
    setShowErrors(false)
  }, [state])

  const showCheckmark = optimistic || (state.status === 'success' && !dismissed)
  const buttonStatus = showCheckmark ? 'success' : 'idle'

  useEffect(() => {
    onStateChangeAction?.({ email, flipped: showCheckmark })
  }, [email, showCheckmark, onStateChangeAction])

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!trimmed) {
          inputRef.current?.focus()
          e.preventDefault()
        } else if (!isValidEmail) {
          setShowErrors(true)
          e.preventDefault()
        }
      }}
      noValidate
      data-track={source ? `subscribe-${source}` : undefined}
      className={clsx('relative w-96.75 shrink-0', className)}
    >
      <Field>
        {label && <Label>{label}</Label>}
        <div className="relative" data-slot="control">
          <div className="flex items-start gap-2">
            <InputGroup>
              <EnvelopeIcon className="translate-y-px" />
              <Input
                ref={inputRef}
                type="email"
                name="email"
                value={email}
                invalid={(showErrors && !isValidEmail) || state.status === 'error'}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setShowErrors(false)
                  if (state.status !== 'idle') setDismissed(true)
                }}
                placeholder="Email address"
                aria-label="Email address"
              />
            </InputGroup>
            {/* setOptimistic runs in the button's synchronous onClick — outside the
                form-action transition — so the animation starts on the same frame
                as the click with zero wait on the server action. */}
            <SubmitButton
              status={buttonStatus}
              onClick={() => {
                if (!trimmed) {
                  inputRef.current?.focus()
                  return
                }
                if (!isValidEmail) {
                  setShowErrors(true)
                  return
                }
                setOptimistic(true)
              }}
            />
          </div>
          {showErrors && !isValidEmail && (
            <ErrorMessage className="absolute top-full left-0 mt-2">Invalid email</ErrorMessage>
          )}
          {state.status === 'error' && state.message && (
            <ErrorMessage className="absolute top-full left-0 mt-2">{state.message}</ErrorMessage>
          )}
        </div>
      </Field>
      <input type="text" name="website" aria-hidden="true" tabIndex={-1} autoComplete="off" className="hidden" />
    </form>
  )
}
