/**
 * TanStack Query client configuration
 * Configures default options for queries and mutations
 */

import { QueryClient } from '@tanstack/react-query'

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

