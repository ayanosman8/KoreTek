# Scope AI

Smart project estimation tool that generates instant estimates for web and app development projects.

## Features

- **Smart Analysis**: Uses OpenRouter + Claude 3.5 Sonnet to analyze project descriptions
- **Instant Estimates**: Get pricing, timeline, tech stack, and feature breakdowns in seconds
- **Lead Capture**: Collects emails for detailed proposals
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Database Integration**: Stores all estimates and leads in Supabase
- **Admin Dashboard**: Protected admin panel to view all estimates and leads
- **Authentication**: Supabase Auth protects internal tools

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **AI**: OpenRouter (Claude 3.5 Sonnet)
- **Database**: Supabase (PostgreSQL)
- **Shared Packages**: `@repo/ai`, `@repo/database`, `@repo/ui`

## Setup

### 1. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create `.env.local` in this directory:

```bash
cp .env.example .env.local
```

Then fill in the values:

#### Get OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up and create an API key
3. Add credits to your account (starts at $5)
4. Copy your API key to `.env.local`

#### Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Go to Settings → API
4. Copy your URL and anon key to `.env.local`

### 3. Set Up Database

Run the SQL migration to create the database tables:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Open `packages/database/setup.sql`
4. Copy the ENTIRE contents of the file
5. Paste into the SQL Editor and click "Run"

**Note**: The `estimates` table stores ALL generated estimates for analytics, while the `leads` table stores only the estimates where users requested a full proposal.

### 4. Set Up Authentication

You have two options for authentication:

#### Option A: Google OAuth (Recommended for Teams)

1. Follow the guide: `packages/auth/GOOGLE_OAUTH_SETUP.md`
2. Configure Google OAuth in Google Cloud Console
3. Enable Google provider in Supabase
4. Team members can sign in with their Google accounts

**Benefits**: SSO, no password management, domain restriction, better security

#### Option B: Email/Password

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Users"
3. Click "Add user" → "Create new user"
4. Enter your email and a secure password
5. Click "Create user"

### 5. Run Development Server

From the monorepo root:

```bash
# Run just the estimator
pnpm --filter @repo/estimator dev

# Or run all apps
pnpm dev
```

The estimator will be available at:
- **Public estimator**: [http://localhost:3001](http://localhost:3001)
- **Admin dashboard**: [http://localhost:3001/admin](http://localhost:3001/admin)

## Admin Dashboard

Access the admin dashboard at `/admin` to view:
- **Total estimates generated** (analytics)
- **Qualified leads** (users who requested proposals)
- **Conversion rate** (leads/estimates percentage)
- **Recent leads** with contact info and project details
- **Recent estimates** with project descriptions

**Login**: Use the email and password you created in Supabase Auth

## How It Works

1. **User Input**: User describes their project idea
2. **AI Processing**: OpenRouter sends the description to Claude 3.5 Sonnet
3. **Estimate Generation**: AI analyzes and returns structured estimate
4. **Auto-Save to Database**: Estimate is automatically saved to `estimates` table (for analytics)
5. **Results Display**: Beautiful breakdown of features, pricing, timeline, tech stack
6. **Lead Capture**: User can request full proposal by entering email
7. **Lead Save**: Lead + estimate saved to `leads` table for sales follow-up

## Cost Considerations

### OpenRouter Costs

- Claude 3.5 Sonnet: ~$0.003-0.015 per estimate
- Very affordable for testing and production
- Can switch to cheaper models in `packages/ai/src/estimator.ts`

### Alternative Models

Edit `packages/ai/src/estimator.ts` to use different models:

```ts
// Cheaper options:
model: MODELS.CLAUDE_3_HAIKU,  // Faster, cheaper
model: MODELS.GPT_35_TURBO,     // Very cheap

// More expensive, better quality:
model: MODELS.GPT_4_TURBO,      // OpenAI's best
model: MODELS.CLAUDE_3_OPUS,    // Anthropic's best
```

## Customization

### Changing the Prompt

Edit the system prompt in `packages/ai/src/estimator.ts` to customize:
- Pricing ranges
- Timeline estimates
- Tech stack recommendations
- Output format

### Styling

All styles use Tailwind CSS. Edit:
- Colors in `tailwind.config.ts`
- Components in `app/**/*.tsx`

### Features to Add

- [ ] PDF generation for proposals
- [ ] Email sending with Resend
- [ ] Admin dashboard to view leads
- [ ] Analytics tracking
- [ ] Multiple AI model options for users
- [ ] Save estimates for later
- [ ] Share estimate URLs

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

Make sure to add environment variables in Vercel dashboard.

### Other Platforms

This is a standard Next.js app and can be deployed anywhere:
- Netlify
- Railway
- AWS
- Docker

## SEO Optimization

To improve search rankings:

1. Update metadata in `app/layout.tsx`
2. Add structured data for pricing/reviews
3. Create blog content around project estimation
4. Build backlinks from portfolio/case studies

## Support

For issues or questions:
- Check `packages/database/SCHEMA.md` for database setup
- See monorepo root `README.md` for workspace commands
- Review `packages/ai/src/openrouter.ts` for AI configuration
