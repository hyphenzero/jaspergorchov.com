'use server'

import { Resend } from 'resend'

export type SubscribeState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const apiKey = process.env.RESEND_API_KEY
if (!apiKey) throw new Error('RESEND_API_KEY is not set')

const resend = new Resend(apiKey)

const audienceId = process.env.RESEND_AUDIENCE_ID

export async function subscribeToNewsletter(_prevState: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const website = formData.get('website')
  if (typeof website === 'string' && website.length > 0) {
    return { status: 'success', message: 'Successfully subscribed!' }
  }

  const email = formData.get('email')?.toString().trim().toLowerCase() ?? ''

  if (!email) {
    return { status: 'error', message: 'Email is required' }
  }

  const emailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address' }
  }

  if (!audienceId) {
    console.error('RESEND_AUDIENCE_ID is not set')
    return { status: 'error', message: 'Newsletter configuration error. Please try again later.' }
  }

  try {
    const { error: resendError } = await resend.contacts.create({
      email,
      audienceId,
    })

    if (resendError) {
      console.error('Resend error:', resendError)
      const isDuplicate =
        resendError.statusCode === 409 ||
        String(resendError.name).toLowerCase() === 'conflict' ||
        String(resendError.message).toLowerCase().includes('already exists')
      if (isDuplicate) {
        return { status: 'success', message: "You're already subscribed!" }
      }
      return { status: 'error', message: resendError.message ?? 'Failed to subscribe. Please try again.' }
    }

    return { status: 'success', message: 'Successfully subscribed!' }
  } catch (error) {
    console.error('Subscribe error:', error)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
