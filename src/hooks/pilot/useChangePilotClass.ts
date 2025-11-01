import { useCallback } from 'react'
import { useDeleteSUEntity } from '../suentity'
import { useUpdatePilot } from './usePilots'
import { useHydratedPilot } from './useHydratedPilot'

export function useChangePilotClass(id: string | undefined) {
  const { pilot, abilities, equipment } = useHydratedPilot(id)
  const updatePilot = useUpdatePilot()
  const deleteEntity = useDeleteSUEntity()

  return useCallback(
    async (classId: string | null) => {
      if (!id || !pilot) return

      // If null or empty, just update to null
      if (!classId) {
        updatePilot.mutate({ id, updates: { class_id: null } })
        return
      }

      const isChangingClassId = pilot.class_id && pilot.class_id !== classId

      if (isChangingClassId) {
        abilities.forEach((ability) => {
          deleteEntity.mutate({ id: ability.id, parentType: 'pilot', parentId: id })
        })

        equipment.forEach((equip) => {
          deleteEntity.mutate({ id: equip.id, parentType: 'pilot', parentId: id })
        })

        updatePilot.mutate({
          id,
          updates: {
            class_id: classId,
            advanced_class_id: null,
          },
        })
      } else {
        updatePilot.mutate({
          id,
          updates: {
            class_id: classId,
          },
        })
      }
    },
    [id, abilities, equipment, deleteEntity, updatePilot, pilot]
  )
}
