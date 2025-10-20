import type { CharacterEquipment } from './types'
import { EquipmentDisplay } from '../EquipmentDisplay'

interface PilotInventoryProps {
  equipment: CharacterEquipment[]
  onAddClick: () => void
  onRemove: (id: string) => void
}

export function PilotInventory({ equipment, onAddClick, onRemove }: PilotInventoryProps) {
  const MAX_SLOTS = 6

  return (
    <div className="bg-[var(--color-su-orange)] border-8 border-[var(--color-su-orange)] rounded-3xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-[#e8e5d8] uppercase mb-4">Inventory</h2>

      <div className="columns-2 gap-3 space-y-3">
        {Array.from({ length: MAX_SLOTS }).map((_, index) => {
          const item = equipment[index]

          if (item) {
            // Filled slot
            return (
              <div key={index} className="relative break-inside-avoid mb-3">
                <EquipmentDisplay data={item.equipment} />
                <button
                  onClick={() => onRemove(item.id)}
                  className="absolute top-2 right-2 bg-[var(--color-su-brick)] text-[var(--color-su-white)] w-6 h-6 rounded font-bold hover:bg-[var(--color-su-black)] transition-colors text-xs flex items-center justify-center z-10"
                  aria-label="Remove equipment"
                >
                  ✕
                </button>
              </div>
            )
          }

          // Empty slot
          return (
            <button
              key={index}
              onClick={onAddClick}
              className="bg-[#e8e5d8] border-2 border-dashed border-[#2d3e36] rounded-lg p-3 flex items-center justify-center min-h-[80px] hover:bg-[#d8d5c8] transition-colors group break-inside-avoid mb-3 w-full"
            >
              <span className="text-4xl text-[#2d3e36] opacity-30 group-hover:opacity-50 transition-opacity">
                +
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
