---
type: 'context_file'
paths: ['src/routes/**/*.tsx', 'src/router.tsx']
---

# TanStack Start Optimization Guide

## Current Architecture

- **SSR Routes**: Reference pages (`/schema/*`, `/`) - Static content, SEO-critical
- **SPA Routes**: Dashboard (`/dashboard/*`) - Auth-required, dynamic user data
- **Hybrid**: Root route with server-side user fetching

## Recommended Optimizations

### 1. Static Prerendering for Reference Pages

Reference pages are perfect candidates for static prerendering since game data rarely changes.

**Benefits**:

- Instant page loads (no server computation)
- Better SEO (fully rendered HTML)
- Reduced server costs
- Works offline

**Implementation**:

```typescript
// src/routes/schema/$schemaId/index.tsx
export const Route = createFileRoute('/schema/$schemaId/')({
  component: SchemaViewerPage,
  loader: ({ params }) => {
    const schema = schemaIndexData.schemas.find((s) => s.id === params.schemaId)
    return { schemas: schemaIndexData.schemas, schema }
  },
  staticData: {
    ssr: true,
    prerender: true, // ← Add this
  },
})
```

**Prerender Configuration** (add to `src/prerender.config.ts`):

```typescript
import { getSchemaCatalog } from 'salvageunion-reference'

const catalog = getSchemaCatalog()

export default {
  routes: [
    '/',
    ...catalog.schemas.map((schema) => `/schema/${schema.id}`),
    // Add item detail pages if needed
  ],
}
```

### 2. Route-Level Code Splitting

Split large components to reduce initial bundle size.

**Current**: All dashboard routes loaded upfront
**Optimized**: Lazy load dashboard routes

```typescript
// src/routes/dashboard/pilots/$id.tsx
import { lazy } from 'react'

const PilotEdit = lazy(() =>
  import('../../../components/Dashboard/PilotEdit').then((m) => ({ default: m.PilotEdit }))
)

export const Route = createFileRoute('/dashboard/pilots/$id')({
  component: PilotEdit,
  staticData: { ssr: false },
})
```

### 3. Data Prefetching

Prefetch data on hover/intent for instant navigation.

```typescript
// Already configured in router.tsx
export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent', // ✅ Already optimized
    context: { queryClient },
  })
  return router
}
```

### 4. Server Functions for Auth

Move auth checks to server functions for better security.

```typescript
// src/lib/auth.server.ts
import { createServerFn } from '@tanstack/react-start'

export const requireAuth = createServerFn('GET', async () => {
  const user = await fetchCurrentUser()
  if (!user) {
    throw redirect({ to: '/dashboard', search: { auth: 'required' } })
  }
  return user
})
```

### 5. Optimize salvageunion-reference Loading

The reference package is large - optimize its loading.

**vite.config.ts**:

```typescript
optimizeDeps: {
  exclude: ['salvageunion-reference'], // ✅ Already done
},
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'salvage-union': ['salvageunion-reference'], // ✅ Already done
      },
    },
  },
},
```

### 6. Streaming SSR (Advanced)

For complex pages, stream HTML as it renders.

```typescript
export const Route = createFileRoute('/schema/$schemaId/')({
  component: SchemaViewerPage,
  staticData: {
    ssr: true,
    streaming: true, // ← Enable streaming
  },
})
```

### 7. Error Boundaries per Route

Add route-specific error handling.

```typescript
export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  errorComponent: DashboardError,
  staticData: { ssr: false },
})
```

## Priority Recommendations

### High Priority (Immediate Impact)

1. ✅ **Static prerendering** for `/schema/*` routes - Biggest performance win
2. **Route-level code splitting** for dashboard - Reduce initial bundle

### Medium Priority (Nice to Have)

3. **Server functions for auth** - Better security
4. **Error boundaries per route** - Better UX

### Low Priority (Already Optimized)

5. ✅ Data prefetching - Already using `defaultPreload: 'intent'`
6. ✅ Code splitting - Already using manual chunks

## Documentation

- **TanStack Start Prerendering**: https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering
- **TanStack Start Server Functions**: https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
- **TanStack Router Preloading**: https://tanstack.com/router/latest/docs/framework/react/guide/preloading
