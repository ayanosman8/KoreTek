-- Fix infinite recursion in blueprints RLS policies
-- Remove the admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all blueprints" ON public.blueprints;

-- For now, we'll skip admin access to blueprints
-- If needed later, we can create a security definer function to check admin role
-- without triggering RLS on the profiles table
