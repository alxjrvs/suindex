import { useRealtimeSubscription } from './useRealtimeSubscription'
import { entitiesKeys } from './suentity/useSUEntities'
import { playerChoicesKeys } from './suentity/usePlayerChoices'
import { cargoKeys } from './cargo/useCargo'
import type { QueryKey } from '@tanstack/react-query'

interface UseLiveSheetSubscriptionsOptions {
  /** Entity type (pilot, mech, crawler) */
  entityType: 'pilot' | 'mech' | 'crawler'
  /** Entity ID */
  id: string
  /** Query key for the main entity */
  entityQueryKey: QueryKey
  /** Whether subscriptions are enabled (typically !isLocal && !!id) */
  enabled: boolean
  /** Whether to include cargo subscription (for mech and crawler) */
  includeCargo?: boolean
}

/**
 * Set up common realtime subscriptions for LiveSheet components
 */
export function useLiveSheetSubscriptions({
  entityType,
  id,
  entityQueryKey,
  enabled,
  includeCargo = false,
}: UseLiveSheetSubscriptionsOptions) {
  // Subscribe to main entity table
  useRealtimeSubscription({
    table: `${entityType}s` as 'pilots' | 'mechs' | 'crawlers',
    id,
    queryKey: entityQueryKey,
    enabled,
    toastMessage: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} data updated`,
  })

  // Subscribe to entities (systems, modules, chassis, abilities, etc.)
  useRealtimeSubscription({
    table: 'suentities',
    queryKey: entitiesKeys.forParent(entityType, id),
    enabled,
    showToast: false,
  })

  // Subscribe to player choices
  useRealtimeSubscription({
    table: 'player_choices',
    queryKey: playerChoicesKeys.all,
    enabled,
    showToast: false,
  })

  // Subscribe to cargo (for mech and crawler only)
  const cargoEnabled =
    includeCargo && enabled && (entityType === 'mech' || entityType === 'crawler')
  useRealtimeSubscription({
    table: 'cargo',
    queryKey: cargoEnabled ? cargoKeys.forParent(entityType as 'mech' | 'crawler', id) : [],
    enabled: cargoEnabled,
    showToast: false,
  })
}
