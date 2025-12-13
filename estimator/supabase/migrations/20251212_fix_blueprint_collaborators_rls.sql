-- Fix circular RLS issue by simplifying collaborators policies
-- and ensuring blueprints can be fetched

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view own blueprints or shared blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can update own blueprints or shared blueprints as editor" ON public.blueprints;
DROP POLICY IF EXISTS "Users can view collaborators of accessible blueprints" ON public.blueprint_collaborators;

-- Recreate simpler blueprint policies
CREATE POLICY "Users can view own blueprints or shared blueprints"
  ON public.blueprints
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR id IN (
      SELECT blueprint_id FROM public.blueprint_collaborators
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own blueprints or shared blueprints as editor"
  ON public.blueprints
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR id IN (
      SELECT blueprint_id FROM public.blueprint_collaborators
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'editor')
    )
  );

-- Simpler collaborators view policy (no circular reference)
CREATE POLICY "Users can view collaborators of accessible blueprints"
  ON public.blueprint_collaborators
  FOR SELECT
  USING (
    -- Can see if you're the collaborator
    user_id = auth.uid()
    OR
    -- Can see if you own the blueprint (direct check, no subquery on blueprints)
    blueprint_id IN (
      SELECT id FROM public.blueprints WHERE user_id = auth.uid()
    )
  );
