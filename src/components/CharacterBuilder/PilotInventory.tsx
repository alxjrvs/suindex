import type { CharacterEquipment } from './types'
import { EquipmentDisplay } from '../EquipmentDisplay'
import { StatDisplay } from '../StatDisplay'

interface PilotInventoryProps {
  equipment: CharacterEquipment[]
  onAddClick: () => void
  onRemove: (id: string) => void
}

export function PilotInventory({ equipment, onAddClick, onRemove }: PilotInventoryProps) {
  const MAX_SLOTS = 6
  const isFull = equipment.length >= MAX_SLOTS

  return (
    <div className="bg-[var(--color-su-orange)] border-8 border-[var(--color-su-orange)] rounded-3xl p-6 shadow-lg">
      {/* Header with Add Button and Equipment Count */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#e8e5d8] uppercase">Inventory</h2>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <label className="text-xs font-bold text-[#e8e5d8] mb-1 block">Add</label>
            <button
              onClick={onAddClick}
              disabled={isFull}
              className="w-16 h-16 rounded-2xl bg-[var(--color-su-light-orange)] text-[var(--color-su-white)] font-bold hover:bg-[var(--color-su-brick)] transition-colors border-2 border-dashed border-[#e8e5d8] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-su-light-orange)] flex items-center justify-center text-2xl"
            >
              +
            </button>
          </div>
          <StatDisplay label="Equipment" value={`${equipment.length}/${MAX_SLOTS}`} />
        </div>
      </div>

      <div className="columns-2 gap-3 space-y-3">
        {equipment.map((item) => (
          <div key={item.id} className="relative break-inside-avoid mb-3">
            <EquipmentDisplay data={item.equipment} />
            <button
              onClick={() => onRemove(item.id)}
              className="absolute top-2 right-2 bg-[var(--color-su-brick)] text-[var(--color-su-white)] w-6 h-6 rounded font-bold hover:bg-[var(--color-su-black)] transition-colors text-xs flex items-center justify-center z-10"
              aria-label="Remove equipment"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
