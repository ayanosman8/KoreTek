import { createClient } from '@/lib/database/client';
import { UserRole, Profile } from '@/lib/database/types';

/**
 * Get the current user's profile including their role
 */
export async function getUserProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return profile;
}

/**
 * Check if the current user has a specific role
 * Admins automatically have access to all roles
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const profile = await getUserProfile();
  if (!profile) return false;

  // Admins have access to everything
  if (profile.role === 'admin') return true;

  // Check if user has the specific role
  return profile.role === requiredRole;
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const profile = await getUserProfile();
  if (!profile) return false;

  // Admins have access to everything
  if (profile.role === 'admin') return true;

  // Check if user has any of the specified roles
  return roles.includes(profile.role);
}

/**
 * Check if the current user is a customer
 */
export async function isCustomer(): Promise<boolean> {
  return hasRole('customer');
}

/**
 * Check if the current user is internal staff
 */
export async function isInternal(): Promise<boolean> {
  return hasRole('internal');
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.role === 'admin';
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getUserProfile();
  return profile?.role || null;
}

/**
 * Update a user's role (admin only)
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Check if current user is admin
  const currentUserIsAdmin = await isAdmin();
  if (!currentUserIsAdmin) {
    return { success: false, error: 'Only admins can update user roles' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
