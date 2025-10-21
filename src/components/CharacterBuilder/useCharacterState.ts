import { useState, useCallback, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Class, Ability, Equipment } from 'salvageunion-reference'
import type { CharacterState, AdvancedClassOption } from './types'
import { getAbilityCost } from './utils/getAbilityCost'

export function useCharacterState(
  allClasses: Class[],
  allAbilities: Ability[],
  allEquipment: Equipment[]
) {
  const [character, setCharacter] = useState<CharacterState>({
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
    () => allClasses.find((c) => c.id === character.classId),
    [character.classId, allClasses]
  )

  const selectedAdvancedClass = useMemo(
    () => allClasses.find((c) => c.id === character.advancedClassId),
    [character.advancedClassId, allClasses]
  )

  // Calculate available advanced classes
  const availableAdvancedClasses = useMemo(() => {
    if (character.abilities.length < 6) {
      return []
    }

    // Salvager class cannot take advanced classes
    if (selectedClass?.name === 'Salvager') {
      return []
    }

    const abilitiesByTree: Record<string, number> = {}
    character.abilities.forEach((charAbility) => {
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
  }, [allClasses, character.abilities, selectedClass])

  const handleClassChange = useCallback((classId: string) => {
    setCharacter((prev) => ({
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
      if (character.currentTP < cost) {
        alert(
          `Not enough TP! This ability costs ${cost} TP, but you only have ${character.currentTP} TP.`
        )
        return
      }

      setCharacter((prev) => ({
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
    [allAbilities, selectedClass, selectedAdvancedClass, character.currentTP]
  )

  const handleRemoveAbility = useCallback((id: string) => {
    // Removing an ability costs 1 TP (confirmation handled in AbilityDisplay)
    setCharacter((prev) => ({
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

      if (character.currentTP < cost) {
        alert(`Not enough TP! You need ${cost} TP to select this legendary ability.`)
        return
      }

      setCharacter((prev) => ({
        ...prev,
        currentTP: prev.currentTP - cost,
        legendaryAbilityId: abilityId,
      }))
    },
    [allAbilities, character.currentTP]
  )

  const handleRemoveLegendaryAbility = useCallback(() => {
    // Removing a legendary ability costs 1 TP (confirmation handled in AbilityDisplay)
    setCharacter((prev) => ({
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
      if (character.equipment.length >= 6) {
        alert('Inventory is full! You can only carry 6 items.')
        return
      }

      setCharacter((prev) => ({
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
    [allEquipment, character.equipment.length]
  )

  const handleRemoveEquipment = useCallback(
    (id: string) => {
      const equipmentToRemove = character.equipment.find((e) => e.id === id)
      if (!equipmentToRemove) return

      const equipmentName = equipmentToRemove.equipment.name

      if (window.confirm(`Are you sure you want to remove ${equipmentName}?`)) {
        setCharacter((prev) => ({
          ...prev,
          equipment: prev.equipment.filter((e) => e.id !== id),
        }))
      }
    },
    [character.equipment]
  )

  const updateCharacter = useCallback((updates: Partial<CharacterState>) => {
    setCharacter((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
    character,
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
    updateCharacter,
  }
}
