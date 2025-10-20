import { useState, useMemo } from 'react'
import type { Equipment } from 'salvageunion-reference'
import Modal from '../Modal'
import { EquipmentDisplay } from '../EquipmentDisplay'

interface EquipmentSelectorProps {
  isOpen: boolean
  onClose: () => void
  equipment: Equipment[]
  onSelectEquipment: (equipmentId: string) => void
  selectedEquipmentIds: string[]
}

export function EquipmentSelector({
  isOpen,
  onClose,
  equipment,
  onSelectEquipment,
  selectedEquipmentIds,
}: EquipmentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [techLevelFilter, setTechLevelFilter] = useState<number | null>(null)

  const availableEquipment = useMemo(
    () => equipment.filter((e) => !selectedEquipmentIds.includes(e.id)),
    [equipment, selectedEquipmentIds]
  )

  const filteredEquipment = useMemo(() => {
    return availableEquipment
      .filter((item) => {
        const matchesSearch =
          !searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesTechLevel = techLevelFilter === null || item.techLevel === techLevelFilter

        return matchesSearch && matchesTechLevel
      })
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [availableEquipment, searchTerm, techLevelFilter])

  const handleSelect = (equipmentId: string) => {
    onSelectEquipment(equipmentId)
    onClose()
  }

  const techLevels = [1, 2, 3, 4, 5, 6]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Equipment">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
        />

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

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredEquipment.length === 0 ? (
            <p className="text-center text-[var(--color-su-black)] py-8">
              No equipment found matching your criteria.
            </p>
          ) : (
            filteredEquipment.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="w-full text-left transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer"
              >
                <EquipmentDisplay data={item} />
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

