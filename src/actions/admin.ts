'use server'

import {
  checkLoginRateLimit,
  constantTimeCompare,
  createSessionCookie,
  getPassword,
  resetLoginRateLimit,
  sessionCookieName,
} from '@/lib/auth'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type AdminLoginState = {
  error?: string
}

export async function adminLogin(_prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const token = formData.get('token') as string | null

  if (!token) {
    return { error: 'Password is required' }
  }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const { allowed, remaining } = checkLoginRateLimit(ip)
  if (!allowed) {
    console.warn(`[auth] rate-limited login attempt from ${ip}`)
    return { error: 'Too many attempts. Try again later.' }
  }

  const password = getPassword()
  const valid = await constantTimeCompare(token, password)

  if (!valid) {
    return { error: 'Invalid password' }
  }

  resetLoginRateLimit(ip)

  const cookie = await createSessionCookie()
  const cookieStore = await cookies()
  cookieStore.set(cookie.name, cookie.value, cookie.options)
  cookieStore.set('admin_logged_in', 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 400 * 24 * 60 * 60,
  })

  redirect('/admin')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.set(sessionCookieName(), '', { maxAge: 0, path: '/' })
  cookieStore.set('admin_logged_in', '', { maxAge: 0, path: '/' })
  redirect('/admin')
}
