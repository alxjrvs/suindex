import { useCallback } from 'react'
import { useDeleteEntity, useCreateEntity } from '../suentity'
import { useHydratedPilot } from './useHydratedPilot'
import { SalvageUnionReference } from 'salvageunion-reference'

export function useChangePilotAdvancedClass(id: string | undefined) {
  const { pilot, selectedAdvancedClass } = useHydratedPilot(id)
  const deleteEntity = useDeleteEntity()
  const createEntity = useCreateEntity()

  return useCallback(
    async (advancedClassId: string | null) => {
      if (!id || !pilot) return

      if (!advancedClassId) {
        if (selectedAdvancedClass) {
          deleteEntity.mutate({
            id: selectedAdvancedClass.id,
            parentType: 'pilot',
            parentId: id,
          })
        }
        return
      }

      const advancedClass = SalvageUnionReference.get('classes.advanced', advancedClassId)
      const schemaName = 'classes.advanced'

      if (!advancedClass) {
        console.error(`Advanced class not found: ${advancedClassId}`)
        return
      }

      const isChangingAdvancedClass =
        selectedAdvancedClass && selectedAdvancedClass.schema_ref_id !== advancedClassId

      if (isChangingAdvancedClass) {
        deleteEntity.mutate({
          id: selectedAdvancedClass.id,
          parentType: 'pilot',
          parentId: id,
        })

        createEntity.mutate({
          pilot_id: id,
          schema_name: schemaName,
          schema_ref_id: advancedClassId,
        })
      } else if (!selectedAdvancedClass) {
        createEntity.mutate({
          pilot_id: id,
          schema_name: schemaName,
          schema_ref_id: advancedClassId,
        })
      }
    },
    [id, selectedAdvancedClass, deleteEntity, createEntity, pilot]
  )
}
