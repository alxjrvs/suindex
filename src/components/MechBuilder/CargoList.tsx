import StatDisplay from '../StatDisplay'
import type { CargoItem } from './types'

interface CargoListProps {
  cargo: CargoItem[]
  totalCargo: number
  maxCargo: number
  canAddCargo: boolean
  onRemove: (id: string) => void
  onAddClick: () => void
}

export function CargoList({
  cargo,
  totalCargo,
  maxCargo,
  canAddCargo,
  onRemove,
  onAddClick,
}: CargoListProps) {
  return (
    <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#e8e5d8] uppercase">Cargo</h2>
        <StatDisplay label="Cargo" value={`${totalCargo}/${maxCargo}`} />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cargo.map((item) => (
          <div
            key={item.id}
            className="relative bg-[#e8e5d8] border-2 border-[#2d3e36] rounded-lg p-2 aspect-square flex flex-col"
          >
            <button
              onClick={() => onRemove(item.id)}
              className="absolute top-1 right-1 bg-[var(--color-su-brick)] text-[var(--color-su-white)] w-5 h-5 rounded font-bold hover:bg-[var(--color-su-black)] text-xs flex items-center justify-center leading-none"
              aria-label="Remove"
            >
              ✕
            </button>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-[#2d3e36]">{item.amount}</div>
              <div className="text-xs text-[#2d3e36] text-center line-clamp-2 px-2">
                {item.description}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={onAddClick}
          disabled={!canAddCargo}
          className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-3 py-2 rounded-lg font-bold hover:bg-[var(--color-su-light-orange)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full aspect-square text-base"
        >
          + Add
        </button>
      </div>
    </div>
  )
}
