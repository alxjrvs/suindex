import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { ValidTable } from '../types/database'

export interface UseLiveSheetStateConfig<T> {
  table: ValidTable
  initialState: T
  id?: string
}

export interface UseLiveSheetStateResult<T> {
  entity: T
  updateEntity: (updates: Partial<T>) => void
  save: () => Promise<void>
  resetChanges: () => Promise<void>
  loading: boolean
  error: string | null
}

/**
 * Generic hook for builder state management
 * Consolidates duplicate logic from useMechLiveSheetState, usePilotLiveSheetState, useCrawlerLiveSheetState
 * Handles loading, saving, and resetting entity state from Supabase
 */
export function useLiveSheetState<T extends { id: string }>(
  config: UseLiveSheetStateConfig<T>
): UseLiveSheetStateResult<T> {
  const isResettingRef = useRef(false)
  const [loading, setLoading] = useState(!!config.id)
  const [error, setError] = useState<string | null>(null)
  const [entity, setEntity] = useState<T>(config.initialState)

  // Load from database if id is provided
  useEffect(() => {
    if (!config.id) return

    const loadEntity = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from(config.table)
          .select('*')
          .eq('id', config.id!)
          .single()

        if (fetchError) throw fetchError
        if (!data) throw new Error(`${config.table} not found`)

        setEntity(data as T)
      } catch (err) {
        console.error(`Error loading ${config.table}:`, err)
        setError(err instanceof Error ? err.message : `Failed to load ${config.table}`)
      } finally {
        setLoading(false)
      }
    }

    loadEntity()
  }, [config.id, config.table])

  // Update entity state
  const updateEntity = useCallback((updates: Partial<T>) => {
    setEntity((prev) => ({ ...prev, ...updates }))
  }, [])

  // Save to database
  const save = useCallback(async () => {
    if (!config.id) {
      return Promise.resolve()
    }

    try {
      const { error: updateError } = await supabase
        .from(config.table)
        .update(entity)
        .eq('id', config.id)

      if (updateError) {
        console.error(`Failed to update ${config.table}:`, updateError)
        setError(updateError.message)
        throw updateError
      }

      setError(null)
    } catch (err) {
      console.error(`Error saving ${config.table}:`, err)
      throw err
    }
  }, [config.id, config.table, entity])

  // Reset changes - reload from database
  const resetChanges = useCallback(async () => {
    if (!config.id) {
      return
    }

    try {
      isResettingRef.current = true
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from(config.table)
        .select('*')
        .eq('id', config.id)
        .single()

      if (fetchError) throw fetchError
      if (!data) throw new Error(`${config.table} not found`)

      setEntity(data as T)
    } catch (err) {
      console.error(`Error resetting ${config.table}:`, err)
      setError(err instanceof Error ? err.message : `Failed to reset ${config.table}`)
    } finally {
      setLoading(false)
      isResettingRef.current = false
    }
  }, [config.id, config.table])

  return {
    entity,
    updateEntity,
    save,
    resetChanges,
    loading,
    error,
  }
}
