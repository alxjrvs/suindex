import type { Crawler } from 'salvageunion-reference'

interface CrawlerAbilitiesProps {
  crawler: Crawler | undefined
}

export function CrawlerAbilities({ crawler }: CrawlerAbilitiesProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Ability</label>
      <div className="space-y-3">
        {(
          crawler?.abilities || [
            {
              name: '',
              description: 'No crawler type selected.',
            },
          ]
        ).map((ability, idx) => (
          <div key={idx} className="bg-[#e8e5d8] border-2 border-[#2d3e36] rounded-2xl p-4">
            {ability.name && (
              <h3 className="font-bold text-[#2d3e36] text-lg mb-2">{ability.name}</h3>
            )}
            {ability.description && (
              <p className="text-[#2d3e36] leading-relaxed">{ability.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

