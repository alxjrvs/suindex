import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import type { ValidTable, TablesInsert } from '../types/database'
import { getUser, createEntity as createEntityAPI } from '../lib/api'

interface UseCreateEntityConfig<T extends ValidTable> {
  table: T
  navigationPath: (id: string) => string
  placeholderData?: Partial<TablesInsert<T>>
}

interface UseCreateEntityResult {
  createEntity: () => Promise<void>
  isLoading: boolean
  error: string | null
}

/**
 * Hook for creating entities directly in Supabase with loading state and navigation
 * Creates a record with placeholder values and navigates to the show page
 *
 * @param config Configuration object with table name, navigation path, and optional placeholder data
 * @returns Object with createEntity function, isLoading state, and error state
 */
export function useCreateEntity<T extends ValidTable>(
  config: UseCreateEntityConfig<T>
): UseCreateEntityResult {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get placeholder data based on table type
  const getPlaceholderData = useCallback((): Record<string, unknown> => {
    const defaults: Record<ValidTable, Record<string, unknown>> = {
      mechs: {
        pattern: 'New Mech',
        current_damage: 0,
        current_heat: 0,
        current_ep: 0,
      },
      pilots: {
        callsign: 'Unknown Name',
        max_hp: 10,
        max_ap: 3,
        current_damage: 0,
        current_ap: 0,
      },
      crawlers: {
        name: 'Unknown Name',
        current_damage: 0,
        current_scrap: 0,
      },
      games: {
        name: 'Unknown Game',
      },
      external_links: {
        name: 'Unknown Link',
        url: 'https://example.com',
      },
      game_invites: {
        code: 'UNKNOWN',
      },
      game_members: {
        role: 'member',
      },
    }

    return {
      ...defaults[config.table],
      ...config.placeholderData,
    }
  }, [config.table, config.placeholderData])

  const createEntity = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get current user
      const user = await getUser()
      if (!user) throw new Error('Not authenticated')

      // Prepare data with placeholder values and user_id
      const data = {
        ...getPlaceholderData(),
        user_id: user.id,
      }

      // Create entity using API
      const createdEntity = await createEntityAPI(config.table, data as never)

      // Navigate to the newly created entity
      const navigationUrl = config.navigationPath((createdEntity as { id: string }).id)
      navigate(navigationUrl)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to create ${config.table}`
      console.error(`Error creating ${config.table}:`, err)
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [config, getPlaceholderData, navigate])

  return {
    createEntity,
    isLoading,
    error,
  }
}
