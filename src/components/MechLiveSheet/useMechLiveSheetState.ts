import { useCallback, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { MechLiveSheetState } from './types'
import { useLiveSheetState } from '../../hooks/useLiveSheetState'

const INITIAL_MECH_STATE: MechLiveSheetState = {
  id: '',
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
  choices: null,
}

export function useMechLiveSheetState(id?: string) {
  const allChassis = SalvageUnionReference.Chassis.all()
  const allSystems = SalvageUnionReference.Systems.all()
  const allModules = SalvageUnionReference.Modules.all()

  const {
    entity: mech,
    updateEntity,
    loading,
    error,
    hasPendingChanges,
  } = useLiveSheetState<MechLiveSheetState>({
    table: 'mechs',
    initialState: { ...INITIAL_MECH_STATE, id: id || '' },
    id: id || '',
  })

  const selectedChassis = useMemo(
    () => allChassis.find((c) => c.id === mech.chassis_id),
    [mech.chassis_id, allChassis]
  )

  const usedSystemSlots = (mech.systems ?? []).reduce((sum, systemId) => {
    const system = allSystems.find((s) => s.id === systemId)
    return sum + (system?.slotsRequired ?? 0)
  }, 0)

  const usedModuleSlots = (mech.modules ?? []).reduce((sum, moduleId) => {
    const module = allModules.find((m) => m.id === moduleId)
    return sum + (module?.slotsRequired ?? 0)
  }, 0)

  const totalSalvageValue = useMemo(() => {
    const systemValue = (mech.systems ?? []).reduce((sum, systemId) => {
      const system = allSystems.find((s) => s.id === systemId)
      if (!system) return sum
      return sum + system.salvageValue * system.techLevel
    }, 0)

    const moduleValue = (mech.modules ?? []).reduce((sum, moduleId) => {
      const module = allModules.find((m) => m.id === moduleId)
      if (!module) return sum
      return sum + module.salvageValue * module.techLevel
    }, 0)

    const chassisValue = selectedChassis?.stats?.salvageValue || 0

    return systemValue + moduleValue + chassisValue
  }, [mech.systems, mech.modules, allSystems, allModules, selectedChassis])

  const totalCargo = (mech.cargo ?? []).reduce((sum, item) => sum + item.amount, 0)

  const handleChassisChange = useCallback(
    (chassisId: string | null) => {
      // If null or empty, just update to null
      if (!chassisId) {
        updateEntity({ chassis_id: null })
        return
      }

      // If there's already a chassis selected and user is changing it, reset data
      if (mech.chassis_id && mech.chassis_id !== chassisId) {
        // Find the new chassis to get its stats
        const newChassis = allChassis.find((c) => c.id === chassisId)

        // Reset to initial state but keep the new chassis_id and set initial stats
        updateEntity({
          ...mech,
          chassis_id: chassisId,
          pattern: null,
          quirk: null,
          appearance: null,
          chassis_ability: null,
          systems: [],
          modules: [],
          cargo: [],
          current_damage: 0,
          current_ep: newChassis?.stats.energyPts || 0,
          current_heat: 0,
          notes: null,
        })
      } else {
        // First time selection - set chassis and initialize EP
        const newChassis = SalvageUnionReference.Chassis.find((c) => c.id === chassisId)
        updateEntity({
          chassis_id: chassisId,
          pattern: null,
          systems: [],
          modules: [],
          chassis_ability: null,
          current_ep: newChassis?.stats.energyPts || 0,
        })
      }
    },
    [mech, allChassis, updateEntity]
  )

  const handlePatternChange = (patternName: string) => {
    const matchingPattern = selectedChassis?.patterns?.find(
      (p) => p.name.toLowerCase() === patternName.toLowerCase()
    )

    if (matchingPattern) {
      const hasExistingSystems = (mech.systems ?? []).length > 0 || (mech.modules ?? []).length > 0
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

        updateEntity({
          pattern: patternName,
          systems: patternSystems,
          modules: patternModules,
        })
      } else {
        updateEntity({
          pattern: patternName,
        })
      }
    } else {
      updateEntity({
        pattern: patternName,
      })
    }
  }

  const handleAddSystem = (systemId: string) => {
    const system = allSystems.find((s) => s.id === systemId)
    if (system) {
      updateEntity({
        systems: [...(mech.systems ?? []), systemId],
      })
    }
  }

  const handleRemoveSystem = (systemId: string) => {
    const system = allSystems.find((s) => s.id === systemId)
    const systemName = system?.name || 'this system'

    if (window.confirm(`Are you sure you want to remove ${systemName}?`)) {
      updateEntity({
        systems: (mech.systems ?? []).filter((id) => id !== systemId),
      })
    }
  }

  const handleAddModule = (moduleId: string) => {
    const module = allModules.find((m) => m.id === moduleId)
    if (module) {
      updateEntity({
        modules: [...(mech.modules ?? []), moduleId],
      })
    }
  }

  const handleRemoveModule = (moduleId: string) => {
    const module = allModules.find((m) => m.id === moduleId)
    const moduleName = module?.name || 'this module'

    if (window.confirm(`Are you sure you want to remove ${moduleName}?`)) {
      updateEntity({
        modules: (mech.modules ?? []).filter((id) => id !== moduleId),
      })
    }
  }

  const handleAddCargo = (amount: number, description: string, color: string) => {
    updateEntity({
      cargo: [
        ...(mech.cargo ?? []),
        {
          id: `cargo-${Date.now()}-${Math.random()}`,
          amount,
          description,
          color,
        },
      ],
    })
  }

  const handleRemoveCargo = (cargoId: string) => {
    const cargoToRemove = (mech.cargo ?? []).find((c) => c.id === cargoId)
    const cargoDescription = cargoToRemove?.description || 'this cargo'

    if (window.confirm(`Are you sure you want to remove ${cargoDescription}?`)) {
      updateEntity({
        cargo: (mech.cargo ?? []).filter((c) => c.id !== cargoId),
      })
    }
  }

  return {
    mech,
    totalSalvageValue,
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
    updateEntity,
    loading,
    error,
    hasPendingChanges,
  }
}
