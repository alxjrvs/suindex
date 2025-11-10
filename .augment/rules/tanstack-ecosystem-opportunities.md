# TanStack Ecosystem Optimization Opportunities

## Current Stack Analysis

### ✅ Already Using

- **TanStack Start** - SSR framework with prerendering
- **TanStack Router** - File-based routing with type safety
- **TanStack Query** - Data fetching with optimistic updates
- **TanStack Query Devtools** - Development debugging

### 📦 Current Non-TanStack Libraries

- **react-hook-form** (v7.66.0) - Form state management
- **react-virtuoso** (v4.14.1) - List virtualization
- **zod** - Schema validation

---

## 🎯 High-Priority Opportunities

### 1. **TanStack Form** - Replace react-hook-form

**Current State:**

- Using `react-hook-form` but NOT extensively
- Most forms are simple controlled inputs with direct mutation calls
- Only complex form: `JoinGame.tsx` (single input + validation)
- Validation done with Zod schemas in `src/lib/validation/`

**Benefits of TanStack Form:**

- **Better TanStack integration** - Works seamlessly with TanStack Query
- **Type-safe** - First-class TypeScript support
- **Smaller bundle** - ~10KB vs react-hook-form's ~25KB
- **Zod integration** - Built-in Zod adapter (`@tanstack/zod-form-adapter`)
- **Optimistic updates** - Native support for TanStack Query patterns

**Migration Effort:** 🟢 LOW

- Only 1-2 forms to migrate
- Most inputs already use controlled state pattern
- Zod schemas already exist

**Recommendation:** ⭐⭐⭐⭐⭐ **HIGHLY RECOMMENDED**

- Perfect fit for your architecture
- Reduces bundle size
- Better DX with TanStack ecosystem

---

### 2. **TanStack Virtual** - Replace react-virtuoso

**Current State:**

- Using `react-virtuoso` in `EntitySelectionModal.tsx` (large entity lists)
- Custom `useVirtualScroll` hook in `RulesReferenceLanding.tsx` (search results)

**Benefits of TanStack Virtual:**

- **Headless** - Full control over rendering (matches your Chakra UI approach)
- **Smaller bundle** - ~5KB vs react-virtuoso's ~15KB
- **More flexible** - Easier to customize for your use cases
- **Better TypeScript** - Stronger type inference
- **TanStack ecosystem** - Consistent API patterns

**Migration Effort:** 🟡 MEDIUM

- 2 virtualization use cases to migrate
- Need to rebuild UI layer (react-virtuoso provides components, TanStack Virtual is headless)

**Recommendation:** ⭐⭐⭐⭐ **RECOMMENDED**

- Better fit for headless architecture
- Smaller bundle
- More control over rendering

---

## 🚀 Medium-Priority Opportunities

### 3. **TanStack Router Search Params** - Enhanced URL state

**Current State:**

- Not using search params for filters/state
- Schema viewer filters are local state only
- No URL-based state persistence

**Benefits:**

- **Shareable URLs** - Users can share filtered views
- **Browser history** - Back/forward navigation works
- **Type-safe** - Validated search params with Zod
- **SEO** - Better for prerendered pages

**Use Cases:**

- Schema viewer filters (tech level, search term)
- Entity selection modal filters
- Dashboard views

**Migration Effort:** 🟡 MEDIUM

- Need to add search param schemas to routes
- Update filter state management

**Recommendation:** ⭐⭐⭐ **NICE TO HAVE**

- Improves UX for reference pages
- Better SEO for filtered views

---

### 4. **TanStack Query Suspense Mode** - Simplified loading states

**Current State:**

- Manual loading/error state handling everywhere
- `LiveSheetLoadingState`, `LiveSheetErrorState` components
- Lots of `if (loading) return <Spinner />` patterns

**Benefits:**

- **Cleaner code** - No manual loading state checks
- **Better UX** - Automatic loading boundaries
- **Error boundaries** - Centralized error handling
- **Streaming SSR** - Works with TanStack Start streaming

**Migration Effort:** 🔴 HIGH

- Need to wrap components in Suspense boundaries
- Refactor all query hooks to use `suspense: true`
- Update error boundary strategy

**Recommendation:** ⭐⭐ **FUTURE CONSIDERATION**

- Large refactor for moderate benefit
- Wait for React 19 Suspense improvements

---

## 📊 Low-Priority / Not Recommended

### 5. **TanStack Table** - NOT NEEDED

