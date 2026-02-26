import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new pg.Client({
  host: 'db.libojlmynmxmntghjbhv.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  console.log('Connected to Supabase Postgres!');

  const sql = fs.readFileSync(path.join(__dirname, '../../supabase-schema.sql'), 'utf8');

  // Remove comment-only lines but keep inline comments, run as single batch
  const cleanSql = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  try {
    await client.query(cleanSql);
    console.log('Schema created successfully!');
  } catch (err) {
    console.error('Schema error:', err.message);
  }

  // Verify tables
  const { rows } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN ('sections', 'features')
    ORDER BY table_name
  `);
  console.log('Tables:', rows.map((r) => r.table_name).join(', '));

  // Create storage bucket via Supabase API
  console.log('\nCreating screenshots storage bucket...');
  const res = await fetch('https://libojlmynmxmntghjbhv.supabase.co/storage/v1/bucket', {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 'screenshots',
      name: 'screenshots',
      public: true,
    }),
  });
  const bucketResult = await res.json();
  console.log('Bucket:', JSON.stringify(bucketResult));

  await client.end();
  console.log('\nDone!');
}

run().catch((e) => console.error('Fatal:', e.message));
