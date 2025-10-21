import type { Crawler } from 'salvageunion-reference'

interface CrawlerHeaderInputsProps {
  name: string
  crawlerTypeId: string | null
  description: string
  allCrawlers: Crawler[]
  onNameChange: (value: string) => void
  onCrawlerTypeChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}

export function CrawlerHeaderInputs({
  name,
  crawlerTypeId,
  description,
  allCrawlers,
  onNameChange,
  onCrawlerTypeChange,
  onDescriptionChange,
}: CrawlerHeaderInputsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter crawler name..."
            className="w-full p-2 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Type</label>
          <select
            value={crawlerTypeId || ''}
            onChange={(e) => onCrawlerTypeChange(e.target.value)}
            className="w-full p-2 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold"
          >
            <option value="">Select crawler type...</option>
            {allCrawlers.map((crawler) => (
              <option key={crawler.id} value={crawler.id}>
                {crawler.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter crawler description..."
          className="w-full p-2 border-0 rounded-lg bg-[#e8e5d8] text-[#2d3e36] font-semibold resize-none h-24"
        />
      </div>
    </div>
  )
}
