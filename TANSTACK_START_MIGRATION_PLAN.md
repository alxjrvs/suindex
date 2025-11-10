# TanStack Start Migration Plan

**Project:** SUIndex  
**Current Stack:** Vite + React + React Router + TanStack Query + Supabase  
**Target Stack:** TanStack Start + Supabase  
**Document Version:** 1.0  
**Last Updated:** 2025-11-10

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Analysis](#architecture-analysis)
3. [Phased Migration Strategy](#phased-migration-strategy)
4. [Routing Migration](#routing-migration)
5. [Data Management Overhaul](#data-management-overhaul)
6. [Component Layer Preservation](#component-layer-preservation)
7. [Build System Migration](#build-system-migration)
8. [Testing Strategy](#testing-strategy)
9. [Risk Assessment](#risk-assessment)
10. [Success Criteria](#success-criteria)

---

## Executive Summary

This document outlines a comprehensive migration plan to convert SUIndex from a Vite-based SPA to a TanStack Start application with hybrid SSR/SPA architecture. The migration preserves the existing component structure while modernizing the routing and data layer to leverage TanStack Start's full-stack capabilities.

**Key Goals:**

- Enable SSR for reference/schema pages (SEO, performance)
- Maintain SPA experience for dashboard/live sheets (interactivity, real-time updates)
- Preserve existing component architecture and Chakra UI styling
- Modernize data fetching patterns to align with TanStack Start conventions
- Maintain Supabase integration with proper SSR/client context handling

**Estimated Timeline:** 4-6 weeks (phased approach with rollback points)

**Critical Success Factors:**

- Zero breaking changes to user-facing functionality
- Improved performance metrics for reference pages
- Maintained real-time capabilities for live sheets
- Successful deployment to production hosting

---

## Architecture Analysis

### Current State

**Build System:**

- Vite 7.2.2 with React plugin
- Manual code splitting (vendor, salvage-union chunks)
- Compression (gzip), bundle analysis, Google Analytics integration
- TypeScript compilation + Vite build pipeline

**Routing:**

- React Router DOM 7.9.5 (BrowserRouter)
- Nested route structure in `App.tsx` and `Dashboard/index.tsx`
- Client-side only routing with `public/_redirects` for SPA fallback
- Routes:
  - `/` - RulesReferenceLanding (reference section)
  - `/schema/:schemaId` - SchemaViewer (reference section)
  - `/schema/:schemaId/item/:itemId` - ItemShowPage (reference section)
  - `/sheets/*` - Local live sheets (SPA, cache-only)
  - `/dashboard/*` - User dashboard with auth (SPA, database-backed)

**Data Fetching:**

- TanStack Query 5.90.2 for all data fetching
- Custom hooks organized by entity type:
  - `src/hooks/pilot/` - usePilot, useUpdatePilot, useHydratedPilot
  - `src/hooks/mech/` - useMech, useUpdateMech, useHydratedMech
  - `src/hooks/crawler/` - useCrawler, useUpdateCrawler, useHydratedCrawler
  - `src/hooks/entity/` - useEntitiesFor, usePlayerChoices
  - `src/hooks/cargo/` - useCargo, useCreateCargo, useDeleteCargo
- Query key factories for cache management
- Optimistic updates with cache invalidation
- Support for both API-backed and cache-only (LOCAL_ID) data
- Auto-save with 300ms debounce

**Backend Integration:**

- Supabase client with PKCE auth flow
- Client-side only (no SSR context handling)
- API functions in `src/lib/api/` organized by entity
- Real-time subscriptions for live sheets
- Type generation from Supabase schema

**Component Architecture:**

- Base components: `src/components/base/` (Text, Heading with recipes)
- Shared components: `src/components/shared/` (reusable UI)
- Feature components: `src/components/[Feature]/` (MechLiveSheet, PilotLiveSheet, CrawlerLiveSheet)
- Entity displays: `src/components/entity/EntityDisplay/`
- Chakra UI v3 for styling with custom theme (`src/theme.ts`)
- Context providers: EntityViewerModalProvider

**Testing:**

- bun:test with React Testing Library
- Schema tests: Load every entity from salvageunion-reference and verify display
- Happy DOM for test environment
- Test files in `src/__tests__/`

**Deployment:**

- GitHub Pages via GitHub Actions
- CI/CD: Lint → Format → Typecheck → Test → Build → Deploy
- Environment variables in GitHub secrets
- SPA routing via `public/_redirects`

### Target State

**Build System:**

- TanStack Start's Vite-based build system
- Automatic code splitting and optimization
- SSR + client hydration support
- Server function bundling
- Deployment adapter system (Netlify, Vercel, Node, etc.)

**Routing:**

- TanStack Router with file-based routing
- Hybrid SSR/SPA architecture:
  - SSR routes: `/`, `/schema/*` (reference section)
  - SPA routes: `/dashboard/*`, `/sheets/*` (user-specific content)
- Type-safe route definitions with automatic type generation
- Route-level data loading with loaders
- Server-side and client-side route configuration

**Data Fetching:**

- TanStack Start loaders for SSR routes
- Server functions for API calls
- TanStack Query for client-side data fetching (dashboard/sheets)
- Supabase client with SSR context handling:
  - Server-side: Use Supabase SSR package
  - Client-side: Use standard Supabase client
- Maintain existing hook patterns for dashboard/sheets

**Backend Integration:**

- Supabase with SSR support via `@supabase/ssr`
- Server functions for authenticated operations
- Client-side Supabase client for real-time features
- PKCE auth flow compatible with SSR

**Component Architecture:**

- Preserve existing component structure
- Update data-fetching integration points
- Maintain Chakra UI styling
- Add server component support where beneficial

### Key Differences and Migration Challenges

| Aspect           | Current (Vite + React Router)   | Target (TanStack Start)        | Challenge                             |
| ---------------- | ------------------------------- | ------------------------------ | ------------------------------------- |
| **Routing**      | Component-based, client-only    | File-based, SSR-capable        | Route file structure reorganization   |
| **Data Loading** | TanStack Query hooks everywhere | Loaders for SSR, hooks for SPA | Splitting data patterns by route type |
| **Auth Context** | Client-side only                | Server + client contexts       | Supabase client initialization        |
| **Build Output** | Single SPA bundle               | SSR + client bundles           | Deployment target changes             |
| **Environment**  | Browser only                    | Node.js server + browser       | Code splitting for server/client      |
| **Type Safety**  | Manual route types              | Auto-generated route types     | Migration to file-based conventions   |

---

## Phased Migration Strategy

### Phase 0: Preparation and Setup (Week 1)

**Objectives:**

- Set up TanStack Start in parallel to existing app
- Establish development workflow
- Create proof-of-concept for hybrid SSR/SPA

**Tasks:**

1. Create new branch: `feature/tanstack-start-migration`
2. Install TanStack Start dependencies
3. Set up basic TanStack Start project structure
4. Configure TypeScript for TanStack Start
5. Create minimal SSR route (homepage) as POC
6. Test Supabase SSR integration
7. Document learnings and blockers

**Success Criteria:**

- [ ] TanStack Start dev server runs alongside Vite
- [ ] Homepage renders with SSR
- [ ] Supabase client works in SSR context
- [ ] No conflicts with existing Vite setup

**Rollback Strategy:**

- Delete branch, no impact on main codebase

---

### Phase 1: Reference Section Migration (Week 2-3)

**Objectives:**

- Migrate reference/schema pages to SSR
- Establish loader pattern for static content
- Preserve existing EntityDisplay components

**Tasks:**

**1.1 Route Structure Setup**

- Create file-based routes for reference section:
  - `routes/index.tsx` - RulesReferenceLanding
  - `routes/schema/$schemaId.tsx` - SchemaViewer
  - `routes/schema/$schemaId/item/$itemId.tsx` - ItemShowPage
- Configure route-level SSR settings

**1.2 Data Loading Migration**

- Create loaders for schema data (from salvageunion-reference)
- Implement server-side data fetching for entity displays
- Test SSR rendering of EntityDisplay components

**1.3 Component Integration**

- Update RulesReferenceLanding to use loader data
- Update SchemaViewer to use loader data
- Update ItemShowPage to use loader data
- Preserve search functionality (client-side)
- Maintain EntityViewerModalProvider

**1.4 Testing**

- Update schema tests for SSR context
- Verify all entities render correctly
- Test navigation between reference pages
- Validate SEO improvements (meta tags, etc.)

**Success Criteria:**

- [ ] All reference pages render with SSR
- [ ] EntityDisplay components work unchanged
- [ ] Search functionality preserved
- [ ] Schema tests pass
- [ ] Performance improvement measurable

**Rollback Strategy:**

- Keep Vite version running
- Feature flag to switch between implementations
- Gradual rollout via routing rules

---

### Phase 2: Dashboard Section Migration (Week 3-4)

**Objectives:**

- Migrate dashboard routes to TanStack Start (SPA mode)
- Preserve existing TanStack Query hooks
- Implement server functions for auth-protected operations
- Maintain real-time subscriptions

**Tasks:**

**2.1 Route Structure Setup**

- Create file-based routes for dashboard:
  - `routes/dashboard/index.tsx` - DashboardContent
  - `routes/dashboard/games/index.tsx` - GamesGrid
  - `routes/dashboard/games/$gameId.tsx` - GameLiveSheet
  - `routes/dashboard/pilots/index.tsx` - PilotsGrid
  - `routes/dashboard/pilots/$id.tsx` - PilotEdit
  - `routes/dashboard/mechs/index.tsx` - MechsGrid
  - `routes/dashboard/mechs/$id.tsx` - MechEdit
  - `routes/dashboard/crawlers/index.tsx` - CrawlersGrid
  - `routes/dashboard/crawlers/$id.tsx` - CrawlerEdit
  - `routes/dashboard/join.tsx` - JoinGame
- Configure routes for SPA mode (no SSR)

**2.2 Auth Integration**

- Create server function for auth state
- Implement SSR-compatible auth check
- Update auth flow for PKCE with SSR
- Preserve Discord OAuth integration

**2.3 Data Hooks Migration**

- Keep existing TanStack Query hooks unchanged
- Update Supabase client initialization for SSR context
- Test all CRUD operations (pilots, mechs, crawlers, games)
- Verify real-time subscriptions work

**2.4 Component Updates**

- Update Dashboard component to use route context
- Preserve all existing LiveSheet components
- Maintain EntityGrid patterns
- Keep auto-save functionality

**Success Criteria:**

- [ ] All dashboard routes accessible
- [ ] Auth flow works (login, logout, session management)
- [ ] All CRUD operations functional
- [ ] Real-time updates working
- [ ] Existing hooks work without changes

**Rollback Strategy:**

- Dashboard routes can fall back to Vite version
- Auth state managed separately
- Database operations unchanged

---

### Phase 3: Local Sheets Migration (Week 4)

**Objectives:**

- Migrate local live sheets (`/sheets/*`) to TanStack Start
- Preserve cache-only (LOCAL_ID) functionality
- Maintain existing LiveSheet components

**Tasks:**

**3.1 Route Setup**

- Create file-based routes:
  - `routes/sheets/pilot.tsx` - PilotLiveSheet
  - `routes/sheets/mech.tsx` - MechLiveSheet
  - `routes/sheets/crawler.tsx` - CrawlerLiveSheet
- Configure for SPA mode (no SSR)

**3.2 Cache-Only Data**

- Verify LOCAL_ID pattern works with TanStack Start
- Test cache persistence across navigation
- Ensure no server-side data fetching for local sheets

**3.3 Component Integration**

- Update LiveSheet components to use route context
- Preserve all existing functionality
- Test all user interactions

**Success Criteria:**

- [ ] Local sheets accessible and functional
- [ ] Cache-only data works correctly
- [ ] No server-side data fetching
- [ ] All LiveSheet features preserved

**Rollback Strategy:**

- Simple route redirect to Vite version
- No database impact

---

### Phase 4: Build and Deployment (Week 5)

**Objectives:**

- Configure TanStack Start build for production
- Set up deployment pipeline
- Migrate from GitHub Pages to appropriate hosting

**Tasks:**

**4.1 Build Configuration**

- Configure TanStack Start build settings
- Set up deployment adapter (likely Netlify or Vercel)
- Configure environment variables
- Test production build locally

**4.2 Deployment Setup**

- Evaluate hosting options:
  - **Netlify**: Native SSR support, edge functions
  - **Vercel**: Excellent SSR support, serverless functions
  - **Cloudflare Pages**: Edge SSR, good performance
  - **Self-hosted**: Node.js server with PM2/Docker
- Update GitHub Actions workflow
- Configure deployment secrets
- Set up staging environment

**4.3 Performance Optimization**

- Configure code splitting
- Optimize bundle sizes
- Set up caching strategies
- Test SSR performance

**4.4 Migration Cutover**

- Deploy to staging
- Run full test suite
- Performance testing
- User acceptance testing
- Production deployment
- DNS/routing cutover

**Success Criteria:**

- [ ] Production build successful
- [ ] Deployment pipeline automated
- [ ] Performance metrics improved
- [ ] All features functional in production
- [ ] Zero downtime migration

**Rollback Strategy:**

- Keep GitHub Pages deployment active
- DNS-level rollback capability
- Database unchanged (no migration needed)

---

### Phase 5: Cleanup and Optimization (Week 6)

**Objectives:**

- Remove Vite-specific code
- Optimize for TanStack Start patterns
- Update documentation

**Tasks:**

**5.1 Code Cleanup**

- Remove React Router dependencies
- Remove Vite configuration
- Clean up unused imports
- Update package.json

**5.2 Optimization**

- Refactor data loading to use loaders where beneficial
- Optimize server functions
- Review and optimize bundle sizes
- Implement advanced caching strategies

**5.3 Documentation**

- Update README.md
- Update .augment/rules/ files
- Document new patterns and conventions
- Create migration guide for future reference

**5.4 Monitoring**

- Set up error tracking
- Monitor performance metrics
- Track user feedback
- Plan future improvements

**Success Criteria:**

- [ ] No Vite dependencies remaining
- [ ] Documentation updated
- [ ] Performance optimized
- [ ] Monitoring in place

---

## Routing Migration

### File-Based Routing Structure

TanStack Start uses file-based routing where the file structure in `routes/` directory maps to URL paths. Here's the proposed structure:

```
routes/
├── __root.tsx                          # Root layout with providers
├── index.tsx                           # Homepage (SSR)
├── schema/
│   ├── $schemaId.tsx                   # Schema viewer (SSR)
│   └── $schemaId.item.$itemId.tsx      # Item detail (SSR)
├── sheets/
│   ├── pilot.tsx                       # Local pilot sheet (SPA)
│   ├── mech.tsx                        # Local mech sheet (SPA)
│   └── crawler.tsx                     # Local crawler sheet (SPA)
└── dashboard/
    ├── _layout.tsx                     # Dashboard layout with auth
    ├── index.tsx                       # Dashboard home (SPA)
    ├── games/
    │   ├── index.tsx                   # Games grid (SPA)
    │   └── $gameId.tsx                 # Game live sheet (SPA)
    ├── pilots/
    │   ├── index.tsx                   # Pilots grid (SPA)
    │   └── $id.tsx                     # Pilot edit (SPA)
    ├── mechs/
    │   ├── index.tsx                   # Mechs grid (SPA)
    │   └── $id.tsx                     # Mech edit (SPA)
    ├── crawlers/
    │   ├── index.tsx                   # Crawlers grid (SPA)
    │   └── $id.tsx                     # Crawler edit (SPA)
    └── join.tsx                        # Join game (SPA)
```

### SSR vs SPA Configuration

**SSR Routes (Reference Section):**

```typescript
// routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { getSchemaCatalog } from 'salvageunion-reference'

export const Route = createFileRoute('/')({
  loader: async () => {
    const schemaIndexData = getSchemaCatalog()
    return { schemas: schemaIndexData.schemas }
  },
  component: RulesReferenceLanding,
})

function RulesReferenceLanding() {
  const { schemas } = Route.useLoaderData()
  // Component implementation
}
```

**SPA Routes (Dashboard Section):**

```typescript
// routes/dashboard/pilots/$id.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/pilots/$id')({
  // No loader - data fetched client-side
  component: PilotEdit,
})

function PilotEdit() {
  const { id } = Route.useParams()
  // Use existing hooks
  const { pilot, loading, error } = useHydratedPilot(id)
  // Component implementation
}
```

### Hybrid Architecture Strategy

The key to this migration is maintaining a hybrid SSR/SPA architecture:

1. **Reference Section (SSR):**
   - Static content from salvageunion-reference package
   - SEO-friendly, fast initial load
   - Server-side rendering for better performance
   - No authentication required

2. **Dashboard Section (SPA):**
   - User-specific, authenticated content
   - Real-time updates via Supabase subscriptions
   - Client-side data fetching with TanStack Query
   - Optimistic updates and auto-save

3. **Local Sheets (SPA):**
   - Cache-only data (no database)
   - Pure client-side state management
   - No server interaction

### Route Migration Mapping

| Current Route                    | New Route File                             | Mode | Notes                        |
| -------------------------------- | ------------------------------------------ | ---- | ---------------------------- |
| `/`                              | `routes/index.tsx`                         | SSR  | Homepage with schema catalog |
| `/schema/:schemaId`              | `routes/schema/$schemaId.tsx`              | SSR  | Schema viewer                |
| `/schema/:schemaId/item/:itemId` | `routes/schema/$schemaId.item.$itemId.tsx` | SSR  | Item detail                  |
| `/sheets/pilot`                  | `routes/sheets/pilot.tsx`                  | SPA  | Local pilot sheet            |
| `/sheets/mech`                   | `routes/sheets/mech.tsx`                   | SPA  | Local mech sheet             |
| `/sheets/crawler`                | `routes/sheets/crawler.tsx`                | SPA  | Local crawler sheet          |
| `/dashboard`                     | `routes/dashboard/index.tsx`               | SPA  | Dashboard home               |
| `/dashboard/games`               | `routes/dashboard/games/index.tsx`         | SPA  | Games grid                   |
| `/dashboard/games/:gameId`       | `routes/dashboard/games/$gameId.tsx`       | SPA  | Game live sheet              |
| `/dashboard/pilots`              | `routes/dashboard/pilots/index.tsx`        | SPA  | Pilots grid                  |
| `/dashboard/pilots/:id`          | `routes/dashboard/pilots/$id.tsx`          | SPA  | Pilot edit                   |
| `/dashboard/mechs`               | `routes/dashboard/mechs/index.tsx`         | SPA  | Mechs grid                   |
| `/dashboard/mechs/:id`           | `routes/dashboard/mechs/$id.tsx`           | SPA  | Mech edit                    |
| `/dashboard/crawlers`            | `routes/dashboard/crawlers/index.tsx`      | SPA  | Crawlers grid                |
| `/dashboard/crawlers/:id`        | `routes/dashboard/crawlers/$id.tsx`        | SPA  | Crawler edit                 |
| `/dashboard/join`                | `routes/dashboard/join.tsx`                | SPA  | Join game                    |

---

## Data Management Overhaul

### Current TanStack Query Pattern

The current application uses a well-organized TanStack Query pattern with custom hooks:

```typescript
// Current pattern: src/hooks/pilot/usePilots.ts
export function usePilot(id: string | undefined) {
  return useQuery({
    queryKey: pilotsKeys.byId(id!),
    queryFn: () => fetchEntity<Pilot>('pilots', id!),
    enabled: !!id,
  })
}

export function useUpdatePilot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TablesUpdate<'pilots'>) => updateEntity('pilots', data.id!, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pilotsKeys.byId(variables.id!) })
    },
  })
}
```

### TanStack Start Data Loading Patterns

**For SSR Routes (Reference Section):**

Use loaders to fetch data server-side:

```typescript
// routes/schema/$schemaId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { SalvageUnionReference } from 'salvageunion-reference'

export const Route = createFileRoute('/schema/$schemaId')({
  loader: async ({ params }) => {
    const { schemaId } = params
    const entities = SalvageUnionReference.findAllIn(schemaId, () => true)
    return { schemaId, entities }
  },
  component: SchemaViewer,
})

function SchemaViewer() {
  const { schemaId, entities } = Route.useLoaderData()
  // Render with server-loaded data
}
```

**For SPA Routes (Dashboard Section):**

Keep existing TanStack Query hooks:

```typescript
// routes/dashboard/pilots/$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useHydratedPilot } from '@/hooks/pilot'

export const Route = createFileRoute('/dashboard/pilots/$id')({
  component: PilotEdit,
})

function PilotEdit() {
  const { id } = Route.useParams()
  const { pilot, abilities, equipment, loading, error } = useHydratedPilot(id)
  // Existing component logic unchanged
}
```

### Supabase Client Migration

**Current Setup (Client-Only):**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})
```

**New Setup (SSR-Compatible):**

```typescript
// src/lib/supabase.server.ts (Server-side)
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database-generated.types'

export function createSupabaseServerClient(request: Request) {
  return createServerClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => getCookie(request, name),
        set: (name, value, options) => setCookie(name, value, options),
        remove: (name, options) => removeCookie(name, options),
      },
    }
  )
}

// src/lib/supabase.client.ts (Client-side)
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database-generated.types'

export const supabase = createBrowserClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)
```

### Server Functions for Auth

Create server functions for authenticated operations:

```typescript
// src/lib/api/auth.server.ts
import { createServerFn } from '@tanstack/start'
import { createSupabaseServerClient } from '@/lib/supabase.server'

export const getServerUser = createServerFn('GET', async (_, { request }) => {
  const supabase = createSupabaseServerClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const signOut = createServerFn('POST', async (_, { request }) => {
  const supabase = createSupabaseServerClient(request)
  await supabase.auth.signOut()
})
```

### Hook Migration Strategy

**Hooks to Keep Unchanged:**

- All hooks in `src/hooks/pilot/`
- All hooks in `src/hooks/mech/`
- All hooks in `src/hooks/crawler/`
- All hooks in `src/hooks/entity/`
- All hooks in `src/hooks/cargo/`

**Hooks to Update:**

- Auth hooks: Update to use server functions
- Supabase client usage: Update imports to use SSR-compatible client

**Example Migration:**

```typescript
// Before: src/hooks/useCurrentUser.ts
export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null)
    })
  }, [])

  return { userId }
}

