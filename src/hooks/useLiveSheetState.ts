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
  loading: boolean
  error: string | null
  hasPendingChanges: boolean
}

/**
 * Generic hook for builder state management with live updates
 * Consolidates duplicate logic from useMechLiveSheetState, usePilotLiveSheetState, useCrawlerLiveSheetState
 * Handles loading entity state from Supabase and automatically persisting changes
 *
 * When an ID is provided, changes are automatically saved to Supabase with debouncing.
 * When no ID is provided (draft mode), changes are kept in local state only.
 */
export function useLiveSheetState<T extends { id: string }>(
  config: UseLiveSheetStateConfig<T>
): UseLiveSheetStateResult<T> {
  const [loading, setLoading] = useState(!!config.id)
  const [error, setError] = useState<string | null>(null)
  const [entity, setEntity] = useState<T>(config.initialState)
  const [pendingChanges, setPendingChanges] = useState(true)

  // Track pending updates for debounced saving
  const pendingUpdatesRef = useRef<Partial<T> | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSavingRef = useRef(false)

  // Load from database if id is provided
  useEffect(() => {
    if (!config.id) {
      // No ID means draft mode - no pending changes
      setPendingChanges(false)
      return
    }

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
        setPendingChanges(false)
      }
    }

    loadEntity()
  }, [config.id, config.table])

  // Auto-save pending updates to database
  const saveToDatabase = useCallback(
    async (updates: Partial<T>) => {
      if (!config.id || isSavingRef.current) return

      try {
        isSavingRef.current = true

        const { error: updateError } = await supabase
          .from(config.table)
          .update(updates)
          .eq('id', config.id)

        if (updateError) {
          console.error(`Failed to update ${config.table}:`, updateError)
          setError(updateError.message)
        } else {
          setError(null)
        }
      } catch (err) {
        console.error(`Error saving ${config.table}:`, err)
        setError(err instanceof Error ? err.message : `Failed to save ${config.table}`)
      } finally {
        isSavingRef.current = false
        pendingUpdatesRef.current = null
      }
    },
    [config.id, config.table]
  )

  const updateEntity = useCallback(
    (updates: Partial<T>) => {
      setEntity((prev) => ({ ...prev, ...updates }))

      // If we have an ID, schedule auto-save with debouncing
      if (config.id) {
        // Increment pending changes counter
        setPendingChanges(true)

        // Merge with any pending updates
        pendingUpdatesRef.current = {
          ...pendingUpdatesRef.current,
          ...updates,
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        // Schedule save after 500ms of no changes
        saveTimeoutRef.current = setTimeout(async () => {
          if (pendingUpdatesRef.current) {
            await saveToDatabase(pendingUpdatesRef.current)
            setPendingChanges(false)
          }
        }, 1000)
      }
    },
    [config.id, saveToDatabase]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    entity,
    updateEntity,
    loading,
    error,
    hasPendingChanges: pendingChanges,
  }
}
