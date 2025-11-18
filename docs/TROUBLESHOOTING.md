# Troubleshooting Guide

Common issues and solutions when working with SURef.

## Setup Issues

### TypeScript can't find salvageunion-reference

**Symptoms:**

- Type errors: `Cannot find module 'salvageunion-reference'`
- IDE can't resolve imports from the package

**Solutions:**

1. Build the reference package:

   ```bash
   bun run build:package:quick
   ```

2. Restart TypeScript server in your editor:
   - VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

3. Verify workspace link:
   ```bash
   ls -la apps/suref-web/node_modules/salvageunion-reference
   # Should be a symlink to ../../../packages/salvageunion-reference
   ```

### Workspace not linking correctly

**Symptoms:**

- Package imports fail at runtime
- `bun install` doesn't create symlink

**Solutions:**

1. Reinstall dependencies:

   ```bash
   rm -rf node_modules apps/suref-web/node_modules packages/salvageunion-reference/node_modules
   bun install
   ```

2. Verify workspace configuration in `package.json`:

   ```json
   {
     "workspaces": ["apps/*", "packages/*"]
   }
   ```

3. Check package dependency uses `workspace:*`:
   ```json
   {
     "dependencies": {
       "salvageunion-reference": "workspace:*"
     }
   }
   ```

### Missing environment variables

**Symptoms:**

- `Error: Missing Supabase environment variables`
- App fails to connect to Supabase

**Solutions:**

1. Create `.env` file from `.env.example`:

   ```bash
   cp apps/suref-web/.env.example apps/suref-web/.env
   ```

2. Fill in required variables:

   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-key
   ```

3. Restart dev server after adding env vars

## Build Issues

### Build fails with lint errors

**Symptoms:**

- `bun run build` fails with ESLint errors

**Solutions:**

1. Run lint with auto-fix:

   ```bash
   bun run lint -- --fix
   ```

2. Or use quick build (skips lint):
   ```bash
   bun run build:package:quick
   ```

### Build fails with type errors

**Symptoms:**

- TypeScript compilation errors during build

**Solutions:**

1. Check types locally:

   ```bash
   bun run typecheck
   ```

2. Ensure reference package is built:

   ```bash
   bun run build:package:quick
   ```

3. Check for missing type definitions:
   ```bash
   bun install
   ```

### Package build takes too long

**Symptoms:**

- `bun run build:package` is slow during development

**Solutions:**

1. Use quick build for development:

   ```bash
   bun run build:package:quick
   ```

2. Use watch mode for continuous builds:
   ```bash
   bun run build:package:watch
   ```

## Development Issues

### Hot reload not working

**Symptoms:**

- Changes don't reflect in browser automatically

**Solutions:**

1. Check Vite dev server is running:

   ```bash
   bun run dev
   ```

2. Clear Vite cache:

   ```bash
   rm -rf apps/suref-web/.vite
   bun run dev
   ```

3. Hard refresh browser (`Cmd/Ctrl + Shift + R`)

### Path aliases not resolving

**Symptoms:**

- `Cannot find module '@/...'` errors
- IDE doesn't autocomplete path aliases

**Solutions:**

1. Verify `tsconfig.json` has path aliases:

   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. Verify `vite.config.ts` has alias resolution:

   ```ts
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
     },
   }
   ```

3. Restart TypeScript server in editor

### Pre-commit hooks not running

**Symptoms:**

- Commits don't trigger lint/format/typecheck

**Solutions:**

1. Install husky:

   ```bash
   bun run prepare
   ```

2. Verify `.husky/pre-commit` exists and is executable:

   ```bash
   ls -la .husky/pre-commit
   chmod +x .husky/pre-commit
   ```

3. Check husky is installed:
   ```bash
   bunx husky install
   ```

### Tests failing

**Symptoms:**

- `bun run test` fails unexpectedly

**Solutions:**

1. Check test environment variables in `bunfig.toml`
2. Clear test cache:

   ```bash
   rm -rf node_modules/.cache
   ```

3. Run specific test for debugging:
   ```bash
   bun test path/to/test.test.ts
   ```

## Runtime Issues

### Supabase connection errors

**Symptoms:**

- `Failed to fetch` errors
- Authentication fails

**Solutions:**

1. Verify environment variables are set correctly
2. Check Supabase project is active
3. Verify network connectivity
4. Check browser console for detailed error messages

### Error Boundary showing errors

**Symptoms:**

- Error Boundary UI appears in app

**Solutions:**

1. Check error details in Error Boundary UI
2. Check browser console for stack traces
3. Review recent code changes
4. Check for missing dependencies or imports

### Real-time subscriptions not working

**Symptoms:**

- Database changes don't update UI automatically

**Solutions:**

1. Verify Supabase realtime is enabled for tables
2. Check subscription is set up correctly in hooks
3. Verify user has permissions (RLS policies)
4. Check browser console for subscription errors

## Git Issues

### Pre-commit hooks too slow

**Symptoms:**

- Commits take a long time due to hooks

**Solutions:**

1. Temporarily bypass (not recommended):

   ```bash
   git commit --no-verify
   ```

2. Optimize hook configuration in `.lintstagedrc.json`
3. Run checks manually before committing:
   ```bash
   bun run sanity
   ```

### Merge conflicts in generated files

**Symptoms:**

- Conflicts in `routeTree.gen.ts` or `database-generated.types.ts`

**Solutions:**

1. Regenerate files instead of resolving conflicts:

   ```bash
   bun run gen:all
   ```

2. Add generated files to `.gitattributes`:
   ```
   routeTree.gen.ts merge=ours
   database-generated.types.ts merge=ours
   ```

## Performance Issues

### Slow dev server startup

**Symptoms:**

- `bun run dev` takes a long time to start

**Solutions:**

1. Ensure reference package is pre-built
2. Check for large dependencies
3. Use `bun run build:package:quick` for faster builds

### Slow type checking

**Symptoms:**

- TypeScript language server is slow

**Solutions:**

1. Restart TypeScript server
2. Check for circular dependencies
3. Use incremental builds (enabled in `tsconfig.json`)

## Getting Help

If none of these solutions work:

1. Check [docs/README.md](./README.md) for general information
2. Check [docs/ARCHITECTURE.md](./ARCHITECTURE.md) for architecture details
3. Check [docs/DEVELOPMENT.md](./DEVELOPMENT.md) for development patterns
4. Search existing issues in the repository
5. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Bun version, etc.)