// After: src/hooks/useCurrentUser.ts
import { getServerUser } from '@/lib/api/auth.server'

export function useCurrentUser() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getServerUser(),
  })

  return { userId: user?.id || null }
}
```

### Data Loading Decision Matrix

| Route Type      | Data Source                  | Loading Pattern      | Example      |
| --------------- | ---------------------------- | -------------------- | ------------ |
| SSR (Reference) | salvageunion-reference       | Loader               | Schema pages |
| SSR (Auth)      | Supabase via server function | Loader               | User profile |
| SPA (Dashboard) | Supabase via client          | TanStack Query hooks | Live sheets  |
| SPA (Local)     | Cache only                   | TanStack Query hooks | Local sheets |

---

## Component Layer Preservation

### Component Structure (Unchanged)

The existing component architecture is well-organized and should be preserved:

```
src/components/
├── base/              # Text, Heading (with recipes)
├── shared/            # Reusable components
├── entity/            # Entity display components
├── MechLiveSheet/     # Mech live sheet components
├── PilotLiveSheet/    # Pilot live sheet components
├── CrawlerLiveSheet/  # Crawler live sheet components
├── Dashboard/         # Dashboard components
├── Reference/         # Reference section components
└── schema/            # Schema viewer components
```

### Components Requiring Updates

**Minimal Updates (Props/Context Only):**

1. **TopNavigation** (`src/components/TopNavigation.tsx`)
   - Update navigation links to use TanStack Router's `Link` component
   - Update `useNavigate` to TanStack Router's `useNavigate`
   - Keep user prop and auth state

2. **Dashboard** (`src/components/Dashboard/index.tsx`)
   - Remove React Router's `Routes` and `Route`
   - Use TanStack Router's `Outlet` for nested routes
   - Keep auth logic

3. **RulesReferenceLanding** (`src/components/Reference/RulesReferenceLanding.tsx`)
   - Update to receive schemas from loader data
   - Keep all search and UI logic

4. **SchemaViewer** (`src/components/schema/SchemaViewer.tsx`)
   - Update to receive data from loader
   - Keep all display logic

5. **ItemShowPage** (`src/components/ItemShowPage.tsx`)
   - Update to receive data from loader
   - Keep all display logic

**No Changes Required:**

- All EntityDisplay components
- All LiveSheet components (Mech, Pilot, Crawler)
- All shared components (RoundedBox, SheetInput, etc.)
- All base components (Text, Heading)
- Chakra UI theme and styling

### Provider Migration

**Current Providers:**

```typescript
// src/main.tsx
<StrictMode>
  <QueryClientProvider client={queryClient}>
    <ChakraProvider value={system}>
      <Router>
        <EntityViewerModalProvider>
          <App />
        </EntityViewerModalProvider>
      </Router>
    </ChakraProvider>
  </QueryClientProvider>
