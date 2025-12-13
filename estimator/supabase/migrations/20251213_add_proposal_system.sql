-- Add company info fields to profiles table for proposal generation
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS company_logo TEXT,
  ADD COLUMN IF NOT EXISTS company_email TEXT,
  ADD COLUMN IF NOT EXISTS company_phone TEXT,
  ADD COLUMN IF NOT EXISTS company_address TEXT,
  ADD COLUMN IF NOT EXISTS company_website TEXT;

-- Create proposal_settings table for storing user's proposal templates/preferences
CREATE TABLE IF NOT EXISTS proposal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_name TEXT DEFAULT 'default',
  primary_color TEXT DEFAULT '#3b82f6',
  terms_and_conditions TEXT,
  payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, template_name)
);

-- Create proposals table for tracking generated proposals
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_company TEXT,
  total_price DECIMAL(10, 2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on proposal_settings
ALTER TABLE proposal_settings ENABLE ROW LEVEL SECURITY;

-- Policies for proposal_settings
CREATE POLICY "Users can view their own proposal settings"
  ON proposal_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own proposal settings"
  ON proposal_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own proposal settings"
  ON proposal_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own proposal settings"
  ON proposal_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on proposals
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policies for proposals
CREATE POLICY "Users can view their own proposals"
  ON proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own proposals"
  ON proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own proposals"
  ON proposals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own proposals"
  ON proposals FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_proposal_settings_user_id ON proposal_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_blueprint_id ON proposals(blueprint_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);

-- Add updated_at trigger for proposal_settings
CREATE OR REPLACE FUNCTION update_proposal_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposal_settings_updated_at
  BEFORE UPDATE ON proposal_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_proposal_settings_updated_at();

-- Add updated_at trigger for proposals
CREATE OR REPLACE FUNCTION update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_proposals_updated_at();
