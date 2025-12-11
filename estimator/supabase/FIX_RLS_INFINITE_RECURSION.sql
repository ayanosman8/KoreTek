-- ============================================================================
-- FIX: Infinite recursion in RLS policies
-- ============================================================================
-- This script fixes the "infinite recursion detected in policy for relation 'profiles'" error
-- Run this in your Supabase SQL Editor

-- Step 1: Drop the problematic admin policy on blueprints table
DROP POLICY IF EXISTS "Admins can view all blueprints" ON public.blueprints;

-- Step 2: Verify the remaining policies are working
-- You should now only have these policies on blueprints:
-- 1. "Users can view own blueprints"
-- 2. "Users can create own blueprints"
-- 3. "Users can update own blueprints"
-- 4. "Users can delete own blueprints"

-- Step 3 (Optional): If you want to verify your policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'blueprints'
ORDER BY policyname;

-- SUCCESS! Your blueprints table should now work without infinite recursion errors.
