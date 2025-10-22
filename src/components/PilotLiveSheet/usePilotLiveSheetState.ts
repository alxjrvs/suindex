import { useCallback, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { PilotLiveSheetState, AdvancedClassOption } from './types'
import { getAbilityCost } from './utils/getAbilityCost'
import { useLiveSheetState } from '../../hooks/useLiveSheetState'

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
}

export function usePilotLiveSheetState(id?: string) {
  const allClasses = SalvageUnionReference.Classes.all()
  const allAbilities = SalvageUnionReference.Abilities.all()
  const allEquipment = SalvageUnionReference.Equipment.all()

  const {
    entity: pilot,
    updateEntity,
    save,
    resetChanges,
    loading,
    error,
  } = useLiveSheetState<PilotLiveSheetState>({
    table: 'pilots',
    initialState: { ...INITIAL_PILOT_STATE, id: id || '' },
    id: id || '',
  })

  // Wrapper for partial updates (used by components)
  const updatePilot = useCallback(
    (updates: Partial<PilotLiveSheetState>) => {
      updateEntity(updates)
    },
    [updateEntity]
  )

  const selectedClass = allClasses.find((c) => c.id === pilot.class_id)

  const selectedAdvancedClass = allClasses.find((c) => c.id === pilot.advanced_class_id)

  const availableAdvancedClasses = useMemo(() => {
    if ((pilot.abilities ?? []).length < 6) {
      return []
    }

    // Salvager class cannot take advanced classes
    if (selectedClass?.name === 'Salvager') {
      return []
    }

    const abilitiesByTree: Record<string, number> = {}
    ;(pilot.abilities ?? []).forEach((abilityId) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return
      const tree = ability.tree
      abilitiesByTree[tree] = (abilitiesByTree[tree] || 0) + 1
    })

    const completeTrees = Object.keys(abilitiesByTree).filter((tree) => abilitiesByTree[tree] >= 3)

    if (completeTrees.length === 0) {
      return []
    }

    const allTreeRequirements = SalvageUnionReference.AbilityTreeRequirements.all()
    const results: AdvancedClassOption[] = []

    // Check hybrid classes
    const hybridClasses = allClasses.filter((cls) => cls.type === 'hybrid')

    hybridClasses.forEach((cls) => {
      const treeRequirement = allTreeRequirements.find((req) => req.tree === cls.advancedAbilities)

      if (!treeRequirement || !treeRequirement.requirement) {
        return
      }

      const hasRequirement = treeRequirement.requirement.some((requiredTree: string) =>
        completeTrees.includes(requiredTree)
      )

      if (hasRequirement) {
        results.push({
          id: cls.id,
          name: cls.name,
          isAdvancedVersion: false,
        })
      }
    })

    // Check if player can take advanced version of their base class
    if (selectedClass && selectedClass.coreAbilities) {
      const hasAllTreesComplete = selectedClass.coreAbilities.some((tree) =>
        completeTrees.includes(tree)
      )

      if (hasAllTreesComplete) {
        results.push({
          id: selectedClass.id,
          name: `Adv. ${selectedClass.name}`,
          isAdvancedVersion: true,
        })
      }
    }

    return results
  }, [allClasses, pilot.abilities, selectedClass, allAbilities])

  const handleClassChange = useCallback(
    (classId: string) => {
      // If there's already a class selected and user is changing it, reset data
      if (pilot.class_id && pilot.class_id !== classId) {
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
          abilities: [],
          equipment: [],
          max_hp: 10,
          current_damage: 0,
          max_ap: 5,
          current_ap: 5,
          current_tp: 0,
          notes: null,
        })
      } else {
        // First time selection or same selection
        updatePilot({
          class_id: classId,
          abilities: [],
        })
      }
    },
    [id, pilot, updateEntity, updatePilot]
  )

  const handleAddAbility = useCallback(
    (abilityId: string) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return

      const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)

      // Check if user has enough TP
      if ((pilot.current_tp ?? 0) < cost) {
        alert(
          `Not enough TP! This ability costs ${cost} TP, but you only have ${pilot.current_tp ?? 0} TP.`
        )
        return
      }

      updatePilot({
        current_tp: (pilot.current_tp ?? 0) - cost,
        abilities: [...(pilot.abilities ?? []), abilityId],
      })
    },
    [
      allAbilities,
      selectedClass,
      selectedAdvancedClass,
      pilot.current_tp,
      pilot.abilities,
      updatePilot,
    ]
  )

  const handleRemoveAbility = useCallback(
    (abilityId: string) => {
      // Removing an ability costs 1 TP (confirmation handled in AbilityDisplay)
      updatePilot({
        current_tp: (pilot.current_tp ?? 0) - 1,
        abilities: (pilot.abilities ?? []).filter((id) => id !== abilityId),
      })
    },
    [pilot.current_tp, pilot.abilities, updatePilot]
  )

  const handleAddLegendaryAbility = useCallback(
    (abilityId: string) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return

      const cost = 3 // Legendary abilities always cost 3 TP

      if ((pilot.current_tp ?? 0) < cost) {
        alert(`Not enough TP! You need ${cost} TP to select this legendary ability.`)
        return
      }

      updatePilot({
        current_tp: (pilot.current_tp ?? 0) - cost,
        legendary_ability_id: abilityId,
      })
    },
    [allAbilities, pilot.current_tp, updatePilot]
  )

  const handleRemoveLegendaryAbility = useCallback(() => {
    // Removing a legendary ability costs 1 TP (confirmation handled in AbilityDisplay)
    updatePilot({
      current_tp: (pilot.current_tp ?? 0) - 1,
      legendary_ability_id: null,
    })
  }, [pilot.current_tp, updatePilot])

  const handleAddEquipment = useCallback(
    (equipmentId: string) => {
      const equipment = allEquipment.find((e) => e.id === equipmentId)
      if (!equipment) return

      // Check if inventory is full (max 6 slots)
      if ((pilot.equipment ?? []).length >= 6) {
        alert('Inventory is full! You can only carry 6 items.')
        return
      }

      updatePilot({
        equipment: [...(pilot.equipment ?? []), equipmentId],
      })
    },
    [allEquipment, pilot.equipment, updatePilot]
  )

  const handleRemoveEquipment = useCallback(
    (index: number) => {
      const equipmentId = (pilot.equipment ?? [])[index]
      if (!equipmentId) return

      const equipment = allEquipment.find((e) => e.id === equipmentId)
      const equipmentName = equipment?.name || 'this equipment'

      if (window.confirm(`Are you sure you want to remove ${equipmentName}?`)) {
        updatePilot({
          equipment: (pilot.equipment ?? []).filter((_, i) => i !== index),
        })
      }
    },
    [allEquipment, pilot.equipment, updatePilot]
  )

  return {
    pilot,
    selectedClass,
    selectedAdvancedClass,
    availableAdvancedClasses,
    handleClassChange,
    handleAddAbility,
    handleRemoveAbility,
    handleAddLegendaryAbility,
    handleRemoveLegendaryAbility,
    handleAddEquipment,
    handleRemoveEquipment,
    updatePilot,
    save,
    resetChanges,
    loading,
    error,
  }
}
