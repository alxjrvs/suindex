import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { TablesInsert } from '../types/database-generated.types'
import type { ValidTable, CrawlerNPC } from '../types/common'
import { getUser, createEntity as createEntityAPI } from '../lib/api'
import type { CrawlerBay } from '../components/CrawlerLiveSheet/types'

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
    // Initialize crawler bays and NPC
    const allBays = SalvageUnionReference.CrawlerBays.all()
    const initialBays: CrawlerBay[] = allBays.map((bay) => ({
      id: `${bay.id}-${Date.now()}-${Math.random()}`,
      bayId: bay.id,
      name: bay.name,
      damaged: false,
      npc: {
        name: '',
        notes: '',
        hitPoints: bay.npc.hitPoints,
        damage: 0,
      },
      description: '',
    }))

    const initialNPC: CrawlerNPC = {
      name: '',
      notes: '',
      hitPoints: 0,
      damage: 0,
    }

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
        scrap_tl_one: 0,
        scrap_tl_two: 0,
        scrap_tl_three: 0,
        scrap_tl_four: 0,
        scrap_tl_five: 0,
        scrap_tl_six: 0,
        bays: initialBays,
        npc: initialNPC,
        tech_level: 1,
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

      // Prepare data with placeholder values and appropriate user field
      // Different tables use different column names for the user identifier
      const placeholderData = getPlaceholderData()
      let data: Record<string, unknown>

      if (config.table === 'games' || config.table === 'game_invites') {
        // games and game_invites use 'created_by' instead of 'user_id'
        data = {
          ...placeholderData,
          created_by: user.id,
        }
      } else if (config.table === 'external_links') {
        // external_links doesn't have a user field (associated via game_id)
        data = placeholderData
      } else {
        // mechs, pilots, crawlers, game_members use 'user_id'
        data = {
          ...placeholderData,
          user_id: user.id,
        }
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
