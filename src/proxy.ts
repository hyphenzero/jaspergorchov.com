import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sessionCookieName, validateSession } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/newsletter/')) {
    const token = request.cookies.get(sessionCookieName())?.value
    const valid = await validateSession(token)

    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/newsletter/:path*', '/api/admin/login'],
}
