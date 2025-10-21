import { useState, useCallback, useMemo, useEffect } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { PilotState, AdvancedClassOption } from './types'
import { getAbilityCost } from './utils/getAbilityCost'
import { supabase } from '../../lib/supabase'

export function usePilotState(id?: string) {
  const allClasses = SalvageUnionReference.Classes.all()
  const allAbilities = SalvageUnionReference.Abilities.all()
  const allEquipment = SalvageUnionReference.Equipment.all()
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState<string | null>(null)

  const [pilot, setPilot] = useState<PilotState>({
    id: id || '',
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
  })

  // Load from database if id is provided
  useEffect(() => {
    if (!id) return

    const loadPilot = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('pilots')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError
        if (!data) throw new Error('Pilot not found')
        setPilot(data)
      } catch (err) {
        console.error('Error loading pilot:', err)
        setError(err instanceof Error ? err.message : 'Failed to load pilot')
      } finally {
        setLoading(false)
      }
    }

    loadPilot()
  }, [id])

  // Manual save function
  const save = useCallback(async () => {
    if (!id) {
      // Noop when no ID - return resolved promise
      return Promise.resolve()
    }

    try {
      const { error: updateError } = await supabase.from('pilots').update(pilot).eq('id', id)

      if (updateError) {
        console.error('Failed to update pilot:', updateError)
        setError(updateError.message)
        throw updateError
      }

      setError(null)
    } catch (err) {
      console.error('Error saving pilot:', err)
      throw err
    }
  }, [id, pilot])

  // Reset changes function - reload from database
  const resetChanges = useCallback(async () => {
    if (!id) {
      // Noop when no ID
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('pilots')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      if (!data) throw new Error('Pilot not found')

      setPilot(data)
    } catch (err) {
      console.error('Error resetting pilot:', err)
      setError(err instanceof Error ? err.message : 'Failed to reset pilot')
    } finally {
      setLoading(false)
    }
  }, [id])

  const selectedClass = useMemo(
    () => allClasses.find((c) => c.id === pilot.class_id),
    [pilot.class_id, allClasses]
  )

  const selectedAdvancedClass = useMemo(
    () => allClasses.find((c) => c.id === pilot.advanced_class_id),
    [pilot.advanced_class_id, allClasses]
  )

  // Calculate available advanced classes
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
  }, [allClasses, pilot.abilities, selectedClass])

  const handleClassChange = useCallback((classId: string) => {
    setPilot((prev) => {
      // If there's already a class selected and user is changing it, reset data
      if (prev.class_id && prev.class_id !== classId) {
        // Reset to initial state but keep the new class_id
        return {
          ...prev,
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
        }
      }
      // First time selection or same selection
      return {
        ...prev,
        class_id: classId,
        abilities: [],
      }
    })
  }, [])

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

      setPilot((prev) => ({
        ...prev,
        current_tp: (prev.current_tp ?? 0) - cost,
        abilities: [...(prev.abilities ?? []), abilityId],
      }))
    },
    [allAbilities, selectedClass, selectedAdvancedClass, pilot.current_tp]
  )

  const handleRemoveAbility = useCallback((abilityId: string) => {
    // Removing an ability costs 1 TP (confirmation handled in AbilityDisplay)
    setPilot((prev) => ({
      ...prev,
      current_tp: (prev.current_tp ?? 0) - 1,
      abilities: (prev.abilities ?? []).filter((id) => id !== abilityId),
    }))
  }, [])

  const handleAddLegendaryAbility = useCallback(
    (abilityId: string) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return

      const cost = 3 // Legendary abilities always cost 3 TP

      if ((pilot.current_tp ?? 0) < cost) {
        alert(`Not enough TP! You need ${cost} TP to select this legendary ability.`)
        return
      }

      setPilot((prev) => ({
        ...prev,
        current_tp: (prev.current_tp ?? 0) - cost,
        legendary_ability_id: abilityId,
      }))
    },
    [allAbilities, pilot.current_tp]
  )

  const handleRemoveLegendaryAbility = useCallback(() => {
    // Removing a legendary ability costs 1 TP (confirmation handled in AbilityDisplay)
    setPilot((prev) => ({
      ...prev,
      current_tp: (prev.current_tp ?? 0) - 1,
      legendary_ability_id: null,
    }))
  }, [])

  const handleAddEquipment = useCallback(
    (equipmentId: string) => {
      const equipment = allEquipment.find((e) => e.id === equipmentId)
      if (!equipment) return

      // Check if inventory is full (max 6 slots)
      if ((pilot.equipment ?? []).length >= 6) {
        alert('Inventory is full! You can only carry 6 items.')
        return
      }

      setPilot((prev) => ({
        ...prev,
        equipment: [...(prev.equipment ?? []), equipmentId],
      }))
    },
    [allEquipment, pilot.equipment]
  )

  const handleRemoveEquipment = useCallback(
    (index: number) => {
      const equipmentId = (pilot.equipment ?? [])[index]
      if (!equipmentId) return

      const equipment = allEquipment.find((e) => e.id === equipmentId)
      const equipmentName = equipment?.name || 'this equipment'

      if (window.confirm(`Are you sure you want to remove ${equipmentName}?`)) {
        setPilot((prev) => ({
          ...prev,
          equipment: (prev.equipment ?? []).filter((_, i) => i !== index),
        }))
      }
    },
    [allEquipment, pilot.equipment]
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
    save,
    resetChanges,
    loading,
    error,
  }
}
