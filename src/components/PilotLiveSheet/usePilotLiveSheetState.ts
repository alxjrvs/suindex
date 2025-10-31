import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefAbility } from 'salvageunion-reference'
import type { PilotLiveSheetState, AdvancedClassOption } from './types'
import { getAbilityCost } from './utils/getAbilityCost'
import { useLiveSheetState } from '../../hooks/useLiveSheetState'
import { deleteEntity as deleteEntityAPI } from '../../lib/api'
import { useEntities, useCreateEntity, useDeleteEntity } from '../../hooks/useEntities'
import type { HydratedEntity } from '../../types/hydrated'

const INITIAL_PILOT_STATE: Omit<PilotLiveSheetState, 'id'> = {
  user_id: '',
  crawler_id: null,
  class_id: null,
  advanced_class_id: null,
  callsign: '',
  motto: null,
  motto_used: null,
  keepsake: null,
  keepsake_used: null,
  background: null,
  background_used: null,
  appearance: null,
  legendary_ability_id: null,
  abilities: [],
  equipment: [],
  max_hp: 10,
  current_damage: 0,
  max_ap: 5,
  current_ap: 5,
  current_tp: 0,
  notes: null,
  choices: null,
  active: false,
}

export function usePilotLiveSheetState(id?: string) {
  const navigate = useNavigate()
  const allCoreClasses = SalvageUnionReference.findAllIn('classes.core', () => true)
  const allAdvancedClasses = SalvageUnionReference.findAllIn('classes.advanced', () => true)
  const allHybridClasses = SalvageUnionReference.findAllIn('classes.hybrid', () => true)

  // Pilot entity state (name, HP, AP, etc.)
  const {
    entity: pilot,
    updateEntity,
    handleUpdateChoice,
    loading: pilotLoading,
    error: pilotError,
    hasPendingChanges,
  } = useLiveSheetState<PilotLiveSheetState>({
    table: 'pilots',
    initialState: { ...INITIAL_PILOT_STATE, id: id || '' },
    id,
  })

  // Normalized entities (abilities, equipment)
  const {
    data: entities = [],
    isLoading: entitiesLoading,
    error: entitiesError,
  } = useEntities('pilot', id)

  const createEntity = useCreateEntity()
  const deleteEntity = useDeleteEntity()

  // Derive typed lists from hydrated entities
  const abilities: HydratedEntity[] = entities.filter((e) => e.schema_name === 'abilities')
  const equipment: HydratedEntity[] = entities.filter((e) => e.schema_name === 'equipment')

  // Combined loading/error states
  const loading = pilotLoading || entitiesLoading
  const error = pilotError || (entitiesError ? String(entitiesError) : null)

  const selectedClass = allCoreClasses.find((c) => c.id === pilot.class_id)

  // Advanced class can be either an AdvancedClass or a HybridClass
  const selectedAdvancedClass =
    allAdvancedClasses.find((c) => c.id === pilot.advanced_class_id) ||
    allHybridClasses.find((c) => c.id === pilot.advanced_class_id)

  const availableAdvancedClasses = useMemo(() => {
    // Early exit conditions
    if (abilities.length < 6) {
      return []
    }

    if (selectedClass?.advanceable === false) {
      return []
    }

    // Count abilities by tree
    const abilitiesByTree: Record<string, number> = {}
    abilities.forEach((entity) => {
      const ability = entity.ref as SURefAbility
      const tree = ability.tree
      abilitiesByTree[tree] = (abilitiesByTree[tree] || 0) + 1
    })

    // Get all trees with 3+ abilities (completed trees)
    const completeTrees = Object.keys(abilitiesByTree).filter((tree) => abilitiesByTree[tree] >= 3)

    if (completeTrees.length === 0) {
      return []
    }

    // Load all ability tree requirements
    const allTreeRequirements = SalvageUnionReference.findAllIn(
      'ability-tree-requirements',
      () => true
    )

    // Find tree requirements where at least one of the requirement trees is completed
    const unlockedTreeNames = allTreeRequirements
      .filter((treeReq) => {
        // Check if pilot has completed at least one of the required trees
        return treeReq.requirement.some((requiredTree: string) =>
          completeTrees.includes(requiredTree)
        )
      })
      .map((treeReq) => treeReq.name)

    const results: AdvancedClassOption[] = []

    allHybridClasses.forEach((hybridClass) => {
      if (unlockedTreeNames.includes(hybridClass.advancedTree)) {
        results.push({
          id: hybridClass.id,
          name: hybridClass.name,
          isAdvancedVersion: false,
        })
      }
    })

    allAdvancedClasses.forEach((advancedClass) => {
      if (unlockedTreeNames.includes(advancedClass.advancedTree)) {
        results.push({
          id: advancedClass.id,
          name: advancedClass.name,
          isAdvancedVersion: true,
        })
      }
    })

    return results
  }, [allHybridClasses, allAdvancedClasses, abilities, selectedClass])

  const handleClassChange = useCallback(
    async (classId: string | null) => {
      // If null or empty, just update to null
      if (!classId) {
        updateEntity({ class_id: null })
        return
      }

      // If there's already a class selected and user is changing it, reset data
      if (pilot.class_id && pilot.class_id !== classId && id) {
        // Delete all existing abilities and equipment
        await Promise.all([
          ...abilities.map((ability) =>
            deleteEntity.mutateAsync({ id: ability.id, parentType: 'pilot', parentId: id })
          ),
          ...equipment.map((equip) =>
            deleteEntity.mutateAsync({ id: equip.id, parentType: 'pilot', parentId: id })
          ),
        ])

        // Reset to initial state but keep the new class_id
        updateEntity({
          ...pilot,
          id: id || '',
          class_id: classId,
          advanced_class_id: null,
          callsign: '',
          motto: null,
          motto_used: null,
          keepsake: null,
          keepsake_used: null,
          background: null,
          background_used: null,
          appearance: null,
          legendary_ability_id: null,
          max_hp: 10,
          current_damage: 0,
          max_ap: 5,
          current_ap: 5,
          current_tp: 0,
          notes: null,
        })
      } else {
        // First time selection or same selection
        updateEntity({
          class_id: classId,
          max_ap: 5,
          current_ap: 5,
        })
      }
    },
    [id, pilot, updateEntity, abilities, equipment, deleteEntity]
  )

  const handleAddAbility = useCallback(
    async (abilityId: string) => {
      if (!id) return

      const ability = SalvageUnionReference.get('abilities', abilityId)
      if (!ability) return

      const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)

      // Check if user has enough TP
      if ((pilot.current_tp ?? 0) < cost) {
        alert(
          `Not enough TP! This ability costs ${cost} TP, but you only have ${pilot.current_tp ?? 0} TP.`
        )
        return
      }

      // Create entity in database
      await createEntity.mutateAsync({
        pilot_id: id,
        schema_name: 'abilities',
        schema_ref_id: abilityId,
      })

      // Update pilot's TP
      updateEntity({
        current_tp: (pilot.current_tp ?? 0) - cost,
      })
    },
    [id, selectedClass, selectedAdvancedClass, pilot.current_tp, updateEntity, createEntity]
  )

  const handleRemoveAbility = useCallback(
    async (entityId: string) => {
      if (!id) return

      // Delete entity from database
      await deleteEntity.mutateAsync({ id: entityId, parentType: 'pilot', parentId: id })

      // Removing an ability costs 1 TP (confirmation handled in AbilityDisplay)
      updateEntity({
        current_tp: (pilot.current_tp ?? 0) - 1,
      })
    },
    [id, pilot.current_tp, updateEntity, deleteEntity]
  )

  const handleAddLegendaryAbility = useCallback(
    (abilityId: string) => {
      const ability = SalvageUnionReference.get('abilities', abilityId)
      if (!ability) return

      const cost = 3 // Legendary abilities always cost 3 TP

      if ((pilot.current_tp ?? 0) < cost) {
        alert(`Not enough TP! You need ${cost} TP to select this legendary ability.`)
        return
      }

      updateEntity({
        current_tp: (pilot.current_tp ?? 0) - cost,
        legendary_ability_id: abilityId,
      })
    },
    [pilot.current_tp, updateEntity]
  )

  const handleRemoveLegendaryAbility = useCallback(() => {
    // Removing a legendary ability costs 1 TP (confirmation handled in AbilityDisplay)
    updateEntity({
      current_tp: (pilot.current_tp ?? 0) - 1,
      legendary_ability_id: null,
    })
  }, [pilot.current_tp, updateEntity])

  const handleAddEquipment = useCallback(
    async (equipmentId: string) => {
      if (!id) return

      const equipmentRef = SalvageUnionReference.get('equipment', equipmentId)
      if (!equipmentRef) return

      // Check if inventory is full (max 6 slots)
      if (equipment.length >= 6) {
        alert('Inventory is full! You can only carry 6 items.')
        return
      }

      // Create entity in database
      await createEntity.mutateAsync({
        pilot_id: id,
        schema_name: 'equipment',
        schema_ref_id: equipmentId,
      })
    },
    [id, equipment, createEntity]
  )

  const handleRemoveEquipment = useCallback(
    async (entityIdOrIndex: string | number) => {
      if (!id) return

      // Support both old index-based API and new entity ID-based API
      const entity =
        typeof entityIdOrIndex === 'number'
          ? equipment[entityIdOrIndex]
          : equipment.find((e) => e.id === entityIdOrIndex)

      if (!entity) return

      const equipmentName = entity.ref.name || 'this equipment'

      if (window.confirm(`Are you sure you want to remove ${equipmentName}?`)) {
        await deleteEntity.mutateAsync({ id: entity.id, parentType: 'pilot', parentId: id })
      }
    },
    [id, equipment, deleteEntity]
  )

  const handleDeleteEntity = useCallback(async () => {
    if (!id) return

    try {
      await deleteEntityAPI('pilots', id)
      navigate('/dashboard/pilots')
    } catch (error) {
      console.error('Error deleting pilot:', error)
      throw error
    }
  }, [id, navigate])

  return {
    pilot,
    abilities, // HydratedEntity[] with ref and choices
    equipment, // HydratedEntity[] with ref and choices
    selectedClass,
    selectedAdvancedClass,
    availableAdvancedClasses,
    handleUpdateChoice,
    handleClassChange,
    handleAddAbility,
    handleRemoveAbility,
    handleAddLegendaryAbility,
    handleRemoveLegendaryAbility,
    handleAddEquipment,
    handleRemoveEquipment,
    deleteEntity: handleDeleteEntity,
    updateEntity,
    loading,
    error,
    hasPendingChanges,
  }
}
