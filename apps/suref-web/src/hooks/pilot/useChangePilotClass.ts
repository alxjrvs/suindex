import { useCallback } from 'react'
import { useDeleteEntity, useCreateEntity } from '../suentity'
import { useHydratedPilot } from './useHydratedPilot'

export function useChangePilotClass(id: string | undefined) {
  const { pilot, abilities, equipment, selectedClass, selectedAdvancedClass } = useHydratedPilot(id)
  const deleteEntity = useDeleteEntity()
  const createEntity = useCreateEntity()

  return useCallback(
    (classId: string | null) => {
      if (!id || !pilot) return

      if (!classId) {
        if (selectedClass) {
          deleteEntity.mutate({ id: selectedClass.id, parentType: 'pilot', parentId: id })
        }
        return
      }

      const isChangingClass = selectedClass && selectedClass.schema_ref_id !== classId

      if (isChangingClass) {
        abilities.forEach((ability) => {
          deleteEntity.mutate({ id: ability.id, parentType: 'pilot', parentId: id })
        })

        equipment.forEach((equip) => {
          deleteEntity.mutate({ id: equip.id, parentType: 'pilot', parentId: id })
        })

        if (selectedAdvancedClass) {
          deleteEntity.mutate({ id: selectedAdvancedClass.id, parentType: 'pilot', parentId: id })
        }

        deleteEntity.mutate({ id: selectedClass.id, parentType: 'pilot', parentId: id })

        createEntity.mutate({
          pilot_id: id,
          schema_name: 'classes.core',
          schema_ref_id: classId,
        })
      } else if (!selectedClass) {
        createEntity.mutate({
          pilot_id: id,
          schema_name: 'classes.core',
          schema_ref_id: classId,
        })
      }
    },
    [
      id,
      abilities,
      equipment,
      selectedClass,
      selectedAdvancedClass,
      deleteEntity,
      createEntity,
      pilot,
    ]
  )
}
