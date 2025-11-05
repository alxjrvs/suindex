/**
 * Hook to fetch a pilot with hydrated abilities, equipment, and classes
 *
 * Combines usePilot and useEntitiesFor to provide a single hook that returns:
 * - The pilot data
 * - Hydrated abilities (with reference data and choices)
 * - Hydrated equipment (with reference data and choices)
 * - Selected class (hydrated entity with reference data and choices)
 * - Selected advanced class (hydrated entity with reference data and choices)
 * - Combined loading and error states
 */

import { useMemo } from 'react'
import { usePilot } from './usePilots'
import { useEntitiesFor } from '../suentity/useSUEntities'
import type { HydratedEntity } from '../../types/hydrated'
import type { Tables } from '../../types/database-generated.types'
import { isLocalId } from '../../lib/cacheHelpers'

export interface HydratedPilot {
  pilot: Tables<'pilots'> | undefined
  abilities: HydratedEntity[]
  equipment: HydratedEntity[]
  modules: HydratedEntity[]
  systems: HydratedEntity[]
  selectedClass: HydratedEntity | undefined
  selectedAdvancedClass: HydratedEntity | undefined
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
 *     <p>Class: {selectedClass?.ref.name}</p>
 *     <p>Advanced: {selectedAdvancedClass?.ref.name}</p>
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
  } = useEntitiesFor('pilot', id)

  // Derive typed lists from hydrated entities
  const abilities = useMemo(() => entities.filter((e) => e.schema_name === 'abilities'), [entities])

  const equipment = useMemo(() => entities.filter((e) => e.schema_name === 'equipment'), [entities])

  const modules = useMemo(() => entities.filter((e) => e.schema_name === 'modules'), [entities])

  const systems = useMemo(() => entities.filter((e) => e.schema_name === 'systems'), [entities])

  // Get selected class from entities (schema_name='classes.core')
  const selectedClass = useMemo(
    () => entities.find((e) => e.schema_name === 'classes.core'),
    [entities]
  )

  // Get selected advanced class from entities (schema_name='classes.advanced' or 'classes.hybrid')
  const selectedAdvancedClass = useMemo(
    () =>
      entities.find(
        (e) => e.schema_name === 'classes.advanced' || e.schema_name === 'classes.hybrid'
      ),
    [entities]
  )

  // Combined loading/error states
  const loading = pilotLoading || entitiesLoading
  const error =
    (pilotError ? String(pilotError) : null) || (entitiesError ? String(entitiesError) : null)

  return {
    isLocal,
    pilot,
    abilities,
    equipment,
    modules,
    systems,
    selectedClass,
    selectedAdvancedClass,
    loading,
    error,
  }
}
