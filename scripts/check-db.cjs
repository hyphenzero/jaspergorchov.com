const { Pool } = require('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const schema = await pool.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'newsletter_sends'
    ORDER BY ordinal_position
  `)
  console.log('Columns:\n' + JSON.stringify(schema.rows, null, 2))

  const constraints = await pool.query(`
    SELECT conname, contype, pg_get_constraintdef(oid) as def
    FROM pg_constraint
    WHERE conrelid = 'public.newsletter_sends'::regclass
  `)
  console.log('\nConstraints:\n' + JSON.stringify(constraints.rows, null, 2))

  const indexes = await pool.query(`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'newsletter_sends'
  `)
  console.log('\nIndexes:\n' + JSON.stringify(indexes.rows, null, 2))

  await pool.end()
}

main().catch((e) => {
  console.error(e.message)
  pool.end()
})
