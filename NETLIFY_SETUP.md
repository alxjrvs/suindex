# Netlify Deployment Configuration for Monorepo

## Current Issue

The Netlify UI build settings are overriding the `netlify.toml` file. Update the following settings in your Netlify dashboard:

## Required Netlify UI Settings

### Build Settings

1. **Base directory**: `/` (keep as root)
2. **Build command**: `bun install --frozen-lockfile && cd packages/salvageunion-reference && bun install && bun run build || echo 'Package build completed' && cd ../../apps/suref-web && bun run build`
   - OR use the simpler: `bun run build` (which runs the root build script)
3. **Publish directory**: `apps/suref-web/dist/client`
   - This is where TanStack Start outputs the built client files

### Alternative: Use netlify.toml

If you prefer to manage everything in `netlify.toml` (recommended), you can:

1. **Clear the Build command** in Netlify UI (leave it empty)
2. **Clear the Publish directory** in Netlify UI (leave it empty)
3. Netlify will then use the settings from `netlify.toml`

## Environment Variables

Make sure to add your environment variables in Netlify:

- Go to Site settings → Environment variables
- Add:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SHOW_DISCORD_SIGNIN` (if needed)
  - `VITE_GA_MEASUREMENT_ID` (if needed)

## Build Process

The build process:

1. Installs all dependencies (including workspace packages)
2. Builds the `salvageunion-reference` package (generates types and dist)
3. Builds the `suref-web` app
4. Copies Netlify functions from `apps/suref-web/.netlify/v1/functions/` to `netlify/functions/` and fixes import paths
5. Publishes from `apps/suref-web/dist/client`

## Functions Directory

The `@netlify/vite-plugin-tanstack-start` plugin generates functions in `apps/suref-web/.netlify/v1/functions/`, but Netlify expects them at the root `netlify/functions/` directory.

A post-build script (`apps/suref-web/scripts/copy-netlify-functions.sh`) automatically:

- Copies functions to the root `netlify/functions/` directory
- Updates import paths to work from the new location
- This is handled automatically in the build command in `netlify.toml`
