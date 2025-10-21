import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { Chassis, System, Module } from 'salvageunion-reference'
import type { MechState, SelectedItem } from './types'

export function useMechState(allSystems: System[], allModules: Module[], allChassis: Chassis[]) {
  const isResettingRef = useRef(false)

  const [mech, setMech] = useState<MechState>({
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

  const selectedChassis = useMemo(
    () => allChassis.find((c) => c.id === mech.chassis_id),
    [mech.chassis_id, allChassis]
  )

  const usedSystemSlots = useMemo(
    () => mech.systems.reduce((sum, sys) => sum + sys.slotsRequired, 0),
    [mech.systems]
  )

  const usedModuleSlots = useMemo(
    () => mech.modules.reduce((sum, mod) => sum + mod.slotsRequired, 0),
    [mech.modules]
  )

  const totalCargo = useMemo(
    () => mech.cargo.reduce((sum, item) => sum + item.amount, 0),
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
        const hasExistingSystems = mech.systems.length > 0 || mech.modules.length > 0
        const message = hasExistingSystems
          ? `Do you want to apply the "${matchingPattern.name}" pattern? This will replace your current systems and modules.`
          : `Do you want to apply the "${matchingPattern.name}" pattern? This will add the pattern's systems and modules.`

        const confirmed = window.confirm(message)

        if (confirmed) {
          const patternSystems: SelectedItem[] = []
          const patternModules: SelectedItem[] = []

          matchingPattern.systems?.forEach((systemName) => {
            const system = allSystems.find((s) => s.name === systemName)
            if (system) {
              patternSystems.push({
                id: `${system.id}-${Date.now()}-${Math.random()}`,
                name: system.name,
                slotsRequired: system.slotsRequired,
                type: 'system',
                data: system,
              })
            }
          })

          matchingPattern.modules?.forEach((moduleName) => {
            const module = allModules.find((m) => m.name === moduleName)
            if (module) {
              patternModules.push({
                id: `${module.id}-${Date.now()}-${Math.random()}`,
                name: module.name,
                slotsRequired: module.slotsRequired,
                type: 'module',
                data: module,
              })
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
    [selectedChassis, allSystems, allModules, mech.systems.length, mech.modules.length]
  )

  const handleAddSystem = useCallback(
    (systemId: string) => {
      const system = allSystems.find((s) => s.id === systemId)
      if (system) {
        setMech((prev) => ({
          ...prev,
          systems: [
            ...prev.systems,
            {
              id: system.id,
              name: system.name,
              slotsRequired: system.slotsRequired,
              type: 'system' as const,
              data: system,
            },
          ],
        }))
      }
    },
    [allSystems]
  )

  const handleRemoveSystem = useCallback(
    (systemId: string) => {
      const systemToRemove = mech.systems.find((s) => s.id === systemId)
      const systemName = systemToRemove?.name || 'this system'

      if (window.confirm(`Are you sure you want to remove ${systemName}?`)) {
        setMech((prev) => ({
          ...prev,
          systems: prev.systems.filter((s) => s.id !== systemId),
        }))
      }
    },
    [mech.systems]
  )

  const handleAddModule = useCallback(
    (moduleId: string) => {
      const module = allModules.find((m) => m.id === moduleId)
      if (module) {
        setMech((prev) => ({
          ...prev,
          modules: [
            ...prev.modules,
            {
              id: module.id,
              name: module.name,
              slotsRequired: module.slotsRequired,
              type: 'module' as const,
              data: module,
            },
          ],
        }))
      }
    },
    [allModules]
  )

  const handleRemoveModule = useCallback(
    (moduleId: string) => {
      const moduleToRemove = mech.modules.find((m) => m.id === moduleId)
      const moduleName = moduleToRemove?.name || 'this module'

      if (window.confirm(`Are you sure you want to remove ${moduleName}?`)) {
        setMech((prev) => ({
          ...prev,
          modules: prev.modules.filter((m) => m.id !== moduleId),
        }))
      }
    },
    [mech.modules]
  )

  const handleAddCargo = useCallback((amount: number, description: string) => {
    setMech((prev) => ({
      ...prev,
      cargo: [
        ...prev.cargo,
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
      const cargoToRemove = mech.cargo.find((c) => c.id === cargoId)
      const cargoDescription = cargoToRemove?.description || 'this cargo'

      if (window.confirm(`Are you sure you want to remove ${cargoDescription}?`)) {
        setMech((prev) => ({
          ...prev,
          cargo: prev.cargo.filter((c) => c.id !== cargoId),
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
  }
}
