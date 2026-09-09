'use client'

import { adminLogin } from '@/actions/admin'
import { Button } from '@/components/button'
import { ErrorMessage, Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Logo } from '@/components/logo'
import { useActionState, useState } from 'react'

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLogin, { error: undefined })
  const [value, setValue] = useState('')
  const [displayError, setDisplayError] = useState<string | undefined>(undefined)
  const [lastError, setLastError] = useState<string | undefined>(undefined)

  // Mirror server errors locally so typing can dismiss them. Adjusted during
  // render (the endorsed alternative to syncing in an effect).
  if (state.error !== lastError) {
    setLastError(state.error)
    setDisplayError(state.error)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    if (displayError) setDisplayError(undefined)
  }

  return (
    <form action={formAction} className="mx-auto grid w-full max-w-sm grid-cols-1 gap-8" noValidate>
      <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
      <Heading>Admin Access</Heading>
      <Field>
        <Label>Password</Label>
        <Input
          type="password"
          name="token"
          required
          autoFocus
          invalid={!!displayError}
          value={value}
          onChange={handleChange}
        />
        {displayError && <ErrorMessage>{displayError}</ErrorMessage>}
      </Field>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  )
}
