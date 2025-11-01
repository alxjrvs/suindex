/**
 * Hook to fetch a mech with hydrated systems, modules, cargo, and chassis
 *
 * Combines useMech, useEntitiesFor, and useCargo to provide a single hook that returns:
 * - The mech data
 * - Hydrated systems (with reference data and choices)
 * - Hydrated modules (with reference data and choices)
 * - Hydrated cargo (with optional reference data)
 * - Selected chassis (hydrated entity with reference data and choices)
 * - Combined loading and error states
 */

import { useMemo } from 'react'
import { useMech } from './useMechs'
import { useEntitiesFor } from '../suentity/useSUEntities'
import { useCargo } from '../cargo/useCargo'
import type { HydratedEntity, HydratedCargo } from '../../types/hydrated'
import type { Tables } from '../../types/database-generated.types'
import { type SURefSystem, type SURefModule, type SURefChassis } from 'salvageunion-reference'
import { isLocalId } from '../../lib/cacheHelpers'

export interface HydratedMech {
  mech: Tables<'mechs'> | undefined
  selectedChassis: HydratedEntity | undefined
  usedSystemSlots: number
  usedModuleSlots: number
  totalSalvageValue: number
  totalCargo: number
  systems: HydratedEntity[]
  modules: HydratedEntity[]
  cargo: HydratedCargo[]
  loading: boolean
  error: string | null
  isLocal: boolean
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
 *     <h1>{selectedChassis?.ref.name}</h1>
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
  } = useEntitiesFor('mech', id)

  // Fetch cargo
  const { data: cargo = [], isLoading: cargoLoading, error: cargoError } = useCargo('mech', id)

  // Derive typed lists from hydrated entities
  const systems = useMemo(() => entities.filter((e) => e.schema_name === 'systems'), [entities])

  const modules = useMemo(() => entities.filter((e) => e.schema_name === 'modules'), [entities])

  // Get selected chassis from entities (schema_name='chassis')
  const selectedChassis = useMemo(
    () => entities.find((e) => e.schema_name === 'chassis'),
    [entities]
  )

  // Combined loading/error states
  const loading = mechLoading || entitiesLoading || cargoLoading
  const error =
    (mechError ? String(mechError) : null) ||
    (entitiesError ? String(entitiesError) : null) ||
    (cargoError ? String(cargoError) : null)

  const usedSystemSlots = useMemo(
    () =>
      systems.reduce((sum, entity) => {
        const system = entity.ref as SURefSystem
        return sum + (system.slotsRequired ?? 0)
      }, 0),
    [systems]
  )

  const usedModuleSlots = useMemo(
    () =>
      modules.reduce((sum, entity) => {
        const module = entity.ref as SURefModule
        return sum + (module.slotsRequired ?? 0)
      }, 0),
    [modules]
  )

  const totalSalvageValue = useMemo(() => {
    const systemValue = systems.reduce((sum, entity) => {
      const system = entity.ref as SURefSystem
      return sum + system.salvageValue * system.techLevel
    }, 0)

    const moduleValue = modules.reduce((sum, entity) => {
      const module = entity.ref as SURefModule
      return sum + module.salvageValue * module.techLevel
    }, 0)

    const chassisValue = selectedChassis?.ref
      ? (selectedChassis.ref as SURefChassis).stats?.salvageValue || 0
      : 0

    return systemValue + moduleValue + chassisValue
  }, [systems, modules, selectedChassis])

  const totalCargo = useMemo(
    () => cargo.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [cargo]
  )

  return {
    isLocal: isLocalId(id),
    selectedChassis,
    usedSystemSlots,
    usedModuleSlots,
    totalSalvageValue,
    totalCargo,
    mech,
    systems,
    modules,
    cargo,
    loading,
    error,
  }
}
