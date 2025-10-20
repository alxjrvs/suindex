import { useState, useMemo } from 'react'
import type { System, Module } from 'salvageunion-reference'
import Modal from '../Modal'
import { SystemDisplay } from '../SystemDisplay'
import { ModuleDisplay } from '../ModuleDisplay'

interface SystemModuleSelectorProps {
  isOpen: boolean
  onClose: () => void
  systems: System[]
  modules: Module[]
  onSelectSystem: (systemId: string) => void
  onSelectModule: (moduleId: string) => void
  selectedSystemIds: string[]
  selectedModuleIds: string[]
  availableSystemSlots: number
  availableModuleSlots: number
}

export function SystemModuleSelector({
  isOpen,
  onClose,
  systems,
  modules,
  onSelectSystem,
  onSelectModule,
  selectedSystemIds,
  selectedModuleIds,
  availableSystemSlots,
  availableModuleSlots,
}: SystemModuleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'systems' | 'modules'>('all')
  const [techLevelFilter, setTechLevelFilter] = useState<number | null>(null)

  const availableSystems = useMemo(
    () => systems.filter((s) => !selectedSystemIds.includes(s.id)),
    [systems, selectedSystemIds]
  )

  const availableModules = useMemo(
    () => modules.filter((m) => !selectedModuleIds.includes(m.id)),
    [modules, selectedModuleIds]
  )

  const filteredItems = useMemo(() => {
    const items: Array<{
      type: 'system' | 'module'
      data: System | Module
      canAfford: boolean
    }> = []

    if (typeFilter === 'all' || typeFilter === 'systems') {
      availableSystems.forEach((sys) =>
        items.push({
          type: 'system',
          data: sys,
          canAfford: sys.slotsRequired <= availableSystemSlots,
        })
      )
    }

    if (typeFilter === 'all' || typeFilter === 'modules') {
      availableModules.forEach((mod) =>
        items.push({
          type: 'module',
          data: mod,
          canAfford: mod.slotsRequired <= availableModuleSlots,
        })
      )
    }

    return items
      .filter((item) => {
        const matchesSearch =
          !searchTerm ||
          item.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.data.description?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesTechLevel = techLevelFilter === null || item.data.techLevel === techLevelFilter

        return matchesSearch && matchesTechLevel
      })
      .sort((a, b) => {
        if (a.canAfford !== b.canAfford) {
          return a.canAfford ? -1 : 1
        }
        if (a.data.techLevel !== b.data.techLevel) {
          return a.data.techLevel - b.data.techLevel
        }
        return a.data.name.localeCompare(b.data.name)
      })
  }, [
    availableSystems,
    availableModules,
    typeFilter,
    searchTerm,
    techLevelFilter,
    availableSystemSlots,
    availableModuleSlots,
  ])

  const handleSelect = (item: { type: 'system' | 'module'; data: System | Module }) => {
    if (item.type === 'system') {
      onSelectSystem(item.data.id)
    } else {
      onSelectModule(item.data.id)
    }
    onClose()
  }

  const techLevels = [1, 2, 3, 4, 5, 6]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add System or Module">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
        />

        <div className="flex justify-between gap-4 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded font-bold ${
                typeFilter === 'all'
                  ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                  : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)]'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setTypeFilter('systems')}
              className={`px-4 py-2 rounded font-bold ${
                typeFilter === 'systems'
                  ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                  : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)]'
              }`}
            >
              Systems
            </button>
            <button
              onClick={() => setTypeFilter('modules')}
              className={`px-4 py-2 rounded font-bold ${
                typeFilter === 'modules'
                  ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                  : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)]'
              }`}
            >
              Modules
            </button>
          </div>

          <div className="flex gap-2">
            {techLevels.map((tl) => (
              <button
                key={tl}
                onClick={() => setTechLevelFilter(tl)}
                className={`px-3 py-2 rounded font-bold text-sm ${
                  techLevelFilter === tl
                    ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                    : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)]'
                }`}
              >
                TL{tl}
              </button>
            ))}
            <button
              onClick={() => setTechLevelFilter(null)}
              className={`px-3 py-2 rounded font-bold text-sm ${
                techLevelFilter === null
                  ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                  : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)]'
              }`}
            >
              All
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <p className="text-center text-[var(--color-su-black)] py-8">
              No items found matching your criteria.
            </p>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={`${item.type}-${item.data.id}-${index}`}
                onClick={() => handleSelect(item)}
                disabled={!item.canAfford}
                className={`w-full text-left transition-all ${
                  item.canAfford
                    ? 'hover:shadow-lg hover:scale-[1.01] cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="relative">
                  {!item.canAfford && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="text-xs px-2 py-1 rounded bg-[var(--color-su-brick)] text-[var(--color-su-white)] font-bold">
                        TOO LARGE
                      </span>
                    </div>
                  )}
                  {item.type === 'system' ? (
                    <SystemDisplay data={item.data as System} />
                  ) : (
                    <ModuleDisplay data={item.data as Module} />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