</StrictMode>
```

**New Providers (Root Route):**

```typescript
// routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { EntityViewerModalProvider } from '@/providers/EntityViewerModalProvider'
import { system } from '@/theme'
import { queryClient } from '@/lib/queryClient'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <EntityViewerModalProvider>
          <Outlet />
        </EntityViewerModalProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
```

---

## Build System Migration

### Current Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    visualizer({ open: false, gzipSize: true }),
    VitePluginRadar({ analytics: { id: process.env.VITE_GA_MEASUREMENT_ID } }),
  ],
  optimizeDeps: {
    exclude: ['salvageunion-reference'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'salvage-union': ['salvageunion-reference'],
        },
      },
    },
  },
})
```

### TanStack Start Configuration

**app.config.ts:**

```typescript
import { defineConfig } from '@tanstack/start/config'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  vite: {
    plugins: [
      TanStackRouterVite({
        routesDirectory: './routes',
        generatedRouteTree: './src/routeTree.gen.ts',
      }),
    ],
  },
  server: {
    preset: 'netlify', // or 'vercel', 'cloudflare', 'node-server'
  },
  react: {
    exclude: ['salvageunion-reference'],
  },
})
```

### Package.json Updates

**Dependencies to Add:**

```json
{
  "dependencies": {
    "@tanstack/react-router": "^1.x.x",
    "@tanstack/router-plugin": "^1.x.x",
    "@tanstack/start": "^1.x.x",
    "@supabase/ssr": "^0.7.0"
  }
}
```

