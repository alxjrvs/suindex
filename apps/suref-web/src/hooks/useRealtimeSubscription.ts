/**
 * Hook for setting up Supabase real-time subscriptions with TanStack Query
 *
 * Automatically subscribes to database changes for a specific table and row,
 * invalidates the query cache when changes occur, and shows a toast notification.
 *
 * @example
 * ```tsx
 * // In a live sheet component
 * useRealtimeSubscription({
 *   table: 'pilots',
 *   id: pilotId,
 *   queryKey: pilotsKeys.byId(pilotId),
 *   enabled: !isLocal && !!pilotId,
 * })
 * ```
 */

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toaster } from '../components/ui/toaster'

interface UseRealtimeSubscriptionOptions {
  /**
   * Database table name to subscribe to
   */
  table: string

  /**
   * Row ID to filter subscription (optional - if not provided, subscribes to all rows)
   */
  id?: string

  /**
   * Query key to invalidate when changes occur
   */
  queryKey: readonly unknown[]

  /**
   * Whether the subscription is enabled
   * Set to false for local/cache-only data
   */
  enabled?: boolean

  /**
   * Custom toast message (optional)
   * If not provided, uses default message
   */
  toastMessage?: string

  /**
   * Whether to show toast notifications (default: true)
   */
  showToast?: boolean
}

/**
 * Subscribe to real-time database changes and invalidate query cache
 */
export function useRealtimeSubscription({
  table,
  id,
  queryKey,
  enabled = true,
  toastMessage,
  showToast = true,
}: UseRealtimeSubscriptionOptions) {
  const queryClient = useQueryClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!enabled || !table) return

    const channelName = id ? `${table}:${id}` : `${table}:all`

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(id && { filter: `id=eq.${id}` }),
        },
        (payload) => {
          console.log(`[Realtime] ${table} change:`, payload)

          queryClient.invalidateQueries({ queryKey })

          if (showToast) {
            const message = toastMessage || `${table.slice(0, -1)} updated`
            toaster.create({
              title: 'Data Updated',
              description: message,
              type: 'info',
              duration: 3000,
            })
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [table, id, enabled, queryKey, queryClient, toastMessage, showToast])
}
