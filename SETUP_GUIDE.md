# KoreTek Monorepo Setup Guide

## ✅ What's Been Built

Your monorepo now has:

1. **Turborepo + pnpm workspaces** - Modern monorepo structure
2. **Portfolio App** - Your existing Next.js portfolio (in `apps/portfolio`)
3. **Project Estimator Tool** - New AI-powered lead generation tool (in `apps/estimator`)
4. **Shared Packages**:
   - `@repo/ui` - Shared React components
   - `@repo/ai` - OpenRouter AI wrapper
   - `@repo/database` - Supabase client
   - `@repo/typescript-config` - Shared TS configs

## 🚀 Quick Start

### 1. Set Up OpenRouter (Required for Estimator)

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up and create an API key
3. Add $5-10 credits (estimates cost ~$0.01 each)
4. Create `apps/estimator/.env.local`:

```bash
OPENROUTER_API_KEY=your_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Optional for now (for lead storage):
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 2. Set Up Supabase (Optional - for lead storage)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run this:

```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text not null,
  company text,
  project_description text not null,
  estimate jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table leads enable row level security;

create policy "Enable insert for API" on leads
  for insert with check (true);

create policy "Enable select for authenticated users" on leads
  for select using (auth.role() = 'authenticated');

create index leads_email_idx on leads(email);
create index leads_created_at_idx on leads(created_at desc);
```

4. Get your URL and anon key from Settings → API
5. Add to `apps/estimator/.env.local`

### 3. Run the Apps

```bash
# Install dependencies
pnpm install

# Run all apps
pnpm dev

# Or run specific apps
pnpm --filter @repo/portfolio dev     # Portfolio on :3002
pnpm --filter @repo/estimator dev     # Estimator on :3001
```

## 📁 Project Structure

```
koretek-monorepo/
├── apps/
│   ├── portfolio/          # Your Next.js portfolio
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   │
│   └── estimator/          # AI Project Estimator
│       ├── app/
│       │   ├── page.tsx            # Landing page
│       │   ├── estimate/page.tsx   # Results page
│       │   └── api/
│       │       ├── generate-estimate/route.ts
│       │       └── save-lead/route.ts
│       ├── .env.example
│       ├── README.md
│       └── package.json
│
├── packages/
│   ├── ui/                 # Shared React components
│   │   └── src/
│   │       ├── button.tsx
│   │       └── card.tsx
│   │
│   ├── ai/                 # OpenRouter AI wrapper
│   │   └── src/
│   │       ├── openrouter.ts    # OpenRouter client
│   │       ├── estimator.ts     # Estimator logic
│   │       ├── claude.ts        # Direct Anthropic (optional)
│   │       └── types.ts
│   │
│   ├── database/           # Supabase utilities
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   └── SCHEMA.md
│   │
│   └── typescript-config/  # Shared TS configs
│       ├── base.json
│       ├── nextjs.json
│       └── react.json
│
├── turbo.json             # Turborepo config
├── pnpm-workspace.yaml    # Workspace config
└── package.json           # Root package.json
```

## 🎯 How the Estimator Works

### User Flow:
1. User visits `http://localhost:3001`
2. Enters project description (e.g., "I want an Uber for pets")
3. AI (Claude 3.5 via OpenRouter) analyzes the description
4. Results page shows:
   - Pricing estimate with breakdown
   - Timeline with phases
   - Recommended tech stack
   - Core features list
   - Potential risks
   - Follow-up questions
5. User can request full proposal → enters email
6. Lead saved to Supabase database

### Cost:
- **Per estimate**: ~$0.003-0.015 (very cheap!)
- **OpenRouter credits**: Start with $5-10
- You can switch to cheaper models in `packages/ai/src/estimator.ts`

## 🔧 Common Commands

```bash
# Development
pnpm dev                              # Run all apps
pnpm --filter @repo/estimator dev     # Run estimator only
pnpm --filter @repo/portfolio dev     # Run portfolio only

# Build
pnpm build                            # Build all apps
pnpm --filter @repo/estimator build   # Build estimator only

# Clean
pnpm clean                            # Clean all build artifacts
```

