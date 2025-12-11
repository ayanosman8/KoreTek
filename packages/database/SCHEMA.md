# Database Schema

## Quick Setup

**Copy the entire contents of `setup.sql` and paste into Supabase SQL Editor!**

File location: `packages/database/setup.sql`

Or follow the detailed instructions below.

## Supabase Tables

### `estimates` table

Stores ALL generated estimates (for analytics and tracking).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| project_description | TEXT | User's project description |
| estimate | JSONB | Full AI-generated estimate |
| created_at | TIMESTAMP | When estimate was created |

**Access**: Public can insert, authenticated users can view all

### `leads` table

Stores project leads when users request a full proposal.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Lead's name (optional) |
| email | TEXT | Lead's email (required) |
| company | TEXT | Company name (optional) |
| project_description | TEXT | Project description |
| estimate | JSONB | Associated estimate |
| created_at | TIMESTAMP | When lead was created |
| updated_at | TIMESTAMP | When lead was updated |

**Access**: Public can insert, authenticated users can view all

## Setting Up Authentication

Supabase Auth is enabled by default. To create admin users:

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Users"
3. Click "Add user" → "Create new user"
4. Enter email and password for your admin account
5. Click "Create user"

**Important**: Only create accounts for team members who need access to internal tools.

## Running Migrations

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL for both tables above
4. Run the query

## Environment Variables

Make sure to set these in your `.env.local` for all apps that need database/auth:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Row Level Security (RLS)

All tables have RLS enabled:
- **estimates**: Public can insert (for the estimator form), authenticated users can view all
- **leads**: Public can insert (for lead capture), authenticated users can view all
- **auth.users**: Managed by Supabase Auth, only accessible by authenticated users