**Dependencies to Remove:**

```json
{
  "dependencies": {
    "react-router-dom": "^7.9.5"
  },
  "devDependencies": {
    "vite": "^7.2.2",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-radar": "^0.10.1"
  }
}
```

**Scripts to Update:**

```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "typecheck": "tsc -b --noEmit",
    "test": "bun test"
  }
}
```

### Environment Variables

**Current (.env.example):**

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SHOW_DISCORD_SIGNIN=1
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Updated (.env.example):**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SHOW_DISCORD_SIGNIN=1

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Server-side environment (not exposed to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Deployment Adapter Selection

**Option 1: Netlify (Recommended)**

- Native SSR support
- Edge functions for server functions
- Easy GitHub integration
- Free tier available

```typescript
// app.config.ts
export default defineConfig({
  server: {
    preset: 'netlify',
  },
})
```

**Option 2: Vercel**

- Excellent SSR support
- Serverless functions
- Great DX
- Free tier available

```typescript
// app.config.ts
export default defineConfig({
  server: {
    preset: 'vercel',
  },
})
```

**Option 3: Cloudflare Pages**

- Edge SSR
- Global distribution
- Good performance
- Free tier available

```typescript
// app.config.ts
export default defineConfig({
  server: {
    preset: 'cloudflare-pages',
  },
})
```

### GitHub Actions Workflow Update

**Current (.github/workflows/ci.yml):**

```yaml
- name: Build
  run: bun run build
```

**Updated (.github/workflows/deploy.yml):**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: oven-sh/setup-bun@v1
      - run: bun install --frozen-lockfile
      - run: bun run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod
```

---

## Testing Strategy

### Test Environment Updates

**Current Setup (bun:test + Happy DOM):**

```typescript
// happydom.ts
import { GlobalRegistrator } from '@happy-dom/global-registrator'
GlobalRegistrator.register()

process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
```

**Updated Setup (SSR-Compatible):**

```typescript
// happydom.ts
import { GlobalRegistrator } from '@happy-dom/global-registrator'
GlobalRegistrator.register()

// Mock server environment
global.Request = Request
global.Response = Response
global.Headers = Headers

process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
```

### Schema Tests Migration

**Current Pattern:**

```typescript
// src/__tests__/schema.test.tsx
test('displays all properties for: ${entity.name}', async () => {
  const { container } = render(
    <EntityDisplay data={entity} schemaName={schemaName} />
  )
  expect(container.textContent).toContain(entity.name)
})
```

**Updated Pattern (SSR Context):**

```typescript
// src/__tests__/schema.test.tsx
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { createRouter } from '@/router'

test('displays all properties for: ${entity.name}', async () => {
  const router = createRouter()
  const history = createMemoryHistory({
    initialEntries: [`/schema/${schemaName}/item/${entity.id}`],
  })

  const { container } = render(
    <RouterProvider router={router} history={history} />
  )

  await waitFor(() => {
    expect(container.textContent).toContain(entity.name)
  })
})
```

### New Test Requirements

**1. SSR Route Tests:**

```typescript
// src/__tests__/ssr-routes.test.tsx
import { describe, test, expect } from 'bun:test'

describe('SSR Routes', () => {
  test('homepage renders with SSR', async () => {
    const response = await fetch('http://localhost:3000/')
    const html = await response.text()
    expect(html).toContain('Salvage Union Rules Reference')
  })

  test('schema page renders with SSR', async () => {
    const response = await fetch('http://localhost:3000/schema/chassis')
    const html = await response.text()
    expect(html).toContain('Chassis')
  })
})
```

**2. Server Function Tests:**

```typescript
// src/__tests__/server-functions.test.tsx
import { describe, test, expect } from 'bun:test'
import { getServerUser } from '@/lib/api/auth.server'

describe('Server Functions', () => {
  test('getServerUser returns null for unauthenticated request', async () => {
    const request = new Request('http://localhost:3000/')
    const user = await getServerUser(undefined, { request })
    expect(user).toBeNull()
  })
})
```

**3. Hybrid Route Tests:**

```typescript
// src/__tests__/hybrid-routing.test.tsx
describe('Hybrid Routing', () => {
  test('SSR routes render on server', async () => {
    // Test SSR routes
  })

  test('SPA routes render on client', async () => {
    // Test SPA routes
  })
})
```

### Test Coverage Goals

- [ ] All schema entities render correctly (existing tests)
- [ ] SSR routes render with correct data
- [ ] SPA routes work with client-side data fetching
- [ ] Server functions execute correctly
- [ ] Auth flow works in SSR context
- [ ] Real-time subscriptions work
- [ ] Cache-only (LOCAL_ID) data works

---

## Risk Assessment

### High-Risk Areas

**1. Supabase Auth in SSR Context**

- **Risk:** PKCE flow may not work correctly with SSR
- **Mitigation:**
  - Thorough testing of auth flow
  - Use `@supabase/ssr` package as recommended
  - Implement proper cookie handling
  - Test OAuth callback handling
- **Rollback:** Keep client-side auth as fallback

**2. Real-Time Subscriptions**

- **Risk:** Supabase real-time may not work with SSR
- **Mitigation:**
  - Keep subscriptions client-side only
  - Test thoroughly in production-like environment
  - Document any limitations
- **Rollback:** Disable SSR for affected routes

**3. Deployment Platform Change**

- **Risk:** Moving from GitHub Pages to Netlify/Vercel
- **Mitigation:**
  - Set up staging environment first
  - Test thoroughly before production
  - Keep GitHub Pages deployment active during transition
  - DNS-level rollback capability
- **Rollback:** Point DNS back to GitHub Pages

**4. Bundle Size Increase**

- **Risk:** SSR may increase bundle size
- **Mitigation:**
  - Monitor bundle sizes during migration
  - Optimize code splitting
  - Use TanStack Start's automatic optimization
  - Test performance metrics
- **Rollback:** Revert to Vite if performance degrades

### Medium-Risk Areas

**1. TanStack Query Hook Compatibility**

- **Risk:** Existing hooks may not work with TanStack Start
- **Mitigation:**
  - Test all hooks in new environment
  - Keep hooks unchanged where possible
  - Document any required changes
- **Rollback:** Minimal - hooks should work unchanged

**2. Chakra UI Compatibility**

- **Risk:** Chakra UI may have SSR issues
- **Mitigation:**
  - Chakra UI v3 has good SSR support
  - Test all components with SSR
  - Use Chakra's SSR utilities
- **Rollback:** Disable SSR for affected components

**3. Environment Variable Handling**

- **Risk:** Different env var patterns between Vite and TanStack Start
- **Mitigation:**
  - Document all environment variables
  - Test in all environments (dev, staging, prod)
  - Use proper server/client separation
- **Rollback:** Update env vars as needed

### Low-Risk Areas

**1. Component Migration**

- **Risk:** Components may need updates
- **Mitigation:**
  - Most components work unchanged
  - Only routing-related components need updates
  - Preserve existing component structure
- **Rollback:** Minimal changes needed

**2. Testing Infrastructure**

- **Risk:** Tests may need updates
- **Mitigation:**
  - bun:test works with TanStack Start
  - Update test setup for SSR context
  - Add new SSR-specific tests
- **Rollback:** Keep existing test patterns

### Breaking Changes

**Potential Breaking Changes:**

1. **URL Structure:** File-based routing may change URL patterns
   - **Mitigation:** Maintain existing URL structure
   - **Redirects:** Set up redirects for any changed URLs

2. **Environment Variables:** Server vs client separation
   - **Mitigation:** Document clearly which vars are server-only
   - **Testing:** Test in all environments

3. **Build Output:** Different build artifacts
   - **Mitigation:** Update deployment scripts
   - **Testing:** Test build process thoroughly

4. **Hosting Platform:** Moving from GitHub Pages
   - **Mitigation:** Parallel deployment during transition
   - **DNS:** Gradual DNS cutover

---

## Success Criteria

### Phase 0 Success Criteria

- [ ] TanStack Start dev server runs
- [ ] Basic SSR route renders
- [ ] Supabase client works in SSR context
- [ ] No conflicts with existing setup

### Phase 1 Success Criteria (Reference Section)

- [ ] All reference pages render with SSR
- [ ] EntityDisplay components work unchanged
- [ ] Search functionality preserved
- [ ] Schema tests pass
- [ ] Performance metrics:
  - [ ] First Contentful Paint (FCP) < 1.5s
  - [ ] Largest Contentful Paint (LCP) < 2.5s
  - [ ] Time to Interactive (TTI) < 3.5s
- [ ] SEO improvements:
  - [ ] Meta tags present in SSR HTML
  - [ ] Structured data for entities
  - [ ] Proper heading hierarchy

### Phase 2 Success Criteria (Dashboard)

- [ ] All dashboard routes accessible
- [ ] Auth flow works (login, logout, session management)
- [ ] All CRUD operations functional
- [ ] Real-time updates working
- [ ] Existing hooks work without changes
- [ ] Performance metrics:
  - [ ] Client-side navigation < 200ms
  - [ ] Data mutations < 500ms
  - [ ] Real-time updates < 1s latency

### Phase 3 Success Criteria (Local Sheets)

- [ ] Local sheets accessible and functional
- [ ] Cache-only data works correctly
- [ ] No server-side data fetching
- [ ] All LiveSheet features preserved

### Phase 4 Success Criteria (Deployment)

- [ ] Production build successful
- [ ] Deployment pipeline automated
- [ ] Performance metrics improved over current
- [ ] All features functional in production
- [ ] Zero downtime migration
- [ ] Monitoring and error tracking in place

### Phase 5 Success Criteria (Cleanup)

- [ ] No Vite dependencies remaining
- [ ] Documentation updated
- [ ] Performance optimized
- [ ] Code quality maintained
- [ ] Team trained on new patterns

### Overall Success Metrics

**Performance:**

- [ ] SSR pages load 30%+ faster than current SPA
- [ ] Lighthouse score > 90 for reference pages
- [ ] Core Web Vitals in "Good" range
- [ ] Bundle size not increased by more than 10%

**Functionality:**

- [ ] 100% feature parity with current app
- [ ] All existing tests pass
- [ ] No regressions in user experience
- [ ] Real-time features work as before

**Developer Experience:**

- [ ] Type safety maintained/improved
- [ ] Development workflow unchanged or better
- [ ] Clear documentation for new patterns
- [ ] Team comfortable with new architecture

**Production:**

- [ ] Successful deployment to production
- [ ] No critical bugs in first week
- [ ] User feedback positive
- [ ] Performance metrics improved

---

## Appendix A: Key Files and Locations

### Files to Create

```
routes/
├── __root.tsx
├── index.tsx
├── schema/
│   ├── $schemaId.tsx
│   └── $schemaId.item.$itemId.tsx
├── sheets/
│   ├── pilot.tsx
│   ├── mech.tsx
│   └── crawler.tsx
└── dashboard/
    ├── _layout.tsx
    ├── index.tsx
    ├── games/
    │   ├── index.tsx
    │   └── $gameId.tsx
    ├── pilots/
    │   ├── index.tsx
    │   └── $id.tsx
    ├── mechs/
    │   ├── index.tsx
    │   └── $id.tsx
    ├── crawlers/
    │   ├── index.tsx
    │   └── $id.tsx
    └── join.tsx

src/lib/
├── supabase.server.ts    # New: Server-side Supabase client
├── supabase.client.ts    # Updated: Client-side Supabase client
└── api/
    └── auth.server.ts    # New: Server functions for auth

app.config.ts             # New: TanStack Start configuration
```

### Files to Update

```
src/components/
├── TopNavigation.tsx     # Update: Use TanStack Router navigation
├── Dashboard/index.tsx   # Update: Use Outlet instead of Routes
├── Reference/RulesReferenceLanding.tsx  # Update: Use loader data
├── schema/SchemaViewer.tsx              # Update: Use loader data
└── ItemShowPage.tsx                     # Update: Use loader data

src/hooks/
└── useCurrentUser.ts     # Update: Use server function

package.json              # Update: Dependencies and scripts
tsconfig.json             # Update: Path aliases if needed
.github/workflows/        # Update: Deployment workflow
```

### Files to Remove

```
src/App.tsx               # Replaced by routes/__root.tsx
src/main.tsx              # Replaced by TanStack Start entry
vite.config.ts            # Replaced by app.config.ts
public/_redirects         # No longer needed with SSR
```

---

## Appendix B: Reference Links

### TanStack Start Documentation

- **Official Docs:** https://tanstack.com/start/latest
- **Router Docs:** https://tanstack.com/router/latest
- **Query Docs:** https://tanstack.com/query/latest
- **GitHub:** https://github.com/TanStack/router

### Supabase SSR

- **SSR Package:** https://supabase.com/docs/guides/auth/server-side
- **Auth Helpers:** https://supabase.com/docs/guides/auth/auth-helpers
- **PKCE Flow:** https://supabase.com/docs/guides/auth/auth-helpers/pkce

### Deployment Platforms

- **Netlify:** https://docs.netlify.com/
- **Vercel:** https://vercel.com/docs
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/

### Testing

- **Bun Test:** https://bun.sh/docs/cli/test
- **React Testing Library:** https://testing-library.com/docs/react-testing-library/intro

---

## Appendix C: Migration Checklist

### Pre-Migration

- [ ] Review this document with team
- [ ] Set up development branch
- [ ] Back up current production deployment
- [ ] Document current performance metrics
- [ ] Set up staging environment

### Phase 0: Setup

- [ ] Install TanStack Start dependencies
- [ ] Create basic route structure
- [ ] Configure TypeScript
- [ ] Test Supabase SSR integration
- [ ] Document learnings

### Phase 1: Reference Section

- [ ] Create SSR routes for reference pages
- [ ] Implement loaders for schema data
- [ ] Update components to use loader data
- [ ] Update schema tests
- [ ] Validate SEO improvements
- [ ] Performance testing

### Phase 2: Dashboard Section

- [ ] Create SPA routes for dashboard
- [ ] Implement server functions for auth
- [ ] Update Supabase client initialization
- [ ] Test all CRUD operations
- [ ] Verify real-time subscriptions
- [ ] Test auth flow

### Phase 3: Local Sheets

- [ ] Create SPA routes for local sheets
- [ ] Verify cache-only data works
- [ ] Test all LiveSheet features
- [ ] Validate no server-side fetching

### Phase 4: Deployment

- [ ] Configure build settings
- [ ] Set up deployment adapter
- [ ] Update GitHub Actions workflow
- [ ] Deploy to staging
- [ ] Run full test suite
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Monitor for issues

### Phase 5: Cleanup

- [ ] Remove Vite dependencies
- [ ] Remove React Router dependencies
- [ ] Clean up unused code
- [ ] Update documentation
- [ ] Update .augment/rules/
- [ ] Team training
- [ ] Post-migration review

---

## Appendix D: Troubleshooting Guide

### Common Issues and Solutions

**Issue: Supabase auth not working in SSR**

- **Solution:** Ensure using `@supabase/ssr` package
- **Solution:** Check cookie handling in server client
- **Solution:** Verify environment variables are set correctly

**Issue: Real-time subscriptions not working**

- **Solution:** Ensure subscriptions are client-side only
- **Solution:** Check Supabase client initialization
- **Solution:** Verify network connectivity

**Issue: Build fails with module errors**

- **Solution:** Check import paths (server vs client)
- **Solution:** Verify all dependencies installed
- **Solution:** Clear build cache and rebuild

**Issue: Routes not rendering**

- **Solution:** Check route file naming conventions
- **Solution:** Verify route exports are correct
- **Solution:** Check for TypeScript errors

**Issue: Performance degradation**

- **Solution:** Review bundle sizes
- **Solution:** Check code splitting configuration
- **Solution:** Optimize loader data fetching
- **Solution:** Review caching strategies

---

## Conclusion

This migration plan provides a comprehensive roadmap for converting SUIndex from Vite + React Router to TanStack Start. The phased approach ensures minimal risk while maximizing the benefits of SSR for the reference section and maintaining the excellent SPA experience for the dashboard and live sheets.

**Key Takeaways:**

1. **Hybrid Architecture:** SSR for reference, SPA for dashboard
2. **Component Preservation:** Minimal changes to existing components
3. **Data Layer Modernization:** Loaders for SSR, hooks for SPA
4. **Phased Rollout:** 6-week timeline with clear rollback points
5. **Risk Mitigation:** Thorough testing and staging environment

**Next Steps:**

1. Review this plan with the team
2. Set up development branch
3. Begin Phase 0: Preparation and Setup
4. Follow the phased migration strategy
5. Monitor and adjust as needed

**Success Indicators:**

- Improved performance for reference pages
- Maintained functionality for all features
- Better SEO for reference content
- Positive user feedback
- Smooth deployment process

This migration will position SUIndex for future growth while maintaining the excellent user experience that has been built with the current architecture.
