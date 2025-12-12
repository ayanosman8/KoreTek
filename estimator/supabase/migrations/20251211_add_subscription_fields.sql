-- Add subscription fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT;

-- Create index on subscription_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id
ON public.profiles(stripe_subscription_id);

-- Create index on subscription_status for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status
ON public.profiles(subscription_status);
