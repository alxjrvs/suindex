import { useState, useCallback, useMemo } from 'react'
import type { Class, Ability, Equipment } from 'salvageunion-reference'
import type { CharacterState } from './types'

// Helper function to calculate ability cost
function getAbilityCost(ability: Ability, selectedClass: Class | undefined): number {
  if (!selectedClass) return 0

  // Check if it's a legendary ability
  const legendaryAbilities = (selectedClass.legendaryAbilities || []) as string[]
  const isLegendary = legendaryAbilities.includes(ability.name)
  if (isLegendary) return 3

  // Check if it's an advanced ability
  const isAdvanced = selectedClass.advancedAbilities === ability.tree
  if (isAdvanced) return 2

  // Check if it's a core ability
  const isCore = selectedClass.coreAbilities.includes(ability.tree)
  if (isCore) return 1

  // Default to 1 for any other ability
  return 1
}

export function useCharacterState(
  allClasses: Class[],
  allAbilities: Ability[],
  allEquipment: Equipment[]
) {
  const [character, setCharacter] = useState<CharacterState>({
    classId: null,
    callsign: '',
    motto: '',
    mottoUsed: false,
    keepsake: '',
    keepsakeUsed: false,
    background: '',
    backgroundUsed: false,
    appearance: '',
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

      const cost = getAbilityCost(ability, selectedClass)

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
    [allAbilities, selectedClass, character.currentTP]
  )

  const handleRemoveAbility = useCallback(
    (id: string) => {
      const abilityToRemove = character.abilities.find((a) => a.id === id)
      if (!abilityToRemove) return

      const abilityName = abilityToRemove.ability.name
      const cost = getAbilityCost(abilityToRemove.ability, selectedClass)

      if (
        window.confirm(
          `Are you sure you want to remove ${abilityName}? You will be refunded ${cost} TP.`
        )
      ) {
        setCharacter((prev) => ({
          ...prev,
          currentTP: prev.currentTP + cost,
          abilities: prev.abilities.filter((a) => a.id !== id),
        }))
      }
    },
    [character.abilities, selectedClass]
  )

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
    handleClassChange,
    handleAddAbility,
    handleRemoveAbility,
    handleAddEquipment,
    handleRemoveEquipment,
    updateCharacter,
  }
}
