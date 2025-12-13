-- Fix RLS circular dependency using a security definer function
-- This function bypasses RLS to check collaborator access

-- Create a function to check if a user has access to a blueprint
CREATE OR REPLACE FUNCTION public.user_has_blueprint_access(
  p_blueprint_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- User has access if they own the blueprint OR are a collaborator
  RETURN EXISTS (
    SELECT 1 FROM public.blueprints
    WHERE id = p_blueprint_id AND user_id = p_user_id
  ) OR EXISTS (
    SELECT 1 FROM public.blueprint_collaborators
    WHERE blueprint_id = p_blueprint_id AND user_id = p_user_id
  );
END;
$$;

-- Create a function to check if a user can edit a blueprint
CREATE OR REPLACE FUNCTION public.user_can_edit_blueprint(
  p_blueprint_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- User can edit if they own the blueprint OR are an owner/editor collaborator
  RETURN EXISTS (
    SELECT 1 FROM public.blueprints
    WHERE id = p_blueprint_id AND user_id = p_user_id
  ) OR EXISTS (
    SELECT 1 FROM public.blueprint_collaborators
    WHERE blueprint_id = p_blueprint_id
    AND user_id = p_user_id
    AND role IN ('owner', 'editor')
  );
END;
$$;

-- Drop existing blueprint policies
DROP POLICY IF EXISTS "Users can view own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can update own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can view own blueprints or shared blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can update own blueprints or shared blueprints as editor" ON public.blueprints;

-- Create new policies using security definer functions (no circular dependency)
CREATE POLICY "Users can view accessible blueprints"
  ON public.blueprints
  FOR SELECT
  USING (public.user_has_blueprint_access(id, auth.uid()));

CREATE POLICY "Users can update editable blueprints"
  ON public.blueprints
  FOR UPDATE
  USING (public.user_can_edit_blueprint(id, auth.uid()))
  WITH CHECK (public.user_can_edit_blueprint(id, auth.uid()));

-- Users can only delete their own blueprints (not collaborators)
CREATE POLICY "Users can delete own blueprints"
  ON public.blueprints
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION public.user_has_blueprint_access(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_can_edit_blueprint(UUID, UUID) TO authenticated;
