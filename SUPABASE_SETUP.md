# Supabase Setup - Use Existing Project

## You're Already Paying for Supabase Pro!
Just add a new table to one of your 3 existing projects - **NO EXTRA COST**.

## Setup Steps:

### 1. Choose an Existing Project
1. Go to https://supabase.com/dashboard
2. Pick one of your 3 existing projects
3. This won't affect your other tables/data at all

### 2. Get Your Environment Variables
1. In the project, go to **Settings** → **API**
2. Copy these to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Create the `form_submissions` Table
1. In your project, go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL and click **Run**:

```sql
-- Create form_submissions table
CREATE TABLE form_submissions (
  id BIGSERIAL PRIMARY KEY,
  package TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_submissions_email ON form_submissions(email);
CREATE INDEX idx_submissions_submitted_at ON form_submissions(submitted_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow your app to insert submissions
CREATE POLICY "Allow public inserts"
ON form_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow you to view submissions (optional - for dashboard later)
CREATE POLICY "Allow authenticated reads"
ON form_submissions
FOR SELECT
TO authenticated
USING (true);
```

### 4. Restart Your Dev Server
```bash
npm run dev
```

### 5. Test It!
1. Submit a test form on your website
2. Go to **Table Editor** → **form_submissions** in Supabase
3. You should see your submission!

## What Gets Saved:
- Package selected
- First name, last name
- Email, phone
- Company name
- Budget range
- Timeline
- Project message
- Submission timestamp

## Benefits:
✅ Emails still sent via Resend
✅ Database backup of all submissions
✅ Easy to search/filter/export data
✅ **No extra cost** - using existing project
✅ Won't interfere with your other tables

## View Your Data:
Go to **Table Editor** → **form_submissions** anytime to see all submissions!
