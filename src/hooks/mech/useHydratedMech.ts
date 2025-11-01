/**
 * Hook to fetch a mech with hydrated systems, modules, and cargo
 *
 * Combines useMech, useEntities, and useCargo to provide a single hook that returns:
 * - The mech data
 * - Hydrated systems (with reference data and choices)
 * - Hydrated modules (with reference data and choices)
 * - Hydrated cargo (with optional reference data)
 * - Combined loading and error states
 */

import { useMemo } from 'react'
import { useMech } from './useMechs'
import { useEntities } from '../entity/useEntities'
import { useCargo } from '../cargo/useCargo'
import type { HydratedEntity, HydratedCargo } from '../../types/hydrated'
import type { Tables } from '../../types/database-generated.types'

export interface HydratedMech {
  mech: Tables<'mechs'> | undefined
  systems: HydratedEntity[]
  modules: HydratedEntity[]
  cargo: HydratedCargo[]
  loading: boolean
  error: string | null
}

/**
 * Fetch a mech with its hydrated systems, modules, and cargo
 *
 * @param id - Mech ID
 * @returns Mech data with hydrated entities and combined states
 *
 * @example
 * ```tsx
 * const { mech, systems, modules, cargo, loading, error } = useHydratedMech(mechId)
 *
 * if (loading) return <Spinner />
 * if (error) return <Error message={error} />
 *
 * return (
 *   <div>
 *     <h1>{mech?.chassis_id}</h1>
 *     <SystemsList systems={systems} />
 *     <ModulesList modules={modules} />
 *     <CargoList cargo={cargo} />
 *   </div>
 * )
 * ```
 */
export function useHydratedMech(id: string | undefined): HydratedMech {
  // Fetch mech data
  const { data: mech, isLoading: mechLoading, error: mechError } = useMech(id)

  // Fetch normalized entities (systems, modules)
  const {
    data: entities = [],
    isLoading: entitiesLoading,
    error: entitiesError,
  } = useEntities('mech', id)

  // Fetch cargo
  const { data: cargo = [], isLoading: cargoLoading, error: cargoError } = useCargo('mech', id)

  // Derive typed lists from hydrated entities
  const systems = useMemo(() => entities.filter((e) => e.schema_name === 'systems'), [entities])

  const modules = useMemo(() => entities.filter((e) => e.schema_name === 'modules'), [entities])

  // Combined loading/error states
  const loading = mechLoading || entitiesLoading || cargoLoading
  const error =
    (mechError ? String(mechError) : null) ||
    (entitiesError ? String(entitiesError) : null) ||
    (cargoError ? String(cargoError) : null)

  return {
    mech,
    systems,
    modules,
    cargo,
    loading,
    error,
  }
}
