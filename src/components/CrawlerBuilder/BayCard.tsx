import type { CrawlerBayState } from './types'

interface BayCardProps {
  bay: CrawlerBayState
  onUpdate: (updates: Partial<CrawlerBayState>) => void
}

export function BayCard({ bay, onUpdate }: BayCardProps) {
  return (
    <div className="bg-[#c97d9e] border-4 border-[#c97d9e] rounded-2xl p-4">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#e8e5d8] uppercase">{bay.name}</h3>

        <div>
          <label className="block text-xs font-bold text-[#e8e5d8] mb-1">
            {bay.operatorPosition}
          </label>
          <input
            type="text"
            value={bay.operator}
            onChange={(e) => onUpdate({ operator: e.target.value })}
            placeholder={`Enter ${bay.operatorPosition} name...`}
            className="w-full p-1.5 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#e8e5d8] mb-1">Description</label>
          <textarea
            value={bay.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Enter bay description..."
            className="w-full p-1.5 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold resize-none h-20 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
