import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies for profiles table...\n');

    const sqlScript = `
-- Drop existing policies that might cause infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users" ON profiles;

-- Create correct policies using auth.uid() to avoid recursion
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
`;

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlScript });

    if (error) {
      console.error('❌ Error fixing RLS policies:', error);
      console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:');
      console.log(sqlScript);
    } else {
      console.log('✅ RLS policies fixed successfully!');
      console.log('\nNew policies:');
      console.log('1. Users can view own profile (using auth.uid())');
      console.log('2. Users can update own profile (using auth.uid())');
      console.log('3. Users can insert own profile (using auth.uid())');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n📋 Manual fix required. Run this in Supabase SQL Editor:\n');

    const sqlFile = path.join(__dirname, 'fix-profiles-rls.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log(sql);
  }
}

fixRLSPolicies();
