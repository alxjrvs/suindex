---
type: 'context_file'
paths: ['vite.config.ts', '.env.example']
---

# TanStack Start + Vite Build Configuration

## Setup

- **Config**: `vite.config.ts`
- **Framework**: TanStack Start with SSR
- **Deployment**: Netlify via `@netlify/vite-plugin-tanstack-start`
- **React plugin**: `@vitejs/plugin-react` with automatic JSX runtime
- **Compression**: gzip enabled via `vite-plugin-compression`
- **Analytics**: Google Analytics 4 via `vite-plugin-radar`

## Build Optimization

```typescript
// Dynamic chunks for vendor code splitting (SSR-compatible)
manualChunks: (id) => {
  if (id.includes('node_modules')) {
    if (id.includes('react') || id.includes('@tanstack/react-router')) {
      return 'vendor'
    }
    if (id.includes('salvageunion-reference')) {
      return 'salvage-union'
    }
  }
}
```

## Static Prerendering

- **Config**: `src/prerender.config.ts`
- **Generates**: All reference pages (landing, schema indexes, item details)
- **Filter**: Configured in `vite.config.ts` via `tanstackStart({ prerender: { filter } })`

## Environment Variables

- Access via `import.meta.env.VITE_*` in **runtime code only**
- Use `process.env.VITE_*` in **Vite config** (build-time)
- See `.env.example` for required variables

## Documentation

- **TanStack Start**: https://tanstack.com/start/latest
- **Vite docs**: https://vite.dev/
- **Env variables**: https://vite.dev/guide/env-and-mode.html
