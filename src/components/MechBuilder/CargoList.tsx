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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {cargo.map((item) => (
          <div
            key={item.id}
            className="relative bg-[#e8e5d8] border-2 border-[#2d3e36] rounded-2xl p-3 aspect-square flex flex-col"
          >
            <button
              onClick={() => onRemove(item.id)}
              className="absolute top-1 right-1 bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-2 py-1 rounded font-bold hover:bg-[var(--color-su-black)] text-xs"
              aria-label="Remove"
            >
              ✕
            </button>
            <div className="flex-1 flex flex-col justify-between pr-6">
              <div className="text-sm font-bold text-[#2d3e36] mb-2">{item.description}</div>
              <div className="text-2xl font-bold text-[#2d3e36] text-center">{item.amount}</div>
            </div>
          </div>
        ))}

        <button
          onClick={onAddClick}
          disabled={!canAddCargo}
          className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-4 py-2 rounded-2xl font-bold hover:bg-[var(--color-su-green)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full aspect-square"
        >
          + Add Cargo
        </button>
      </div>
    </div>
  )
}
