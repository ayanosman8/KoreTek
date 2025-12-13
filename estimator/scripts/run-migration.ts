import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error('Usage: tsx scripts/run-migration.ts <migration-file>');
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationFile, 'utf-8');

  console.log(`Running migration: ${path.basename(migrationFile)}`);
  console.log('SQL:', sql.substring(0, 100) + '...\n');

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('✓ Migration completed successfully');
  } catch (err: any) {
    // Try direct query if RPC doesn't exist
    try {
      const { error } = await supabase.from('_').select('*').limit(0);

      // Execute each statement separately
      const statements = sql.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (!statement.trim()) continue;

        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`
          },
          body: JSON.stringify({ query: statement })
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('Failed to execute statement:', statement.substring(0, 100));
          console.error('Error:', error);
          throw new Error(error);
        }
      }

      console.log('✓ Migration completed successfully (direct execution)');
    } catch (directErr) {
      console.error('\nDirect execution also failed. Please run this SQL manually in Supabase SQL Editor:');
      console.error('\n' + sql);
      process.exit(1);
    }
  }
}

runMigration();
