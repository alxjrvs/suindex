import { useState, useMemo } from 'react'
import type { System, Module } from 'salvageunion-reference'
import Modal from './Modal'

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

export default function SystemModuleSelector({
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
  const [showSystems, setShowSystems] = useState(true)
  const [showModules, setShowModules] = useState(true)
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

    if (showSystems) {
      availableSystems.forEach((sys) =>
        items.push({
          type: 'system',
          data: sys,
          canAfford: sys.slotsRequired <= availableSystemSlots,
        })
      )
    }

    if (showModules) {
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
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
  }, [
    availableSystems,
    availableModules,
    showSystems,
    showModules,
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
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
        />

        {/* Filters */}
        <div className="flex justify-between gap-4 flex-wrap">
          {/* Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowSystems(true)
                setShowModules(true)
              }}
              className={`px-4 py-2 rounded font-bold ${
                showSystems && showModules
                  ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                  : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)]'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => {
                setShowSystems(!showSystems)
              }}
              className={`px-4 py-2 rounded font-bold ${
                showSystems && !showModules
                  ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                  : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)]'
              }`}
            >
              Systems
            </button>
            <button
              onClick={() => {
                setShowModules(!showModules)
              }}
              className={`px-4 py-2 rounded font-bold ${
                showModules && !showSystems
                  ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                  : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)]'
              }`}
            >
              Modules
            </button>
          </div>

          {/* Tech Level Filter */}
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

        {/* Results */}
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
                className={`w-full text-left border-2 border-[var(--color-su-black)] rounded p-4 transition-colors ${
                  item.canAfford
                    ? 'bg-[var(--color-su-light-blue)] hover:bg-[var(--color-su-blue)] cursor-pointer'
                    : 'bg-[#d0cdc0] opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[var(--color-su-black)]">
                        {item.data.name}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-[var(--color-su-green)] text-[var(--color-su-white)] font-bold">
                        {item.type === 'system' ? 'SYSTEM' : 'MODULE'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-[var(--color-su-orange)] text-[var(--color-su-white)] font-bold">
                        TL{item.data.techLevel}
                      </span>
                      {!item.canAfford && (
                        <span className="text-xs px-2 py-1 rounded bg-[var(--color-su-brick)] text-[var(--color-su-white)] font-bold">
                          TOO LARGE
                        </span>
                      )}
                    </div>
                    {item.data.description && (
                      <p className="text-sm text-[var(--color-su-black)] opacity-75 line-clamp-2">
                        {item.data.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[var(--color-su-brick)]">
                      {item.data.slotsRequired} slot{item.data.slotsRequired !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
