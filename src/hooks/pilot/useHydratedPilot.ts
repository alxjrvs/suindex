/**
 * Hook to fetch a pilot with hydrated abilities and equipment
 *
 * Combines usePilot and useEntities to provide a single hook that returns:
 * - The pilot data
 * - Hydrated abilities (with reference data and choices)
 * - Hydrated equipment (with reference data and choices)
 * - Selected class (core class reference data)
 * - Selected advanced class (advanced or hybrid class reference data)
 * - Combined loading and error states
 */

import { useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefCoreClass, SURefAdvancedClass, SURefHybridClass } from 'salvageunion-reference'
import { usePilot } from './usePilots'
import { useEntities } from '../suentity/useSUEntities'
import type { HydratedEntity } from '../../types/hydrated'
import type { Tables } from '../../types/database-generated.types'
import { isLocalId } from '../../lib/cacheHelpers'

export interface HydratedPilot {
  pilot: Tables<'pilots'> | undefined
  abilities: HydratedEntity[]
  equipment: HydratedEntity[]
  selectedClass: SURefCoreClass | undefined
  selectedAdvancedClass: SURefAdvancedClass | SURefHybridClass | undefined
  isLocal: boolean
  loading: boolean
  error: string | null
}

/**
 * Fetch a pilot with its hydrated abilities and equipment
 *
 * @param id - Pilot ID
 * @returns Pilot data with hydrated entities, selected classes, and combined states
 *
 * @example
 * ```tsx
 * const { pilot, abilities, equipment, selectedClass, selectedAdvancedClass, loading, error } = useHydratedPilot(pilotId)
 *
 * if (loading) return <Spinner />
 * if (error) return <Error message={error} />
 *
 * return (
 *   <div>
 *     <h1>{pilot?.callsign}</h1>
 *     <p>Class: {selectedClass?.name}</p>
 *     <p>Advanced: {selectedAdvancedClass?.name}</p>
 *     <AbilitiesList abilities={abilities} />
 *     <EquipmentList equipment={equipment} />
 *   </div>
 * )
 * ```
 */
export function useHydratedPilot(id: string | undefined): HydratedPilot {
  // Fetch pilot data
  const { data: pilot, isLoading: pilotLoading, error: pilotError } = usePilot(id)
  const isLocal = isLocalId(id)

  // Fetch normalized entities (abilities, equipment)
  const {
    data: entities = [],
    isLoading: entitiesLoading,
    error: entitiesError,
  } = useEntities('pilot', id)

  // Derive typed lists from hydrated entities
  const abilities = useMemo(() => entities.filter((e) => e.schema_name === 'abilities'), [entities])

  const equipment = useMemo(() => entities.filter((e) => e.schema_name === 'equipment'), [entities])

  // Get selected class using SalvageUnionReference.get()
  const selectedClass = useMemo(() => {
    if (!pilot?.class_id) return undefined
    return SalvageUnionReference.get('classes.core', pilot.class_id) as SURefCoreClass | undefined
  }, [pilot])

  // Get selected advanced class (can be either advanced or hybrid)
  const selectedAdvancedClass = useMemo(() => {
    if (!pilot?.advanced_class_id) return undefined

    // Try advanced classes first
    const advancedClass = SalvageUnionReference.get('classes.advanced', pilot.advanced_class_id)
    if (advancedClass) return advancedClass as SURefAdvancedClass

    // Try hybrid classes
    const hybridClass = SalvageUnionReference.get('classes.hybrid', pilot.advanced_class_id)
    if (hybridClass) return hybridClass as SURefHybridClass

    return undefined
  }, [pilot])

  // Combined loading/error states
  const loading = pilotLoading || entitiesLoading
  const error =
    (pilotError ? String(pilotError) : null) || (entitiesError ? String(entitiesError) : null)

  return {
    isLocal,
    pilot,
    abilities,
    equipment,
    selectedClass,
    selectedAdvancedClass,
    loading,
    error,
  }
}
