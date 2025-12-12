import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserStatus(email: string) {
  try {
    // Find user by email
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Error fetching users:', authError);
      return;
    }

    const user = authData.users.find(u => u.email === email);

    if (!user) {
      console.error(`User with email ${email} not found`);
      return;
    }

    console.log(`\n=== User: ${user.email} ===`);
    console.log(`ID: ${user.id}`);

    // Get profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    console.log('\n=== Profile ===');
    console.log(JSON.stringify(profile, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

const email = process.argv[2] || 'akaythe4th@gmail.com';
checkUserStatus(email);
