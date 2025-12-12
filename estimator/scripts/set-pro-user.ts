import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setProUser(email: string) {
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

    console.log(`Found user: ${user.id} (${user.email})`);

    // Update profile to Pro status
    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        has_paid: true
      })
      .eq('id', user.id)
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    console.log('✅ Successfully upgraded to Pro!');
    console.log('Updated profile:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

const email = process.argv[2] || 'akaythe4th@gmail.com';
setProUser(email);
