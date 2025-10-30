---
type: 'context_file'
paths: ['vite.config.ts', '.env.example']
---

# Vite Build Configuration

## Setup

- **Config**: `vite.config.ts`
- **React plugin**: `@vitejs/plugin-react` with automatic JSX runtime
- **Compression**: gzip enabled via `vite-plugin-compression`
- **Analytics**: Google Analytics 4 via `vite-plugin-radar`

## Build Optimization

```typescript
// Manual chunks for vendor code splitting
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
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
