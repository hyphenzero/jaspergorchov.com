import { signOut } from '@/actions/admin'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { sessionCookieName, validateSession } from '@/lib/auth'
import { getAllAnalytics } from '@/lib/db-analytics'
import { buildNewsletterPayload, getUnsentNewsletterContent } from '@/lib/newsletter'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid'
import { cookies } from 'next/headers'
import { AdminClient } from './client'
import { AdminLoginForm } from './login-form'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(sessionCookieName())?.value
  const valid = await validateSession(session)

  if (!valid) {
    return <AdminLogin />
  }

  const unsent = await getUnsentNewsletterContent()
  const payload = unsent.length > 0 ? await buildNewsletterPayload(unsent) : null
  const analytics = await getAllAnalytics()

  return (
    <Container className="relative mt-28">
      <span className="absolute -z-10 -mt-3 -ml-3 text-7xl font-semibold text-balance text-zinc-200 sm:-mt-4 sm:-ml-4 sm:text-8xl lg:-mt-6 lg:-ml-4 lg:text-9xl dark:text-zinc-800">
        /
      </span>
      <div className="flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="w-full">
          <h1 className="text-6xl tracking-tighter text-balance text-zinc-950 sm:text-7xl lg:text-8xl dark:text-white">
            Admin
          </h1>
          <p className="mt-8 max-w-xl text-lg/9 font-medium text-pretty text-zinc-600 dark:text-zinc-400">
            Manage the newsletter, review analytics, and monitor how visitors engage with content.
          </p>
        </div>
        <form action={signOut} className="shrink-0 sm:mb-3">
          <Button type="submit" outline>
            Sign out
            <ArrowRightStartOnRectangleIcon />
          </Button>
        </form>
      </div>

      <AdminClient unsent={unsent} payload={payload} analytics={analytics} />
    </Container>
  )
}

function AdminLogin() {
  return (
    <div className="mt-32">
      <AdminLoginForm />
    </div>
  )
}
