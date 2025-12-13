-- Create blueprint_collaborators table
CREATE TABLE IF NOT EXISTS public.blueprint_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID REFERENCES public.blueprints(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate collaborators
  UNIQUE(blueprint_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_collaborators_blueprint ON public.blueprint_collaborators(blueprint_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user ON public.blueprint_collaborators(user_id);

-- Enable Row Level Security
ALTER TABLE public.blueprint_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collaborators table
-- Users can view collaborators of blueprints they own or are collaborating on
CREATE POLICY "Users can view collaborators of accessible blueprints"
  ON public.blueprint_collaborators
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blueprints
      WHERE blueprints.id = blueprint_collaborators.blueprint_id
      AND blueprints.user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- Blueprint owners can add collaborators
CREATE POLICY "Blueprint owners can add collaborators"
  ON public.blueprint_collaborators
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.blueprints
      WHERE blueprints.id = blueprint_collaborators.blueprint_id
      AND blueprints.user_id = auth.uid()
    )
  );

-- Blueprint owners can remove collaborators
CREATE POLICY "Blueprint owners can remove collaborators"
  ON public.blueprint_collaborators
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.blueprints
      WHERE blueprints.id = blueprint_collaborators.blueprint_id
      AND blueprints.user_id = auth.uid()
    )
  );

-- Blueprint owners can update collaborator roles
CREATE POLICY "Blueprint owners can update collaborator roles"
  ON public.blueprint_collaborators
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.blueprints
      WHERE blueprints.id = blueprint_collaborators.blueprint_id
      AND blueprints.user_id = auth.uid()
    )
  );

-- Grant permissions
GRANT ALL ON public.blueprint_collaborators TO authenticated;

-- Update blueprints RLS policies to allow collaborators
DROP POLICY IF EXISTS "Users can view own blueprints" ON public.blueprints;
CREATE POLICY "Users can view own blueprints or shared blueprints"
  ON public.blueprints
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.blueprint_collaborators
      WHERE blueprint_collaborators.blueprint_id = blueprints.id
      AND blueprint_collaborators.user_id = auth.uid()
    )
  );

-- Editors can update shared blueprints
DROP POLICY IF EXISTS "Users can update own blueprints" ON public.blueprints;
CREATE POLICY "Users can update own blueprints or shared blueprints as editor"
  ON public.blueprints
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.blueprint_collaborators
      WHERE blueprint_collaborators.blueprint_id = blueprints.id
      AND blueprint_collaborators.user_id = auth.uid()
      AND blueprint_collaborators.role IN ('owner', 'editor')
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.blueprint_collaborators
      WHERE blueprint_collaborators.blueprint_id = blueprints.id
      AND blueprint_collaborators.user_id = auth.uid()
      AND blueprint_collaborators.role IN ('owner', 'editor')
    )
  );
