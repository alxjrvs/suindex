---
type: 'always_apply'
---

# Deployment

## Platform

- **Host**: Netlify
- **Framework**: TanStack Start with SSR
- **URL**: Configured via Netlify dashboard
- **Adapter**: `@netlify/vite-plugin-tanstack-start`

## CI/CD Pipeline

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on: Push to `main`, PRs
   - Steps: Lint → Format → Typecheck → Test → Build
2. **Netlify Deployment**
   - Automatic deployments from GitHub
   - Triggered on push to `main` branch
   - Build command: `vite build`
   - Publish directory: `dist/client`
   - SSR functions deployed to Netlify serverless functions

## Build Process

```bash
bun install --frozen-lockfile  # Install deps
vite build                     # TanStack Start build (client + server)
```

## Environment Variables

- Set in Netlify dashboard (Site settings → Environment variables)
- Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_GA_MEASUREMENT_ID`, `VITE_SHOW_DISCORD_SIGNIN`

## SSR Configuration

- **Reference pages** (`/`, `/schema/*`) - Server-side rendered
- **Dashboard pages** (`/dashboard/*`) - Client-side only (SPA)
- **Server functions** - Auth and data fetching on server
- **Static prerendering** - All reference pages pre-generated at build time

## Local Development

- Run `bun dev` to start dev server with full Netlify platform emulation
- No need for Netlify CLI - the Vite plugin provides:
  - Serverless functions
  - Edge functions
  - Blobs, Cache API, Image CDN
  - Redirects, headers, environment variables

## Documentation

- **TanStack Start on Netlify**: https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/
- **Netlify**: https://docs.netlify.com/
- **TanStack Start**: https://tanstack.com/start/latest
- **GitHub Actions**: https://docs.github.com/en/actions
