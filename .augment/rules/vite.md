---
type: 'always_apply'
---

# Vite Build Configuration

## TanStack Start + Vite Configuration

- **Config**: `vite.config.ts`
- **Framework**: TanStack Start with SSR
- **TanStack Start plugin**: `@tanstack/react-start/plugin/vite` - **MUST be first plugin**
- **Netlify plugin**: `@netlify/vite-plugin-tanstack-start` for Netlify deployment
- **React plugin**: `@vitejs/plugin-react` with automatic JSX runtime
- **Compression**: gzip enabled via `vite-plugin-compression`
- **Analytics**: Google Analytics 4 via `vite-plugin-radar`

## Plugin Ordering

**CRITICAL**: The `tanstackStart()` plugin **MUST** come before the `react()` plugin in the plugins array. This ensures proper React JSX transformation for both client and server rendering.

```typescript
export default defineConfig({
  plugins: [
    tanstackStart(), // MUST be first
    react({
      jsxRuntime: 'automatic',
    }),
    netlify(), // Netlify deployment plugin
    // ... other plugins
  ],
})
```

## Build Optimization

```typescript
// Manual chunks for vendor code splitting
manualChunks: {
  vendor: ['react', 'react-dom'],
  router: ['@tanstack/react-router', '@tanstack/react-start'],
  'salvage-union': ['salvageunion-reference'],
}
```

## Environment Variables

- Access via `import.meta.env.VITE_*` in **runtime code only**
- Use `process.env.VITE_*` in **Vite config** (build-time)
- See `.env.example` for required variables

## Documentation

- **Vite docs**: https://vite.dev/
- **Env variables**: https://vite.dev/guide/env-and-mode.html
