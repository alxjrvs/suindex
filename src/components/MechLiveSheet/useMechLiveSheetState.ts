import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSystem, SURefModule } from 'salvageunion-reference'
import type { MechLiveSheetState } from './types'
import { useLiveSheetState } from '../../hooks/useLiveSheetState'
import { deleteEntity as deleteEntityAPI } from '../../lib/api'
import { useEntities, useCreateEntity, useDeleteEntity } from '../../hooks/useEntities'
import { useCargo, useDeleteCargo } from '../../hooks/useCargo'
import type { HydratedEntity } from '../../types/hydrated'

const INITIAL_MECH_STATE: MechLiveSheetState = {
  id: '',
  user_id: '',
  pilot_id: null,
  chassis_id: null,
  pattern: null,
  quirk: null,
  appearance: null,
  chassis_ability: null,
  systems: [],
  modules: [],
  cargo: [],
  current_damage: 0,
  current_ep: 0,
  current_heat: 0,
  notes: null,
  choices: null,
  active: false,
}

export function useMechLiveSheetState(id?: string) {
  const navigate = useNavigate()
  const allChassis = SalvageUnionReference.findAllIn('chassis', () => true)

  // Mech entity state (chassis, HP, EP, etc.)
  const {
    entity: mech,
    updateEntity,
    loading: mechLoading,
    error: mechError,
    hasPendingChanges,
  } = useLiveSheetState<MechLiveSheetState>({
    table: 'mechs',
    initialState: { ...INITIAL_MECH_STATE, id: id || '' },
    id: id || '',
  })

  // Normalized entities (systems, modules)
  const {
    data: entities = [],
    isLoading: entitiesLoading,
    error: entitiesError,
  } = useEntities('mech', id)

  const createEntity = useCreateEntity()
  const deleteEntity = useDeleteEntity()

  // Normalized cargo
  const { data: cargoItems = [], isLoading: cargoLoading, error: cargoError } = useCargo('mech', id)

  const deleteCargo = useDeleteCargo()

  // Derive typed lists from hydrated entities
  const systems: HydratedEntity[] = entities.filter((e) => e.schema_name === 'systems')
  const modules: HydratedEntity[] = entities.filter((e) => e.schema_name === 'modules')

  // Combined loading/error states
  const loading = mechLoading || entitiesLoading || cargoLoading
  const error =
    mechError ||
    (entitiesError ? String(entitiesError) : null) ||
    (cargoError ? String(cargoError) : null)

  const selectedChassis = useMemo(
    () => allChassis.find((c) => c.id === mech.chassis_id),
    [mech.chassis_id, allChassis]
  )

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

    const chassisValue = selectedChassis?.stats?.salvageValue || 0

    return systemValue + moduleValue + chassisValue
  }, [systems, modules, selectedChassis])

  const totalCargo = useMemo(
    () => cargoItems.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [cargoItems]
  )

  const handleChassisChange = useCallback(
    async (chassisId: string | null) => {
      // If null or empty, just update to null
      if (!chassisId) {
        updateEntity({ chassis_id: null })
        return
      }

      // If there's already a chassis selected and user is changing it, reset data
      if (mech.chassis_id && mech.chassis_id !== chassisId && id) {
        // Find the new chassis to get its stats
        const newChassis = allChassis.find((c) => c.id === chassisId)

        // Delete all existing systems, modules, and cargo
        await Promise.all([
          ...systems.map((system) =>
            deleteEntity.mutateAsync({ id: system.id, parentType: 'mech', parentId: id })
          ),
          ...modules.map((module) =>
            deleteEntity.mutateAsync({ id: module.id, parentType: 'mech', parentId: id })
          ),
          ...cargoItems.map((cargo) =>
            deleteCargo.mutateAsync({ id: cargo.id, parentType: 'mech', parentId: id })
          ),
        ])

        // Reset to initial state but keep the new chassis_id and set initial stats
        updateEntity({
          ...mech,
          chassis_id: chassisId,
          pattern: null,
          quirk: null,
          appearance: null,
          chassis_ability: null,
          current_damage: 0,
          current_ep: newChassis?.stats.energyPts || 0,
          current_heat: 0,
          notes: null,
        })
      } else {
        // First time selection - set chassis and initialize EP
        const newChassis = SalvageUnionReference.Chassis.find((c) => c.id === chassisId)
        updateEntity({
          chassis_id: chassisId,
          pattern: null,
          chassis_ability: null,
          current_ep: newChassis?.stats.energyPts || 0,
        })
      }
    },
    [id, mech, allChassis, updateEntity, systems, modules, cargoItems, deleteEntity, deleteCargo]
  )

  const handlePatternChange = useCallback(
    async (patternName: string) => {
      if (!id) return

      const matchingPattern = selectedChassis?.patterns?.find(
        (p) => p.name.toLowerCase() === patternName.toLowerCase()
      )

      if (matchingPattern) {
        const hasExistingSystems = systems.length > 0 || modules.length > 0
        const message = hasExistingSystems
          ? `Do you want to apply the "${matchingPattern.name}" pattern? This will replace your current systems and modules.`
          : `Do you want to apply the "${matchingPattern.name}" pattern? This will add the pattern's systems and modules.`

        const confirmed = window.confirm(message)

        if (confirmed) {
          // Delete existing systems and modules if replacing
          if (hasExistingSystems) {
            await Promise.all([
              ...systems.map((system) =>
                deleteEntity.mutateAsync({ id: system.id, parentType: 'mech', parentId: id })
              ),
              ...modules.map((module) =>
                deleteEntity.mutateAsync({ id: module.id, parentType: 'mech', parentId: id })
              ),
            ])
          }

          // Create new entities from pattern
          const entityCreations: Promise<unknown>[] = []

          matchingPattern.systems?.forEach((systemEntry) => {
            const system = SalvageUnionReference.get('systems', systemEntry.name)
            if (system) {
              const count =
                'count' in systemEntry && typeof systemEntry.count === 'number'
                  ? systemEntry.count
                  : 1
              // Create the system entity multiple times if count > 1
              for (let i = 0; i < count; i++) {
                entityCreations.push(
                  createEntity.mutateAsync({
                    mech_id: id,
                    schema_name: 'systems',
                    schema_ref_id: system.id,
                  })
                )
              }
            }
          })

          matchingPattern.modules?.forEach((moduleEntry) => {
            const module = SalvageUnionReference.get('modules', moduleEntry.name)
            if (module) {
              const count =
                'count' in moduleEntry && typeof moduleEntry.count === 'number'
                  ? moduleEntry.count
                  : 1
              // Create the module entity multiple times if count > 1
              for (let i = 0; i < count; i++) {
                entityCreations.push(
                  createEntity.mutateAsync({
                    mech_id: id,
                    schema_name: 'modules',
                    schema_ref_id: module.id,
                  })
                )
              }
            }
          })

          await Promise.all(entityCreations)

          updateEntity({
            pattern: patternName,
          })
        } else {
          updateEntity({
            pattern: patternName,
          })
        }
      } else {
        updateEntity({
          pattern: patternName,
        })
      }
    },
    [id, selectedChassis, systems, modules, deleteEntity, createEntity, updateEntity]
  )

  const handleAddSystem = useCallback(
    async (systemId: string) => {
      if (!id) return

      const system = SalvageUnionReference.get('systems', systemId)
      if (!system) return

      await createEntity.mutateAsync({
        mech_id: id,
        schema_name: 'systems',
        schema_ref_id: systemId,
      })
    },
    [id, createEntity]
  )

  const handleRemoveSystem = useCallback(
    async (entityIdOrSchemaRefId: string) => {
      if (!id) return

      // Support both entity ID and schema_ref_id for backward compatibility
      const entity =
        systems.find((e) => e.id === entityIdOrSchemaRefId) ||
        systems.find((e) => e.schema_ref_id === entityIdOrSchemaRefId)

      if (!entity) return

      await deleteEntity.mutateAsync({ id: entity.id, parentType: 'mech', parentId: id })
    },
    [id, systems, deleteEntity]
  )

  const handleAddModule = useCallback(
    async (moduleId: string) => {
      if (!id) return

      const module = SalvageUnionReference.get('modules', moduleId)
      if (!module) return

      await createEntity.mutateAsync({
        mech_id: id,
        schema_name: 'modules',
        schema_ref_id: moduleId,
      })
    },
    [id, createEntity]
  )

  const handleRemoveModule = useCallback(
    async (entityIdOrSchemaRefId: string) => {
      if (!id) return

      // Support both entity ID and schema_ref_id for backward compatibility
      const entity =
        modules.find((e) => e.id === entityIdOrSchemaRefId) ||
        modules.find((e) => e.schema_ref_id === entityIdOrSchemaRefId)

      if (!entity) return

      await deleteEntity.mutateAsync({ id: entity.id, parentType: 'mech', parentId: id })
    },
    [id, modules, deleteEntity]
  )

  const handleRemoveCargo = useCallback(
    async (cargoId: string) => {
      if (!id) return

      const cargo = cargoItems.find((c) => c.id === cargoId)
      if (!cargo) return

      const cargoName = cargo.name || 'this cargo'

      if (window.confirm(`Are you sure you want to remove ${cargoName}?`)) {
        await deleteCargo.mutateAsync({ id: cargoId, parentType: 'mech', parentId: id })
      }
    },
    [id, cargoItems, deleteCargo]
  )

  const handleDeleteEntity = useCallback(async () => {
    if (!id) return

    try {
      await deleteEntityAPI('mechs', id)
      navigate('/dashboard/mechs')
    } catch (error) {
      console.error('Error deleting mech:', error)
      throw error
    }
  }, [id, navigate])

  return {
    mech,
    systems, // HydratedEntity[] with ref and choices
    modules, // HydratedEntity[] with ref and choices
    cargo: cargoItems, // HydratedCargo[] with optional ref
    totalSalvageValue,
    selectedChassis,
    usedSystemSlots,
    usedModuleSlots,
    totalCargo,
    handleChassisChange,
    handlePatternChange,
    handleAddSystem,
    handleRemoveSystem,
    handleAddModule,
    handleRemoveModule,
    handleRemoveCargo,
    deleteEntity: handleDeleteEntity,
    updateEntity,
    loading,
    error,
    hasPendingChanges,
  }
}
