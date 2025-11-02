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

      // If null or empty, delete the existing class entity
      if (!classId) {
        if (selectedClass) {
          deleteEntity.mutate({ id: selectedClass.id, parentType: 'pilot', parentId: id })
        }
        return
      }

      const isChangingClass = selectedClass && selectedClass.schema_ref_id !== classId

      if (isChangingClass) {
        // Delete all abilities and equipment when changing class
        abilities.forEach((ability) => {
          deleteEntity.mutate({ id: ability.id, parentType: 'pilot', parentId: id })
        })

        equipment.forEach((equip) => {
          deleteEntity.mutate({ id: equip.id, parentType: 'pilot', parentId: id })
        })

        // Delete advanced class if it exists
        if (selectedAdvancedClass) {
          deleteEntity.mutate({ id: selectedAdvancedClass.id, parentType: 'pilot', parentId: id })
        }

        // Delete old class entity
        deleteEntity.mutate({ id: selectedClass.id, parentType: 'pilot', parentId: id })

        // Create new class entity
        createEntity.mutate({
          pilot_id: id,
          schema_name: 'classes.core',
          schema_ref_id: classId,
        })
      } else if (!selectedClass) {
        // First time selection - create class entity
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
