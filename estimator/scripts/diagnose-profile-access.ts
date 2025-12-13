import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function diagnose(email: string) {
  try {
    console.log('🔍 Diagnosing profile access for:', email);
    console.log('=====================================\n');

    // Create service role client (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get user
    const { data: authData } = await adminClient.auth.admin.listUsers();
    const user = authData.users.find(u => u.email === email);

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.id);

    // Check if profile exists (using service role - bypasses RLS)
    console.log('\n📋 Checking profile with SERVICE ROLE (bypasses RLS):');
    const { data: profileAdmin, error: errorAdmin } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (errorAdmin) {
      console.log('❌ Error:', errorAdmin);
    } else {
      console.log('✅ Profile found:');
      console.log(JSON.stringify(profileAdmin, null, 2));
    }

    // Check RLS policies
    console.log('\n🔒 Checking RLS policies on profiles table:');
    const { data: policies, error: policiesError } = await adminClient
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'profiles');

    if (policiesError) {
      console.log('❌ Error getting policies:', policiesError);
    } else {
      console.log('✅ Current policies:');
      policies?.forEach((policy: any) => {
        console.log(`\n  Policy: ${policy.policyname}`);
        console.log(`  Command: ${policy.cmd}`);
        console.log(`  Using: ${policy.qual}`);
      });
    }

    // Test with anon key (simulates frontend)
    console.log('\n🌐 Testing with ANON KEY (simulates frontend with RLS):');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const anonClient = createClient(supabaseUrl, anonKey);

    // Try to query as authenticated user
    const { data: authResponse } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email!,
    });

    console.log('\n⚠️  Cannot fully simulate auth session in script');
    console.log('Try this in browser console instead:\n');
    console.log(`
const { createClient } = supabase;
const supabase = createClient('${supabaseUrl}', '${anonKey}');
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', '${user.id}')
  .single();
console.log('Data:', data);
console.log('Error:', error);
    `);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

const email = process.argv[2] || 'akaythe4th@gmail.com';
diagnose(email);
