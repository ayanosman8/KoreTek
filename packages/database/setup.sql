-- ============================================
-- Scope AI Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. ESTIMATES TABLE
-- Stores ALL generated estimates for analytics
-- ============================================

CREATE TABLE IF NOT EXISTS estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_description TEXT NOT NULL,
  estimate JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for the estimator form)
CREATE POLICY "Allow public insert"
  ON estimates
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to select
CREATE POLICY "Allow authenticated select"
  ON estimates
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create index for sorting
CREATE INDEX IF NOT EXISTS estimates_created_at_idx
  ON estimates(created_at DESC);

-- ============================================
-- 2. LEADS TABLE
-- Stores leads when users request full proposal
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  project_description TEXT NOT NULL,
  estimate JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for lead capture)
CREATE POLICY "Allow public insert"
  ON leads
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to select
CREATE POLICY "Allow authenticated select"
  ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS leads_email_idx
  ON leads(email);

CREATE INDEX IF NOT EXISTS leads_created_at_idx
  ON leads(created_at DESC);

-- ============================================
-- 3. USER PROFILES TABLE
-- Stores user roles and subscription status
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  has_paid BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. USER ESTIMATES TABLE
-- Stores saved estimates for paid users
-- ============================================

CREATE TABLE IF NOT EXISTS user_estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  project_description TEXT NOT NULL,
  estimate JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_estimates ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own estimates
CREATE POLICY "Users can view own estimates"
  ON user_estimates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own estimates
CREATE POLICY "Users can insert own estimates"
  ON user_estimates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own estimates
CREATE POLICY "Users can delete own estimates"
  ON user_estimates
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS user_estimates_user_id_idx
  ON user_estimates(user_id);

CREATE INDEX IF NOT EXISTS user_estimates_created_at_idx
  ON user_estimates(created_at DESC);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Go to Authentication -> Users in Supabase
-- 2. Create admin user with email/password
-- 3. Manually set their role to 'admin' in user_profiles table
-- 4. Regular users will auto-create as 'customer' role
-- ============================================
