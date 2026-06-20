import { NextResponse } from 'next/server'
import { sendPostNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, type, token } = body

    if (!slug || !type || !token) {
      return NextResponse.json({ error: 'slug, type, and token are required' }, { status: 400 })
    }

    if (token !== process.env.NOTIFY_SECRET) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (type !== 'blog' && type !== 'project') {
      return NextResponse.json({ error: 'type must be "blog" or "project"' }, { status: 400 })
    }

    await sendPostNotification(slug, type)

    return NextResponse.json({ message: `Notification sent for ${type}: ${slug}` }, { status: 200 })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
