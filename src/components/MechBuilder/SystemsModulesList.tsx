import type { System, Module } from 'salvageunion-reference'
import { SystemDisplay } from '../specialized/SystemDisplay'
import { ModuleDisplay } from '../specialized/ModuleDisplay'
import StatDisplay from '../StatDisplay'

interface SelectedItem {
  id: string
  name: string
  slotsRequired: number
  type: 'system' | 'module'
  data: System | Module
}

interface SystemsModulesListProps {
  systems: SelectedItem[]
  modules: SelectedItem[]
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
  // Sort systems by tech level, then by name
  const sortedSystems = [...systems].sort((a, b) => {
    const techLevelA = (a.data as System).techLevel || 0
    const techLevelB = (b.data as System).techLevel || 0
    if (techLevelA !== techLevelB) {
      return techLevelA - techLevelB
    }
    return a.name.localeCompare(b.name)
  })

  // Sort modules by tech level, then by name
  const sortedModules = [...modules].sort((a, b) => {
    const techLevelA = (a.data as Module).techLevel || 0
    const techLevelB = (b.data as Module).techLevel || 0
    if (techLevelA !== techLevelB) {
      return techLevelA - techLevelB
    }
    return a.name.localeCompare(b.name)
  })

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
            {sortedSystems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => onRemoveSystem(item.id)}
                  className="absolute top-2 right-2 z-10 bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 rounded font-bold hover:bg-[var(--color-su-black)] text-sm"
                  aria-label="Remove"
                >
                  ✕ Remove
                </button>
                <SystemDisplay data={item.data as System} />
              </div>
            ))}
          </div>
        )}

        {sortedModules.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#e8e5d8] uppercase">Modules</h3>
            {sortedModules.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => onRemoveModule(item.id)}
                  className="absolute top-2 right-2 z-10 bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 rounded font-bold hover:bg-[var(--color-su-black)] text-sm"
                  aria-label="Remove"
                >
                  ✕ Remove
                </button>
                <ModuleDisplay data={item.data as Module} />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onAddClick}
          disabled={!canAddMore}
          className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-3 rounded-2xl font-bold hover:bg-[var(--color-su-green)] transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          + Add System/Module
        </button>
      </div>
    </div>
  )
}