## 🎨 Customization

### Change AI Model

Edit `packages/ai/src/estimator.ts`:

```ts
// Current: Claude 3.5 Sonnet (best quality, ~$0.015/estimate)
model: MODELS.CLAUDE_35_SONNET,

// Cheaper alternatives:
model: MODELS.CLAUDE_3_HAIKU,    // Faster, ~$0.001/estimate
model: MODELS.GPT_35_TURBO,      // Even cheaper

// More expensive but better:
model: MODELS.CLAUDE_3_OPUS,     // Best quality
model: MODELS.GPT_4_TURBO,       // OpenAI's best
```

### Customize Pricing/Timeline

Edit the system prompt in `packages/ai/src/estimator.ts` around line 10.

### Change Styling

All apps use Tailwind CSS:
- Edit `apps/estimator/tailwind.config.ts` for colors/theme
- Components are in `apps/estimator/app/`

## 📊 Using the Estimator for Lead Gen

### SEO Tips:
1. Deploy to production domain
2. Add blog posts like "How much does it cost to build an app?"
3. Share on social media with example estimates
4. Add to your website footer/navbar

### Conversion Optimization:
1. The estimator captures emails for "full proposals"
2. Follow up with:
   - Personalized email with PDF proposal
   - Book a call CTA
   - Case studies of similar projects
3. Track leads in Supabase dashboard

### Marketing Ideas:
- "Free AI Project Estimator - Get Instant Pricing"
- Share on Product Hunt, Reddit, Twitter
- Use in cold outreach: "I ran your idea through our estimator..."
- Embed in proposals: "Try our estimator for other ideas"

## 🚢 Deployment

### Vercel (Recommended)

Each app can be deployed separately:

```bash
# Deploy estimator
cd apps/estimator
vercel --prod

# Deploy portfolio
cd apps/portfolio
vercel --prod
```

Or deploy from root and configure build settings:
- **Portfolio**: Root Directory = `apps/portfolio`
- **Estimator**: Root Directory = `apps/estimator`

Remember to add environment variables in Vercel dashboard!

### Environment Variables for Production

**Estimator:**
- `OPENROUTER_API_KEY` ✅ Required
- `NEXT_PUBLIC_SITE_URL` - Your production URL
- `NEXT_PUBLIC_SUPABASE_URL` - Optional
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Optional

## 📚 Next Steps

### For the Estimator:
- [ ] Set up OpenRouter API key
- [ ] Test with various project descriptions
- [ ] Set up Supabase for lead storage
- [ ] Deploy to production
- [ ] Add to your website
- [ ] Track conversion rates

### Future Features:
- [ ] PDF generation for proposals
- [ ] Email sending (Resend integration)
- [ ] Admin dashboard to view leads
- [ ] Multiple AI model options for users
- [ ] Save/share estimate links
- [ ] Integrate with CRM

### For the Monorepo:
- [ ] Add more internal tools
- [ ] Extract common components to `@repo/ui`
- [ ] Set up CI/CD with GitHub Actions
- [ ] Add testing

## 🆘 Troubleshooting

**"OpenRouter API error"**
- Check your API key is correct
- Make sure you have credits
- Check the console for specific error

**Build fails**
- Run `pnpm install` again
- Delete `.next` folders and rebuild
- Check for TypeScript errors

**Supabase errors**
- Verify your URL and anon key
- Check RLS policies
- Make sure table exists (run SQL migration)

## 📖 Documentation

- **Main README**: Root `README.md`
- **Estimator README**: `apps/estimator/README.md`
- **Database Schema**: `packages/database/SCHEMA.md`
- **OpenRouter Docs**: [openrouter.ai/docs](https://openrouter.ai/docs)
- **Turborepo Docs**: [turbo.build/repo](https://turbo.build/repo)

---

**Ready to get your first lead?**

1. Set up OpenRouter API key
2. Run `pnpm --filter @repo/estimator dev`
3. Visit http://localhost:3001
4. Test with: "I want an app like Uber but for dog walking"
5. See the magic happen! ✨
