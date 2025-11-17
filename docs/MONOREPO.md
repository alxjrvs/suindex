# Monorepo Setup Guide

This repository has been converted to a Bun monorepo structure.

## Structure

```
.
├── apps/
│   └── suref-web/              # Main web application
│       ├── src/              # Application source code
│       ├── public/           # Public assets
│       ├── package.json      # App dependencies
│       └── vite.config.ts    # Vite configuration
├── packages/
│   └── salvageunion-reference/  # Salvage Union game data package
│       ├── lib/              # Package source code
│       ├── data/             # JSON data files
│       ├── schemas/          # JSON schemas
│       └── package.json      # Package dependencies
├── package.json              # Root workspace configuration
└── netlify.toml             # Netlify deployment config
```

## Key Changes

### Workspace Configuration

- Root `package.json` uses Bun workspaces to manage `apps/*` and `packages/*`
- The `suref-web` app now references `salvageunion-reference` as `workspace:*` instead of an npm version
- All workspace scripts delegate to the appropriate package

### Build Process

1. **Development**: The package is used directly from source (Bun handles this)
2. **Production**: The package must be built first to generate `dist/` with type definitions
3. **CI/CD**: Both Netlify and GitHub Actions build the package before building the app

### Important Notes

- The `salvageunion-reference` package must be built before TypeScript can resolve its types
- The build script may fail on lint, but this is handled gracefully in CI/CD
- All imports continue to use `salvageunion-reference` - no code changes needed

## Workspace Configuration

The monorepo uses Bun workspaces to link the local `salvageunion-reference` package:

- **Root `package.json`**: Defines workspaces for `apps/*` and `packages/*`
- **App `package.json`**: Uses `"salvageunion-reference": "workspace:*"` to reference the local package
- **Vite config**: Includes an alias to ensure proper resolution of the workspace package
- **Symlink**: Bun creates `apps/suref-web/node_modules/salvageunion-reference -> ../../../packages/salvageunion-reference`

This ensures that:
- ✅ The app always uses the local package, not a published version
- ✅ Changes to the package are immediately available (after rebuild)
- ✅ TypeScript resolves types from the local package
- ✅ Vite bundles the local package correctly

## Development Workflow

### First Time Setup

```bash
# Install all dependencies (this sets up workspace links)
bun install

# Build the reference package (required for types and runtime)
bun run build:package
```

### Daily Development

```bash
# From root - runs suref-web dev
bun run dev

# Or from app directory
cd apps/suref-web
bun run dev
```

### Making Changes to salvageunion-reference

1. Edit files in `packages/salvageunion-reference/lib/` or `packages/salvageunion-reference/data/`
2. Rebuild the package:
   ```bash
   bun run build:package:quick  # Quick rebuild (dev mode)
   # or
   bun run build:package        # Full rebuild (includes tests/lint)
   ```
3. Changes are immediately available to `suref-web` via workspace linking
4. No need to reinstall or relink - the symlink persists

**Note**: The package must be built (`bun run build`) for:
- TypeScript types to resolve (`dist/index.d.ts`)
- Runtime code to work (`dist/index.js`)
- The app to import the package correctly

## Deployment

### Netlify

The `netlify.toml` is configured to:
1. Install dependencies
2. Build the reference package
3. Build the app
4. Publish from `apps/suref-web/dist/client`

### GitHub Actions

The CI workflow:
1. Installs all dependencies
2. Builds the reference package
3. Runs lint, format check, typecheck, tests
4. Builds the app

## Troubleshooting

### TypeScript can't find salvageunion-reference

**Solution**: Build the package first:
```bash
bun run build:package:quick
```

### Build fails on lint

The package build includes linting. Fix lint errors or use quick build:
```bash
bun run build:package:quick  # Skips lint
```

### Workspace not linking

Ensure you've run `bun install` from the root directory to set up workspace links.

