import { useCallback } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useHydratedMech } from './useHydratedMech'
import { useUpdateMech } from './useMechs'
import { useDeleteEntity } from '../entity/useEntities'
import { useDeleteCargo } from '../cargo/useCargo'

export function useChangeMechChassis(id: string | undefined) {
  const { mech, systems, modules, cargo } = useHydratedMech(id)
  const updateMech = useUpdateMech()
  const deleteEntity = useDeleteEntity()
  const deleteCargo = useDeleteCargo()

  // Handler functions
  return useCallback(
    async (chassisId: string | null) => {
      if (!id || !mech) return

      // If null or empty, just update to null
      if (!chassisId) {
        updateMech.mutate({ id, updates: { chassis_id: null } })
        return
      }

      if (mech.chassis_id && mech.chassis_id !== chassisId) {
        const newChassis = SalvageUnionReference.Chassis.find((c) => c.id === chassisId)

        systems.forEach((system) => {
          deleteEntity.mutate({ id: system.id, parentType: 'mech', parentId: id })
        })

        modules.forEach((module) => {
          deleteEntity.mutate({ id: module.id, parentType: 'mech', parentId: id })
        })

        cargo.forEach((cargo) => {
          deleteCargo.mutate({ id: cargo.id, parentType: 'mech', parentId: id })
        })

        // Reset to initial state but keep the new chassis_id and set initial stats
        updateMech.mutate({
          id,
          updates: {
            chassis_id: chassisId,
            pattern: null,
            quirk: null,
            appearance: null,
            current_damage: 0,
            current_ep: newChassis?.stats.energyPts || 0,
            current_heat: 0,
            notes: null,
          },
        })
      } else {
        // First time selection - set chassis and initialize EP
        const newChassis = SalvageUnionReference.Chassis.find((c) => c.id === chassisId)
        updateMech.mutate({
          id,
          updates: { chassis_id: chassisId, current_ep: newChassis?.stats.energyPts || 0 },
        })
      }
    },
    [id, mech, updateMech, systems, modules, cargo, deleteEntity, deleteCargo]
  )
}
