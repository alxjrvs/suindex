import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type TableName = keyof Database['public']['Tables']

interface UseEntityRelationshipsConfig {
  table: TableName
  selectFields?: string
  orderBy?: string
  filterField?: string
  filterValue?: string
}

/**
 * Generic hook for loading entity relationships from Supabase.
 * Automatically filters by the current user's ID.
 *
 * @example
 * ```tsx
 * const { items: crawlers, loading } = useEntityRelationships({
 *   table: 'crawlers',
 *   selectFields: 'id, name, game_id',
 *   orderBy: 'name',
 * })
 * ```
 */
export function useEntityRelationships<T = { id: string; name: string }>(
  config: UseEntityRelationshipsConfig
) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      let query = supabase
        .from(config.table)
        .select(config.selectFields || 'id, name')
        .eq('user_id', userData.user.id)

      if (config.filterField && config.filterValue) {
        query = query.eq(config.filterField, config.filterValue)
      }

      if (config.orderBy) {
        query = query.order(config.orderBy)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      if (data) setItems(data as T[])
    } catch (err) {
      console.error(`Error loading ${config.table}:`, err)
      setError(err instanceof Error ? err.message : `Failed to load ${config.table}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table, config.selectFields, config.orderBy, config.filterField, config.filterValue])

  return { items, loading, error, reload: load }
}
