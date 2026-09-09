const SESSION_COOKIE = 'admin_session'
const COOKIE_MAX_AGE_SECONDS = 400 * 24 * 60 * 60

const MAX_LOGIN_ATTEMPTS = 10
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000

export function getPassword(): string {
  const password = process.env.ADMIN_PASSWORD
  if (!password) throw new Error('ADMIN_PASSWORD is not set')
  return password
}

function getSigningKey(): string {
  const key = process.env.SESSION_SECRET
  if (!key) throw new Error('SESSION_SECRET is not set')
  return key
}

export async function constantTimeCompare(a: string, b: string): Promise<boolean> {
  const { timingSafeEqual } = await import('node:crypto')
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
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

function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function pruneRateLimitStore(): void {
  const now = Date.now()
  for (const [ip, entry] of loginAttempts) {
    if (now > entry.resetAt) loginAttempts.delete(ip)
  }
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - 1 }
  }

  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  entry.resetAt = now + RATE_LIMIT_WINDOW_MS
  return { allowed: true, remaining: Math.max(0, MAX_LOGIN_ATTEMPTS - entry.count) }
}

export function resetLoginRateLimit(ip: string): void {
  loginAttempts.delete(ip)
  if (loginAttempts.size > 1000) {
    pruneRateLimitStore()
  }
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
  const secret = getSigningKey()
  const nonce = generateNonce()
  const payload = `${Date.now()}.${nonce}`
  const sig = await hmacSign(payload, secret)
  const value = `${payload}.${sig}`

  return {
    name: SESSION_COOKIE,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: COOKIE_MAX_AGE_SECONDS,
    },
  }
}

export async function validateSession(token: string | undefined): Promise<boolean> {
  if (!token) return false

  const secret = getSigningKey()

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false

    const [expiryStr, nonce, sig] = parts
    const payload = `${expiryStr}.${nonce}`

    return hmacVerify(payload, sig, secret)
  } catch {
    return false
  }
}

export function sessionCookieName(): string {
  return SESSION_COOKIE
}
