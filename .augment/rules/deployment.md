---
type: 'context_file'
paths: ['.github/workflows/**/*.yml', 'public/_redirects']
---

# Deployment

## Platform

- **Host**: Netlify
- **URL**: Configured via Netlify dashboard
- **SPA routing**: `public/_redirects` handles client-side routing

## CI/CD Pipeline

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on: Push to `main`, PRs
   - Steps: Lint → Format → Typecheck → Test → Build
2. **Netlify Deployment**
   - Automatic deployments from GitHub
   - Triggered on push to `main` branch
   - Build command: `bun run build`
   - Publish directory: `dist`

## Build Process

```bash
bun install --frozen-lockfile  # Install deps
bun run build                  # TypeScript compile + Vite build
```

## Environment Variables

- Set in Netlify dashboard (Site settings → Environment variables)
- Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_GA_MEASUREMENT_ID`, `VITE_SHOW_DISCORD_SIGNIN`

## SPA Routing

- `public/_redirects` contains: `/* /index.html 200`
- Ensures all routes serve `index.html` for client-side routing
- Netlify automatically processes this file during deployment

## Documentation

- **Netlify**: https://docs.netlify.com/
- **Netlify SPA routing**: https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps
- **GitHub Actions**: https://docs.github.com/en/actions
