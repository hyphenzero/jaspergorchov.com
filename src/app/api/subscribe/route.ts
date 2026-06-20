import { NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (!audienceId) {
      return NextResponse.json({ error: 'Newsletter not configured' }, { status: 500 })
    }

    const { error: resendError } = await getResend().contacts.create({
      email,
      audienceId,
    })

    if (resendError) {
      console.error('Resend error:', resendError)
      return NextResponse.json({ error: resendError.message ?? 'Failed to subscribe' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 })
  } catch (error) {
    console.error('Subscribe error:', error)
    const message = error instanceof Error ? error.message : 'Failed to subscribe'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
