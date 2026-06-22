const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

function getSecret(): string {
  const secret = process.env.NEWSLETTER_SECRET
  if (!secret) throw new Error('NEWSLETTER_SECRET is not set')
  return secret
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacVerify(data: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )
  const sigBytes = new Uint8Array(signature.match(/.{2}/g)!.map((b) => parseInt(b, 16)))
  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))
}

export async function createSessionCookie(): Promise<{
  name: string
  value: string
  options: {
    httpOnly: boolean
    secure: boolean
    sameSite: 'strict'
    path: string
    maxAge: number
  }
}> {
  const secret = getSecret()
  const expiry = Date.now() + SESSION_DURATION_MS
  const sig = await hmacSign(String(expiry), secret)
  const value = `${expiry}.${sig}`

  return {
    name: SESSION_COOKIE,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    },
  }
}

export async function validateSession(token: string | undefined): Promise<boolean> {
  if (!token) return false

  const secret = getSecret()

  try {
    const parts = token.split('.')
    if (parts.length !== 2) return false

    const [expiryStr, sig] = parts
    const expiry = Number.parseInt(expiryStr, 10)
    if (Number.isNaN(expiry)) return false
    if (Date.now() > expiry) return false

    return hmacVerify(expiryStr, sig, secret)
  } catch {
    return false
  }
}

export function sessionCookieName(): string {
  return SESSION_COOKIE
}