- You don't have complex tables
- Current grid layouts work well
- Would add unnecessary complexity

### 6. **TanStack Ranger** - NOT NEEDED

- No range/slider inputs in your app
- Chakra UI provides slider components

### 7. **TanStack Store** - NOT NEEDED

- TanStack Query handles all state management
- No need for additional state library

---

## 📝 Action Plan

### Phase 1: Quick Wins (1-2 days)

1. ✅ **Migrate to TanStack Form**
   - Replace react-hook-form in `JoinGame.tsx`
   - Add `@tanstack/react-form` and `@tanstack/zod-form-adapter`
   - Update form validation patterns

### Phase 2: Performance (2-3 days)

2. ✅ **Migrate to TanStack Virtual**
   - Replace react-virtuoso in `EntitySelectionModal.tsx`
   - Migrate custom `useVirtualScroll` to TanStack Virtual
   - Test performance with large lists

### Phase 3: UX Enhancements (3-5 days)

3. ⚠️ **Add Search Params to Routes**
   - Schema viewer filters
   - Entity selection filters
   - Dashboard views

### Phase 4: Future (Not Scheduled)

4. ⏸️ **Suspense Mode** - Wait for React 19 stable
5. ⏸️ **Streaming SSR** - Evaluate after Suspense migration

---

## 📦 Package Changes

### Add

```bash
bun add @tanstack/react-form @tanstack/zod-form-adapter
bun add @tanstack/react-virtual
```

### Remove (after migration)

```bash
bun remove react-hook-form
bun remove react-virtuoso
```

### Bundle Size Impact

- **Before:** react-hook-form (25KB) + react-virtuoso (15KB) = **40KB**
- **After:** @tanstack/react-form (10KB) + @tanstack/react-virtual (5KB) = **15KB**
- **Savings:** **~25KB gzipped** 🎉

---

---

## 🎯 TanStack Start-Specific Optimizations

### Already Implemented ✅

1. **Static Prerendering** - All reference pages pre-rendered
2. **Route-level code splitting** - Dashboard routes lazy-loaded
3. **Error boundaries** - Per-route error handling
4. **SEO meta tags** - Comprehensive meta tags for all routes
5. **Sitemap generation** - Automated sitemap with priorities
6. **Robots.txt** - Search engine directives
7. **JSON-LD structured data** - Rich snippets for reference pages
8. **Cache headers** - Optimized caching via Netlify

### Not Yet Implemented 🔄

#### 1. **Server Functions** - Move auth to server

**Current:** Client-side auth checks in route loaders
**Opportunity:** Use `createServerFn` for secure server-side auth

```typescript
// src/lib/auth.server.ts
import { createServerFn } from '@tanstack/react-start'

export const requireAuth = createServerFn('GET', async () => {
  const user = await fetchCurrentUser()
  if (!user) throw redirect({ to: '/dashboard', search: { auth: 'required' } })
  return user
})
```

**Benefits:** Better security, reduced client bundle
**Effort:** 🟡 MEDIUM

#### 2. **Deferred Data Loading** - Parallel data fetching

**Current:** Sequential data loading in loaders
**Opportunity:** Use `defer()` for non-critical data

```typescript
loader: async () => ({
  critical: await fetchCriticalData(),
  deferred: defer(fetchSlowData()), // Loads in parallel
})
```

**Benefits:** Faster initial page loads
**Effort:** 🟢 LOW

#### 3. **Route Context** - Share data between routes

**Current:** Each route fetches user data independently
**Opportunity:** Use route context to share user across routes
**Benefits:** Reduce duplicate fetches
**Effort:** 🟢 LOW

#### 4. **Middleware** - Request/response interception

**Current:** No middleware layer
**Opportunity:** Add logging, analytics, auth middleware
**Benefits:** Centralized cross-cutting concerns
**Effort:** 🟡 MEDIUM

#### 5. **Asset Preloading** - Preload critical assets

**Current:** No explicit asset preloading
**Opportunity:** Add `<link rel="preload">` for fonts, images
**Benefits:** Faster perceived performance
**Effort:** 🟢 LOW

---

## 🔗 Documentation

- **TanStack Form:** https://tanstack.com/form/latest
- **TanStack Virtual:** https://tanstack.com/virtual/latest
- **TanStack Router Search Params:** https://tanstack.com/router/latest/docs/framework/react/guide/search-params
- **TanStack Start Server Functions:** https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
- **TanStack Router Deferred Data:** https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#deferred-data
