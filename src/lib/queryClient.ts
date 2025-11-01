/**
 * TanStack Query client configuration
 * Configures default options for queries and mutations
 *
 * Supports both API-backed and cache-only data in the same app.
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Special ID value to indicate cache-only (local) data
 * When used as an entity ID, queries will not make API calls
 * and mutations will only update the local cache.
 *
 * @example
 * ```typescript
 * // API-backed mech
 * const { data: mech } = useMech('uuid-from-database')
 *
 * // Cache-only mech (no API calls)
 * const { data: localMech } = useMech(LOCAL_ID)
 * ```
 */
export const LOCAL_ID = 'LOCAL' as const

/**
 * Check if an ID represents local (cache-only) data
 */
export function isLocalId(id: string | undefined): boolean {
  return id === LOCAL_ID
}

/**
 * Create and configure the QueryClient
 * Default options:
 * - staleTime: 5 minutes (data is considered fresh for 5 minutes)
 * - gcTime: 10 minutes (unused data is garbage collected after 10 minutes)
 * - retry: 1 (retry failed requests once)
 * - refetchOnWindowFocus: false (don't refetch when window regains focus)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
})
