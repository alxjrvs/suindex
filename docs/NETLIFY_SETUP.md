# Netlify Deployment Configuration for Monorepo

## Site Information

- **Production URL**: `https://salvageunion.io`
- **Netlify URL**: `https://suindex.netlify.app`

## Required Netlify UI Settings

### Build Settings

1. **Base directory**: `/` (keep as root)
2. **Build command**: Leave empty (uses `netlify.toml`)
3. **Publish directory**: Leave empty (uses `netlify.toml`)

The `netlify.toml` file in `apps/suref-web/` contains all build configuration:

- Build command: `bun install --frozen-lockfile && bun run build:package && bun --filter suref-web build`
- Publish directory: `apps/suref-web/dist/client`

## Environment Variables

Make sure to add your environment variables in Netlify:

- Go to Site settings → Environment variables
- Add the following:

### Required Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional Variables

- `VITE_SITE_URL` - Site URL for sitemap generation (defaults to `https://salvageunion.io`)
  - For production: `https://salvageunion.io`
  - For previews: `https://suindex.netlify.app` (or leave unset to auto-detect from Netlify)
- `VITE_SHOW_DISCORD_SIGNIN` - Enable Discord sign-in button (if needed)
- `VITE_GA_MEASUREMENT_ID` - Google Analytics measurement ID (if needed)

## Build Process

The build process:

1. Installs all dependencies (including workspace packages)
2. Builds the `salvageunion-reference` package (generates types and dist)
3. Builds the `suref-web` app with TanStack Start
4. The `@netlify/vite-plugin-tanstack-start` plugin automatically handles:
   - Generating Netlify serverless functions for SSR routes
   - Placing functions in the correct location
   - Configuring function routing
5. Publishes from `apps/suref-web/dist/client`

## Netlify Functions

The `@netlify/vite-plugin-tanstack-start` plugin automatically handles function generation and placement. No manual configuration is needed. The plugin:

- Generates serverless functions for routes that use SSR (`staticData.ssr: true`)
- Places functions in the correct location for Netlify
- Handles routing automatically

Routes with `staticData.ssr: false` are prerendered as static files.

## Configuration Features

The `netlify.toml` file includes:

### Redirects

- SPA catch-all redirect for client-side routing (`/*` → `/index.html` with status 200)

### Headers

- **Security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, Content-Security-Policy
- **Caching headers**: Long-term caching for static assets and images, no-cache for HTML files

### Asset Optimization

- CSS bundling and minification
- JavaScript bundling and minification
- HTML pretty URLs
- Image compression

## Sitemap and SEO

The sitemap is automatically generated during build with:

- All prerendered routes from the reference data
- Configurable hostname via `VITE_SITE_URL` environment variable
- Defaults to `https://salvageunion.io` for production
- Auto-detects Netlify preview URLs if `NETLIFY_URL` is available

The `robots.txt` file is also generated with appropriate allow/disallow rules.
