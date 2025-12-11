# Role-Based Access Control Setup

This guide explains how to set up and use role-based access control across your apps.

## Overview

Your apps now support three user roles:
- **`customer`** - Default role for all new users (estimator app users)
- **`internal`** - Internal staff members (for internal tools)
- **`admin`** - Full administrative access

## Step 1: Run the Database Migration

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20251211_add_user_roles.sql`
5. Click **Run** to execute the migration

This creates:
- ✅ `profiles` table with role column
- ✅ Row Level Security (RLS) policies
- ✅ Auto-trigger to create profile on user signup
- ✅ Helper functions for role checking

## Step 2: Update Supabase URLs

Go to **Authentication** → **URL Configuration** and add:

**Site URL:**
```
https://korelnx.com
```

**Redirect URLs:**
```
https://korelnx.com/auth/callback
https://estimator-iota.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

## Step 3: Verify Migration

Run this query in Supabase SQL Editor to verify:

```sql
-- Check if profiles table exists
SELECT * FROM public.profiles LIMIT 1;

-- Check if roles enum exists
SELECT enum_range(NULL::user_role);
```

## Usage Examples

### In API Routes

```typescript
import { isAdmin, isInternal, hasRole } from '@/lib/auth/roles';

export async function GET(request: Request) {
  // Check if user is admin
  if (!await isAdmin()) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Your admin-only logic here
  return Response.json({ data: 'Admin data' });
}
```

### In Server Components

```typescript
import { getUserProfile, isInternal } from '@/lib/auth/roles';

export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  const hasInternalAccess = await isInternal();

  return (
    <div>
      <h1>Welcome, {profile.full_name}!</h1>
      <p>Your role: {profile.role}</p>

      {hasInternalAccess && (
        <div>Internal tools section</div>
      )}
    </div>
  );
}
```

### In Client Components

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/auth/roles';

export default function ProfileComponent() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const profile = await getUserProfile();
      setRole(profile?.role || null);
    }
    loadProfile();
  }, []);

  return <div>Your role: {role}</div>;
}
```

## Protecting Routes with Middleware

### Option A: Estimator App (Customer Access)

The estimator app is for customers, so just require authentication:

```typescript
// estimator/middleware.ts
import { type NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware-helpers';

export async function middleware(request: NextRequest) {
  const result = await requireAuth(request);
  if (result instanceof Response) return result;
  return result.response;
}

export const config = {
  matcher: ['/estimate:path*', '/my-estimates:path*'],
};
```

### Option B: Internal Tools App (Staff Only)

For internal tools, require internal or admin role:

```typescript
// internal-tools/middleware.ts
import { type NextRequest } from 'next/server';
import { requireInternal } from '@/lib/auth/middleware-helpers';

export async function middleware(request: NextRequest) {
  const result = await requireInternal(request);
  if (result instanceof Response) return result;
  return result.response;
}

export const config = {
  matcher: ['/((?!auth|_next/static|_next/image|favicon.ico).*)'],
};
```

### Option C: Admin App (Admin Only)

For admin-only apps:

```typescript
// admin-app/middleware.ts
import { type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/middleware-helpers';

export async function middleware(request: NextRequest) {
  const result = await requireAdmin(request);
  if (result instanceof Response) return result;
  return result.response;
}

export const config = {
  matcher: ['/((?!auth|_next/static|_next/image|favicon.ico).*)'],
};
```

## Managing User Roles

### Promoting Users to Internal/Admin

Run this in Supabase SQL Editor:

```sql
-- Make a user internal staff
UPDATE public.profiles
SET role = 'internal'
WHERE email = 'staff@example.com';

-- Make a user admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Programmatically (Admin Only)

```typescript
import { updateUserRole } from '@/lib/auth/roles';

// Only admins can do this
await updateUserRole('user-id-here', 'internal');
```

## Testing

### 1. Test Customer Access (Estimator)

1. Sign up at https://estimator-iota.vercel.app
2. Your role will be `customer` by default
3. You should be able to use the estimator
4. You should NOT be able to access internal tools

### 2. Test Internal Access

1. In Supabase, update your user role to `internal`
2. Access should work for internal tools
3. Estimator should still work (customers can do what internal staff can in the estimator)

### 3. Test Admin Access

1. In Supabase, update your user role to `admin`
2. You should have access to everything
3. You can update other users' roles

## Security Notes

- ✅ All role checks happen server-side
- ✅ Row Level Security (RLS) prevents unauthorized database access
- ✅ Users cannot change their own role (only admins can)
- ✅ Middleware runs on every request to protected routes
- ✅ Admins automatically have access to all roles

## Troubleshooting

### User has no profile after signup

Check if the trigger is working:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Unauthorized errors for valid users

Check the user's profile:
```sql
SELECT * FROM public.profiles WHERE email = 'user@example.com';
```

### RLS blocking access

Temporarily disable RLS to debug (re-enable after!):
```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- Debug...
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

## Next Steps

1. ✅ Run the migration in Supabase
2. ✅ Update Supabase URL configuration
3. ✅ Test by creating a new account
4. ✅ Promote yourself to admin
5. ✅ Copy middleware examples to your internal tools
6. ✅ Test access control

Need help? Check the examples in `supabase/middleware-examples.ts`
