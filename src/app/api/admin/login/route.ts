import { NextResponse } from 'next/server'
import { createSessionCookie } from '@/lib/auth'

export async function POST(request: Request) {
  const formData = await request.formData()
  const token = formData.get('token') as string | null
  const from = formData.get('from') as string | null

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  const secret = process.env.NEWSLETTER_SECRET
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const session = await createSessionCookie()
  const redirectUrl = from && from.startsWith('/') ? from : '/admin'

  const response = NextResponse.redirect(new URL(redirectUrl, request.url))
  response.cookies.set(session.name, session.value, session.options)

  return response
}
