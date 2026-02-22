import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'db.vomwlbumdrylohcgrufk.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Diadesol@123',
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const policies = [
  `CREATE POLICY "Anon can read sections" ON sections FOR SELECT TO anon USING (true)`,
  `CREATE POLICY "Anon can update sections" ON sections FOR UPDATE TO anon USING (true)`,
];

for (const sql of policies) {
  try {
    await client.query(sql);
    console.log('✓', sql.slice(15, 60));
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('⏭ Already exists:', sql.slice(15, 60));
    } else {
      console.error('✗', e.message);
    }
  }
}

await client.end();
console.log('\nDone!');
