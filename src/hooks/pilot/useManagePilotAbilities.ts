import { useCallback } from 'react'
import { SalvageUnionReference, type SURefAbility } from 'salvageunion-reference'
import { getAbilityCost } from '../../components/PilotLiveSheet/utils/getAbilityCost'
import { useHydratedPilot } from './useHydratedPilot'
import { useCreateEntity, useDeleteEntity } from '../entity'
import { useUpdatePilot } from './usePilots'

export function useManagePilotAbilities(id: string | undefined) {
  const { pilot, abilities, selectedClass, selectedAdvancedClass } = useHydratedPilot(id)
  const createEntity = useCreateEntity()
  const updatePilot = useUpdatePilot()
  const deleteEntity = useDeleteEntity()

  const handleAddAbility = useCallback(
    async (abilityId: string) => {
      if (!id) return

      const ability = SalvageUnionReference.get('abilities', abilityId)
      if (!ability) return

      // Calculate cost
      const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)

      // Check if pilot has enough TP
      if ((pilot?.current_tp ?? 0) < cost) {
        alert(`Not enough TP. This ability costs ${cost} TP.`)
        return
      }

      createEntity.mutate({
        pilot_id: id,
        schema_name: 'abilities',
        schema_ref_id: abilityId,
      })

      // Deduct TP
      updatePilot.mutate({
        id,
        updates: {
          current_tp: (pilot?.current_tp ?? 0) - cost,
        },
      })
    },
    [id, pilot, selectedClass, selectedAdvancedClass, createEntity, updatePilot]
  )

  const handleRemoveAbility = useCallback(
    (entityId: string) => {
      if (!id) return

      const entity = abilities.find((e) => e.id === entityId)
      if (!entity) return

      const ability = entity.ref as SURefAbility
      const abilityName = ability.name || 'this ability'

      if (window.confirm(`Are you sure you want to remove "${abilityName}"?`)) {
        // Calculate refund
        const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)

        deleteEntity.mutate({ id: entity.id, parentType: 'pilot', parentId: id })

        // Refund TP
        updatePilot.mutate({
          id,
          updates: {
            current_tp: (pilot?.current_tp ?? 0) + cost,
          },
        })
      }
    },
    [id, pilot, selectedClass, selectedAdvancedClass, abilities, deleteEntity, updatePilot]
  )

  return { handleAddAbility, handleRemoveAbility }
}
