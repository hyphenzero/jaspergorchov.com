import { Pool } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set')
    }
    pool = new Pool({ connectionString: databaseUrl })
  }
  return pool
}

const LOCK_KEY = 'newsletter_run'

export async function acquireAdvisoryLock(): Promise<{ release: () => Promise<void> } | null> {
  const client = await getPool().connect()
  try {
    const { rows } = await client.query<{ acquired: boolean }>(
      'SELECT pg_try_advisory_lock(hashtext($1)) AS acquired',
      [LOCK_KEY]
    )
    if (!rows[0]?.acquired) {
      client.release()
      return null
    }
    return {
      release: async () => {
        try {
          await client.query('SELECT pg_advisory_unlock_all()')
        } finally {
          client.release()
        }
      },
    }
  } catch (error) {
    client.release()
    throw error
  }
}

export async function getSentSlugs(): Promise<Set<string>> {
  const client = await getPool().connect()
  try {
    const result = await client.query<{ slug: string }>('SELECT slug FROM newsletter_sends')
    return new Set(result.rows.map((r) => r.slug))
  } finally {
    client.release()
  }
}

interface SendRecord {
  slug: string
  type: 'blog' | 'project'
  title: string
  url: string
}

export async function insertSendRecords(records: SendRecord[], resendId: string | null): Promise<void> {
  if (records.length === 0) return

  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    for (const record of records) {
      await client.query(
        `INSERT INTO newsletter_sends (slug, type, title, url, resend_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (slug) DO NOTHING`,
        [record.slug, record.type, record.title, record.url, resendId]
      )
    }
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
