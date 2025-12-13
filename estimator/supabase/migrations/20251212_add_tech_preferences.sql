-- Add tech_preferences column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tech_preferences JSONB DEFAULT '{
  "frontend": [],
  "backend": [],
  "database": [],
  "auth": [],
  "infrastructure": [],
  "payment_apis": [],
  "ai_apis": [],
  "services": []
}'::jsonb;

-- Create index for performance on tech_preferences
CREATE INDEX IF NOT EXISTS idx_profiles_tech_preferences ON public.profiles USING gin(tech_preferences);

-- Update RLS policies to allow users to update their tech_preferences
-- (already covered by existing "Users can update own profile" policy)
