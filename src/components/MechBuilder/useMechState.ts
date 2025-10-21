import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { MechState } from './types'
import { supabase } from '../../lib/supabase'

export function useMechState(id?: string) {
  const allChassis = SalvageUnionReference.Chassis.all()
  const allSystems = SalvageUnionReference.Systems.all()
  const allModules = SalvageUnionReference.Modules.all()
  const isResettingRef = useRef(false)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState<string | null>(null)

  const [mech, setMech] = useState<MechState>({
    id: id || '',
    user_id: '',
    pilot_id: null,
    chassis_id: null,
    pattern: null,
    quirk: null,
    appearance: null,
    chassis_ability: null,
    systems: [],
    modules: [],
    cargo: [],
    current_damage: 0,
    current_ep: 0,
    current_heat: 0,
    notes: null,
  })

  // Load from database if id is provided
  useEffect(() => {
    if (!id) return

    const loadMech = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('mechs')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError
        if (!data) throw new Error('Mech not found')

        setMech(data)
      } catch (err) {
        console.error('Error loading mech:', err)
        setError(err instanceof Error ? err.message : 'Failed to load mech')
      } finally {
        setLoading(false)
      }
    }

    loadMech()
  }, [id])

  // Manual save function
  const save = useCallback(async () => {
    if (!id) {
      // Noop when no ID - return resolved promise
      return Promise.resolve()
    }

    try {
      const { error: updateError } = await supabase.from('mechs').update(mech).eq('id', id)

      if (updateError) {
        console.error('Failed to update mech:', updateError)
        setError(updateError.message)
        throw updateError
      }

      setError(null)
    } catch (err) {
      console.error('Error saving mech:', err)
      throw err
    }
  }, [id, mech])

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
        .from('mechs')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      if (!data) throw new Error('Mech not found')

      setMech(data)
    } catch (err) {
      console.error('Error resetting mech:', err)
      setError(err instanceof Error ? err.message : 'Failed to reset mech')
    } finally {
      setLoading(false)
    }
  }, [id])

  const selectedChassis = useMemo(
    () => allChassis.find((c) => c.id === mech.chassis_id),
    [mech.chassis_id, allChassis]
  )

  const usedSystemSlots = useMemo(() => {
    return (mech.systems ?? []).reduce((sum, systemId) => {
      const system = allSystems.find((s) => s.id === systemId)
      return sum + (system?.slotsRequired ?? 0)
    }, 0)
  }, [mech.systems, allSystems])

  const usedModuleSlots = useMemo(() => {
    return (mech.modules ?? []).reduce((sum, moduleId) => {
      const module = allModules.find((m) => m.id === moduleId)
      return sum + (module?.slotsRequired ?? 0)
    }, 0)
  }, [mech.modules, allModules])

  const totalCargo = useMemo(
    () => (mech.cargo ?? []).reduce((sum, item) => sum + item.amount, 0),
    [mech.cargo]
  )

  useEffect(() => {
    if (selectedChassis?.stats) {
      setMech((prev) => ({
        ...prev,
        current_damage: 0,
        current_ep: selectedChassis.stats.energy_pts,
      }))
    }
  }, [selectedChassis])

  const handleChassisChange = useCallback(
    (chassisId: string) => {
      setMech((prev) => {
        // If there's already a chassis selected and user is changing it, reset data
        if (prev.chassis_id && prev.chassis_id !== chassisId) {
          // Mark that we're resetting to prevent useEffect from triggering additional updates
          isResettingRef.current = true

          // Find the new chassis to get its stats
          const newChassis = allChassis.find((c) => c.id === chassisId)

          // Reset to initial state but keep the new chassis_id and set initial stats
          return {
            ...prev,
            chassis_id: chassisId,
            pattern: null,
            quirk: null,
            appearance: null,
            chassis_ability: null,
            systems: [],
            modules: [],
            cargo: [],
            current_damage: 0,
            current_ep: newChassis?.stats.energy_pts || 0,
            current_heat: 0,
            notes: null,
          }
        }
        // First time selection or same selection
        return {
          ...prev,
          chassis_id: chassisId,
          pattern: null,
          systems: [],
          modules: [],
          chassis_ability: null,
        }
      })
    },
    [allChassis]
  )

  const handlePatternChange = useCallback(
    (patternName: string) => {
      const matchingPattern = selectedChassis?.patterns?.find(
        (p) => p.name.toLowerCase() === patternName.toLowerCase()
      )

      if (matchingPattern) {
        const hasExistingSystems =
          (mech.systems ?? []).length > 0 || (mech.modules ?? []).length > 0
        const message = hasExistingSystems
          ? `Do you want to apply the "${matchingPattern.name}" pattern? This will replace your current systems and modules.`
          : `Do you want to apply the "${matchingPattern.name}" pattern? This will add the pattern's systems and modules.`

        const confirmed = window.confirm(message)

        if (confirmed) {
          const patternSystems: string[] = []
          const patternModules: string[] = []

          matchingPattern.systems?.forEach((systemName) => {
            const system = allSystems.find((s) => s.name === systemName)
            if (system) {
              patternSystems.push(system.id)
            }
          })

          matchingPattern.modules?.forEach((moduleName) => {
            const module = allModules.find((m) => m.name === moduleName)
            if (module) {
              patternModules.push(module.id)
            }
          })

          setMech((prev) => ({
            ...prev,
            pattern: patternName,
            systems: patternSystems,
            modules: patternModules,
          }))
        } else {
          setMech((prev) => ({
            ...prev,
            pattern: patternName,
          }))
        }
      } else {
        setMech((prev) => ({
          ...prev,
          pattern: patternName,
        }))
      }
    },
    [selectedChassis, allSystems, allModules, mech.systems, mech.modules]
  )

  const handleAddSystem = useCallback(
    (systemId: string) => {
      const system = allSystems.find((s) => s.id === systemId)
      if (system) {
        setMech((prev) => ({
          ...prev,
          systems: [...(prev.systems ?? []), systemId],
        }))
      }
    },
    [allSystems]
  )

  const handleRemoveSystem = useCallback(
    (systemId: string) => {
      const system = allSystems.find((s) => s.id === systemId)
      const systemName = system?.name || 'this system'

      if (window.confirm(`Are you sure you want to remove ${systemName}?`)) {
        setMech((prev) => ({
          ...prev,
          systems: (prev.systems ?? []).filter((id) => id !== systemId),
        }))
      }
    },
    [allSystems]
  )

  const handleAddModule = useCallback(
    (moduleId: string) => {
      const module = allModules.find((m) => m.id === moduleId)
      if (module) {
        setMech((prev) => ({
          ...prev,
          modules: [...(prev.modules ?? []), moduleId],
        }))
      }
    },
    [allModules]
  )

  const handleRemoveModule = useCallback(
    (moduleId: string) => {
      const module = allModules.find((m) => m.id === moduleId)
      const moduleName = module?.name || 'this module'

      if (window.confirm(`Are you sure you want to remove ${moduleName}?`)) {
        setMech((prev) => ({
          ...prev,
          modules: (prev.modules ?? []).filter((id) => id !== moduleId),
        }))
      }
    },
    [allModules]
  )

  const handleAddCargo = useCallback((amount: number, description: string) => {
    setMech((prev) => ({
      ...prev,
      cargo: [
        ...(prev.cargo ?? []),
        {
          id: `cargo-${Date.now()}-${Math.random()}`,
          amount,
          description,
        },
      ],
    }))
  }, [])

  const handleRemoveCargo = useCallback(
    (cargoId: string) => {
      const cargoToRemove = (mech.cargo ?? []).find((c) => c.id === cargoId)
      const cargoDescription = cargoToRemove?.description || 'this cargo'

      if (window.confirm(`Are you sure you want to remove ${cargoDescription}?`)) {
        setMech((prev) => ({
          ...prev,
          cargo: (prev.cargo ?? []).filter((c) => c.id !== cargoId),
        }))
      }
    },
    [mech.cargo]
  )

  const updateMech = useCallback((updates: Partial<MechState>) => {
    setMech((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
    mech,
    selectedChassis,
    usedSystemSlots,
    usedModuleSlots,
    totalCargo,
    handleChassisChange,
    handlePatternChange,
    handleAddSystem,
    handleRemoveSystem,
    handleAddModule,
    handleRemoveModule,
    handleAddCargo,
    handleRemoveCargo,
    updateMech,
    save,
    resetChanges,
    loading,
    error,
  }
}
