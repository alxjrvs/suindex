import type { CargoItem } from './types'

interface StorageBayProps {
  operator: string
  description: string
  cargo: CargoItem[]
  onOperatorChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onAddCargo: () => void
  onRemoveCargo: (id: string) => void
}

export function StorageBay({
  operator,
  description,
  cargo,
  onOperatorChange,
  onDescriptionChange,
  onAddCargo,
  onRemoveCargo,
}: StorageBayProps) {
  return (
    <div className="bg-[#c97d9e] border-4 border-[#c97d9e] rounded-2xl p-4">
      <h3 className="text-lg font-bold text-[#e8e5d8] uppercase mb-3">Storage Bay</h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-[#e8e5d8] mb-1">Bullwhacker</label>
          <input
            type="text"
            value={operator}
            onChange={(e) => onOperatorChange(e.target.value)}
            placeholder="Enter Bullwhacker name..."
            className="w-full p-1.5 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#e8e5d8] mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter bay description..."
            className="w-full p-1.5 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold resize-none h-20 text-sm"
          />
        </div>
      </div>

      {/* Cargo Grid */}
      <div>
        <h4 className="text-sm font-bold text-[#e8e5d8] uppercase mb-2">Cargo</h4>

        <div className="grid grid-cols-4 gap-2">
          {cargo.map((item) => (
            <div
              key={item.id}
              className="relative bg-[#e8e5d8] border-2 border-[#2d3e36] rounded-lg p-1 aspect-square flex flex-col"
            >
              <button
                onClick={() => onRemoveCargo(item.id)}
                className="absolute top-0.5 right-0.5 bg-[var(--color-su-brick)] text-[var(--color-su-white)] w-4 h-4 rounded font-bold hover:bg-[var(--color-su-black)] text-xs flex items-center justify-center leading-none"
                aria-label="Remove"
              >
                ✕
              </button>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-[#2d3e36]">{item.amount}</div>
                <div className="text-[10px] text-[#2d3e36] text-center line-clamp-1 px-0.5">
                  {item.description}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={onAddCargo}
            className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-1 py-1 rounded-lg font-bold hover:bg-[var(--color-su-light-orange)] transition-colors w-full aspect-square text-xs"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}
