-- Add missing columns to blueprints table
ALTER TABLE public.blueprints
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'planning', 'shipped')),
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS checklist JSONB DEFAULT '[]'::jsonb;

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_blueprints_status ON public.blueprints(user_id, status);
