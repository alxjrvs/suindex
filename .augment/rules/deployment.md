---
type: 'context_file'
paths: ['.github/workflows/**/*.yml', 'public/_redirects']
---

# Deployment

## Platform

- **Host**: GitHub Pages (not Netlify)
- **URL**: Configured via GitHub Pages settings
- **SPA routing**: `public/_redirects` handles client-side routing

## CI/CD Pipeline

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on: Push to `main`, PRs
   - Steps: Lint → Format → Typecheck → Test → Build
2. **Deploy Workflow** (`.github/workflows/deploy.yml`)
   - Runs on: CI success on `main` branch
   - Deploys `dist/` to GitHub Pages

## Build Process

```bash
bun install --frozen-lockfile  # Install deps
bun run build                  # TypeScript compile + Vite build
```

## Environment Variables

- Set in GitHub repository secrets
- Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_GA_MEASUREMENT_ID`, `VITE_SHOW_DISCORD_SIGNIN`

## SPA Routing

- `public/_redirects` contains: `/* /index.html 200`
- Ensures all routes serve `index.html` for client-side routing

## Documentation

- **GitHub Pages**: https://docs.github.com/en/pages
- **GitHub Actions**: https://docs.github.com/en/actions
