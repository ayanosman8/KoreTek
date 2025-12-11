-- Create blueprints table for storing user project blueprints
CREATE TABLE IF NOT EXISTS public.blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Core blueprint data
  project_name TEXT NOT NULL,
  project_description TEXT,
  summary TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  tech_stack JSONB DEFAULT '{}'::jsonb,
  risks JSONB DEFAULT '[]'::jsonb,
  next_steps JSONB DEFAULT '[]'::jsonb,
  questions JSONB DEFAULT '[]'::jsonb,

  -- Enhancements (stored as key-value pairs)
  enhancements JSONB DEFAULT '{}'::jsonb,

  -- Organization & metadata
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_starred BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blueprints_user_id ON public.blueprints(user_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_created_at ON public.blueprints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blueprints_updated_at ON public.blueprints(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_blueprints_starred ON public.blueprints(user_id, is_starred) WHERE is_starred = TRUE;
CREATE INDEX IF NOT EXISTS idx_blueprints_archived ON public.blueprints(user_id, is_archived);
CREATE INDEX IF NOT EXISTS idx_blueprints_tags ON public.blueprints USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own blueprints
CREATE POLICY "Users can view own blueprints"
  ON public.blueprints
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own blueprints
CREATE POLICY "Users can create own blueprints"
  ON public.blueprints
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own blueprints
CREATE POLICY "Users can update own blueprints"
  ON public.blueprints
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own blueprints
CREATE POLICY "Users can delete own blueprints"
  ON public.blueprints
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all blueprints
CREATE POLICY "Admins can view all blueprints"
  ON public.blueprints
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS on_blueprint_updated ON public.blueprints;
CREATE TRIGGER on_blueprint_updated
  BEFORE UPDATE ON public.blueprints
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.blueprints TO authenticated;

-- Create a function to get user's blueprint count
CREATE OR REPLACE FUNCTION public.get_blueprint_count(uid UUID DEFAULT auth.uid())
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.blueprints
    WHERE user_id = uid AND is_archived = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user's starred blueprints count
CREATE OR REPLACE FUNCTION public.get_starred_count(uid UUID DEFAULT auth.uid())
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.blueprints
    WHERE user_id = uid AND is_starred = TRUE AND is_archived = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
