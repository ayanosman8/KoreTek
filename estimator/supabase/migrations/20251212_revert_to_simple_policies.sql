-- Complete rollback to original simple policies that worked

-- Drop ALL blueprint policies
DROP POLICY IF EXISTS "Users can view own blueprints or shared blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can update own blueprints or shared blueprints as editor" ON public.blueprints;
DROP POLICY IF EXISTS "Users can view own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can update own blueprints" ON public.blueprints;

-- Recreate ORIGINAL simple policies (no collaborators yet)
CREATE POLICY "Users can view own blueprints"
  ON public.blueprints
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own blueprints"
  ON public.blueprints
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Keep collaborators table but with very simple policies
DROP POLICY IF EXISTS "Users can view collaborators of accessible blueprints" ON public.blueprint_collaborators;
DROP POLICY IF EXISTS "Blueprint owners can add collaborators" ON public.blueprint_collaborators;
DROP POLICY IF EXISTS "Blueprint owners can remove collaborators" ON public.blueprint_collaborators;
DROP POLICY IF EXISTS "Blueprint owners can update collaborator roles" ON public.blueprint_collaborators;

-- Simple collaborators policies (no blueprint subqueries)
CREATE POLICY "View own collaborations"
  ON public.blueprint_collaborators
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Owners manage collaborators"
  ON public.blueprint_collaborators
  FOR ALL
  USING (invited_by = auth.uid());
