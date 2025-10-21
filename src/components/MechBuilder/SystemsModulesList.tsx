import { useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { System, Module } from 'salvageunion-reference'
import { SystemDisplay } from '../SystemDisplay'
import { ModuleDisplay } from '../ModuleDisplay'
import { StatDisplay } from '../StatDisplay'

interface SystemsModulesListProps {
  systems: string[] // Array of System IDs
  modules: string[] // Array of Module IDs
  usedSystemSlots: number
  usedModuleSlots: number
  totalSystemSlots: number
  totalModuleSlots: number
  canAddMore: boolean
  onRemoveSystem: (id: string) => void
  onRemoveModule: (id: string) => void
  onAddClick: () => void
}

export function SystemsModulesList({
  systems,
  modules,
  usedSystemSlots,
  usedModuleSlots,
  totalSystemSlots,
  totalModuleSlots,
  canAddMore,
  onRemoveSystem,
  onRemoveModule,
  onAddClick,
}: SystemsModulesListProps) {
  const allSystems = useMemo(() => SalvageUnionReference.Systems.all(), [])
  const allModules = useMemo(() => SalvageUnionReference.Modules.all(), [])

  const sortedSystems = useMemo(() => {
    return systems
      .map((id) => allSystems.find((s) => s.id === id))
      .filter((s): s is System => s !== undefined)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [systems, allSystems])

  const sortedModules = useMemo(() => {
    return modules
      .map((id) => allModules.find((m) => m.id === id))
      .filter((m): m is Module => m !== undefined)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [modules, allModules])

  return (
    <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#e8e5d8] uppercase">Systems & Modules</h2>
        <div className="flex gap-3">
          <StatDisplay label="System Slots" value={`${usedSystemSlots}/${totalSystemSlots}`} />
          <StatDisplay label="Module Slots" value={`${usedModuleSlots}/${totalModuleSlots}`} />
        </div>
      </div>

      <div className="space-y-4">
        {sortedSystems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#e8e5d8] uppercase">Systems</h3>
            <div className="columns-1 md:columns-2 gap-4 space-y-4">
              {sortedSystems.map((system) => (
                <div key={system.id} className="relative break-inside-avoid mb-4">
                  <button
                    onClick={() => onRemoveSystem(system.id)}
                    className="absolute top-2 right-2 z-10 bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 rounded font-bold hover:bg-[var(--color-su-black)] text-sm"
                    aria-label="Remove"
                  >
                    ✕ Remove
                  </button>
                  <SystemDisplay data={system} />
                </div>
              ))}
            </div>
          </div>
        )}

        {sortedModules.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#e8e5d8] uppercase">Modules</h3>
            <div className="columns-1 md:columns-2 gap-4 space-y-4">
              {sortedModules.map((module) => (
                <div key={module.id} className="relative break-inside-avoid mb-4">
                  <button
                    onClick={() => onRemoveModule(module.id)}
                    className="absolute top-2 right-2 z-10 bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 rounded font-bold hover:bg-[var(--color-su-black)] text-sm"
                    aria-label="Remove"
                  >
                    ✕ Remove
                  </button>
                  <ModuleDisplay data={module} />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onAddClick}
          disabled={!canAddMore}
          className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-3 rounded-2xl font-bold hover:bg-[var(--color-su-light-orange)] transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          + Add System/Module
        </button>
      </div>
    </div>
  )
}
