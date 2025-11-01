import { useCallback } from 'react'
import { useHydratedMech } from './useHydratedMech'
import { useCreateCargo, useDeleteCargo } from '../cargo'
import { SalvageUnionReference } from 'salvageunion-reference'

export function useManageMechCargo(id: string) {
  const { cargo } = useHydratedMech(id)
  const deleteCargo = useDeleteCargo()

  const createCargo = useCreateCargo()

  const handleRemoveCargo = useCallback(
    async (cargoId: string) => {
      if (!id) return

      const cargoItem = cargo.find((c) => c.id === cargoId)
      if (!cargoItem) return

      const cargoName = cargoItem.name || 'this cargo'

      if (window.confirm(`Are you sure you want to remove ${cargoName}?`)) {
        deleteCargo.mutate({ id: cargoId, parentType: 'mech', parentId: id })
      }
    },
    [id, cargo, deleteCargo]
  )

  const handleAddCargo = useCallback(
    async (
      amount: number,
      name: string,
      _color: string, // Ignored - color is determined by ref data at render time
      ref?: string, // Reference string in format "schema::id"
      position?: { row: number; col: number } // Position in cargo grid
    ) => {
      if (!id) return

      // Parse reference string if provided
      let schemaName: string | null = null
      let schemaRefId: string | null = null
      if (ref) {
        const parsed = SalvageUnionReference.parseRef(ref)
        if (parsed) {
          schemaName = parsed.schemaName
          schemaRefId = parsed.id
        }
      }

      createCargo.mutate({
        mech_id: id,
        name,
        amount,
        schema_name: schemaName,
        schema_ref_id: schemaRefId,
        metadata: position ? { position } : null,
      })
    },
    [id, createCargo]
  )
  return { handleRemoveCargo, handleAddCargo }
}
