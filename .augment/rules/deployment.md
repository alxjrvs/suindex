---
type: 'context_file'
paths: ['.github/workflows/**/*.yml', 'public/_redirects']
---

# Deployment

## Platform

- **Host**: Netlify
- **Framework**: TanStack Start with SSR
- **Plugin**: `@netlify/vite-plugin-tanstack-start` for Netlify Functions integration
- **Routing**: Automatic SSR/SPA routing via TanStack Start

## CI/CD Pipeline

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on: Push to `main`, PRs
   - Steps: Lint → Format → Typecheck → Test → Build
2. **Netlify Deploy**
   - Automatic deployment on push to `main`
   - Builds using `bun run build`
   - Deploys to Netlify Functions for SSR routes

## Build Process

```bash
bun install --frozen-lockfile  # Install deps
bun run build                  # TanStack Start build (client + server)
```

## Environment Variables

- Set in Netlify environment variables
- Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_GA_MEASUREMENT_ID`, `VITE_SHOW_DISCORD_SIGNIN`

## SSR Configuration

- **Reference pages**: SSR enabled (`ssr: true` in route config)
- **Dashboard**: SPA mode (`ssr: false` in route config)
- **Server functions**: Use `createServerFn` from `@tanstack/react-start`

## Documentation

- **Netlify**: https://docs.netlify.com/
- **TanStack Start Hosting**: https://tanstack.com/start/latest/docs/framework/react/guide/hosting
- **Netlify Functions**: https://docs.netlify.com/functions/overview/
