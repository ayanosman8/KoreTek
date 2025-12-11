# KoreTek Monorepo

A monorepo for the agency's portfolio and internal tools, powered by **Turborepo** and **pnpm workspaces**.

## 📁 Structure

```
koretek-monorepo/
├── apps/
│   └── portfolio/          # Your existing Next.js portfolio
│       └── (intake-tool coming soon!)
├── packages/
│   ├── ui/                 # Shared React components
│   ├── database/           # Supabase client & utilities
│   ├── ai/                 # Claude API wrapper
│   └── typescript-config/  # Shared TypeScript configs
├── turbo.json             # Turborepo configuration
├── pnpm-workspace.yaml    # pnpm workspace config
└── package.json           # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 9.15+

### Installation

```bash
pnpm install
```

### Development

Run all apps in dev mode:
```bash
pnpm dev
```

Run a specific app:
```bash
pnpm --filter @repo/portfolio dev
```

### Build

Build all apps:
```bash
pnpm build
```

Build a specific app:
```bash
pnpm --filter @repo/portfolio build
```

## 📦 Packages

### `@repo/ui`
Shared React components for consistent UI across all apps.

**Usage:**
```tsx
import { Button, Card } from "@repo/ui/button";
```

### `@repo/database`
Supabase client and database utilities.

**Usage:**
```ts
import { supabase } from "@repo/database/client";
```

### `@repo/ai`
Claude API wrapper for AI-powered features.

**Usage:**
```ts
import { generateRequirements } from "@repo/ai/claude";

const result = await generateRequirements("Build an app like Uber but for pets");
```

### `@repo/typescript-config`
Shared TypeScript configurations.

**Usage in tsconfig.json:**
```json
{
  "extends": "@repo/typescript-config/nextjs.json"
}
```

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm clean` | Clean build artifacts and dependencies |
| `pnpm --filter <package> <script>` | Run a script in a specific package |

## 📝 Adding New Apps

1. Create a new directory in `apps/`
2. Add a `package.json` with name `@repo/<app-name>`
3. Install dependencies: `pnpm install`
4. The app will automatically be included in the workspace

## 🎯 Next Steps

- [ ] Build the intake tool app
- [ ] Add shared UI components from portfolio to `@repo/ui`
- [ ] Set up environment variables for AI package
- [ ] Configure Vercel/deployment for multiple apps

## 📚 Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js](https://nextjs.org/docs)
