import { useState, useCallback, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Class, Ability, Equipment } from 'salvageunion-reference'
import type { PilotState, AdvancedClassOption } from './types'
import { getAbilityCost } from './utils/getAbilityCost'

export function usePilotState(
  allClasses: Class[],
  allAbilities: Ability[],
  allEquipment: Equipment[]
) {
  const [pilot, setPilot] = useState<PilotState>({
    classId: null,
    advancedClassId: null,
    callsign: '',
    motto: '',
    mottoUsed: false,
    keepsake: '',
    keepsakeUsed: false,
    background: '',
    backgroundUsed: false,
    appearance: '',
    legendaryAbilityId: null,
    abilities: [],
    equipment: [],
    maxHP: 10,
    currentHP: 10,
    maxAP: 5,
    currentAP: 5,
    currentTP: 0,
    notes: '',
  })

  const selectedClass = useMemo(
    () => allClasses.find((c) => c.id === pilot.classId),
    [pilot.classId, allClasses]
  )

  const selectedAdvancedClass = useMemo(
    () => allClasses.find((c) => c.id === pilot.advancedClassId),
    [pilot.advancedClassId, allClasses]
  )

  // Calculate available advanced classes
  const availableAdvancedClasses = useMemo(() => {
    if (pilot.abilities.length < 6) {
      return []
    }

    // Salvager class cannot take advanced classes
    if (selectedClass?.name === 'Salvager') {
      return []
    }

    const abilitiesByTree: Record<string, number> = {}
    pilot.abilities.forEach((charAbility) => {
      const tree = charAbility.ability.tree
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
  }, [allClasses, pilot.abilities, selectedClass])

  const handleClassChange = useCallback((classId: string) => {
    setPilot((prev) => ({
      ...prev,
      classId,
      abilities: [],
    }))
  }, [])

  const handleAddAbility = useCallback(
    (abilityId: string) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return

      const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)

      // Check if user has enough TP
      if (pilot.currentTP < cost) {
        alert(
          `Not enough TP! This ability costs ${cost} TP, but you only have ${pilot.currentTP} TP.`
        )
        return
      }

      setPilot((prev) => ({
        ...prev,
        currentTP: prev.currentTP - cost,
        abilities: [
          ...prev.abilities,
          {
            id: `${ability.id}-${Date.now()}`,
            ability,
          },
        ],
      }))
    },
    [allAbilities, selectedClass, selectedAdvancedClass, pilot.currentTP]
  )

  const handleRemoveAbility = useCallback((id: string) => {
    // Removing an ability costs 1 TP (confirmation handled in AbilityDisplay)
    setPilot((prev) => ({
      ...prev,
      currentTP: prev.currentTP - 1,
      abilities: prev.abilities.filter((a) => a.id !== id),
    }))
  }, [])

  const handleAddLegendaryAbility = useCallback(
    (abilityId: string) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return

      const cost = 3 // Legendary abilities always cost 3 TP

      if (pilot.currentTP < cost) {
        alert(`Not enough TP! You need ${cost} TP to select this legendary ability.`)
        return
      }

      setPilot((prev) => ({
        ...prev,
        currentTP: prev.currentTP - cost,
        legendaryAbilityId: abilityId,
      }))
    },
    [allAbilities, pilot.currentTP]
  )

  const handleRemoveLegendaryAbility = useCallback(() => {
    // Removing a legendary ability costs 1 TP (confirmation handled in AbilityDisplay)
    setPilot((prev) => ({
      ...prev,
      currentTP: prev.currentTP - 1,
      legendaryAbilityId: null,
    }))
  }, [])

  const handleAddEquipment = useCallback(
    (equipmentId: string) => {
      const equipment = allEquipment.find((e) => e.id === equipmentId)
      if (!equipment) return

      // Check if inventory is full (max 6 slots)
      if (pilot.equipment.length >= 6) {
        alert('Inventory is full! You can only carry 6 items.')
        return
      }

      setPilot((prev) => ({
        ...prev,
        equipment: [
          ...prev.equipment,
          {
            id: `${equipment.id}-${Date.now()}`,
            equipment,
          },
        ],
      }))
    },
    [allEquipment, pilot.equipment.length]
  )

  const handleRemoveEquipment = useCallback(
    (id: string) => {
      const equipmentToRemove = pilot.equipment.find((e) => e.id === id)
      if (!equipmentToRemove) return

      const equipmentName = equipmentToRemove.equipment.name

      if (window.confirm(`Are you sure you want to remove ${equipmentName}?`)) {
        setPilot((prev) => ({
          ...prev,
          equipment: prev.equipment.filter((e) => e.id !== id),
        }))
      }
    },
    [pilot.equipment]
  )

  const updatePilot = useCallback((updates: Partial<PilotState>) => {
    setPilot((prev) => ({ ...prev, ...updates }))
  }, [])

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
  }
}
