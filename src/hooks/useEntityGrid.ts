import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

type ValidTable =
  | 'crawlers'
  | 'external_links'
  | 'game_invites'
  | 'game_members'
  | 'games'
  | 'mechs'
  | 'pilots'

export interface UseEntityGridConfig {
  table: ValidTable
  orderBy?: string
  orderAscending?: boolean
  filterField?: string
  filterValue?: string
}

export interface UseEntityGridResult<T> {
  items: T[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

/**
 * Generic hook for loading entity grids from Supabase
 * Consolidates duplicate logic from GamesGrid, PilotsGrid, MechsGrid, CrawlersGrid
 */
export function useEntityGrid<T extends { id: string }>(
  config: UseEntityGridConfig
): UseEntityGridResult<T> {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Build query
      let query = supabase.from(config.table).select('*').eq('user_id', user.id)

      // Apply filter if provided
      if (config.filterField && config.filterValue) {
        query = query.eq(config.filterField, config.filterValue)
      }

      // Apply ordering
      if (config.orderBy) {
        query = query.order(config.orderBy, { ascending: config.orderAscending ?? false })
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      setItems((data || []) as T[])
    } catch (err) {
      console.error(`Error loading ${config.table}:`, err)
      setError(err instanceof Error ? err.message : `Failed to load ${config.table}`)
    } finally {
      setLoading(false)
    }
  }, [config.table, config.filterField, config.filterValue, config.orderBy, config.orderAscending])

  useEffect(() => {
    loadItems()
  }, [config.table, config.filterField, config.filterValue, loadItems])

  return { items, loading, error, reload: loadItems }
}
