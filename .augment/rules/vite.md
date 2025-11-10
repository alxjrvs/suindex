---
type: 'context_file'
paths: ['vite.config.ts', '.env.example']
---

# Vite Build Configuration

## Setup

- **Config**: `vite.config.ts`
- **TanStack Start**: Using `tanstackStart()` plugin from `@tanstack/react-start/plugin/vite`
- **Compression**: gzip enabled via `vite-plugin-compression`
- **Analytics**: Google Analytics 4 via `vite-plugin-radar`

## TanStack Start Configuration

```typescript
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tanstackStart(), // Must be first
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

- **Vite docs**: <https://vite.dev/>
- **TanStack Start**: <https://tanstack.com/start/latest/docs/framework/react/getting-started>
- **Env variables**: <https://vite.dev/guide/env-and-mode.html>
