import { Frame } from './shared/Frame'

interface CrawlerAbility {
  name: string
  description: string
}

interface CrawlerData {
  name: string
  source: string
  description: string
  abilities: CrawlerAbility[]
  page: number
}

interface CrawlerDisplayProps {
  data: CrawlerData
}

export function CrawlerDisplay({ data }: CrawlerDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerColor="var(--color-su-orange)"
      description={data.description}
      showSidebar={false}
    >
      {/* Crawler Abilities */}
      {data.abilities && data.abilities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-su-brick)]">Crawler Abilities</h3>
          {data.abilities.map((ability, index) => (
            <div
              key={index}
              className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3 space-y-2"
            >
              <div className="font-bold text-[var(--color-su-black)] text-lg">{ability.name}</div>
              <div className="text-[var(--color-su-black)]">{ability.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Page Reference */}
      <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
        <span className="font-bold text-[var(--color-su-brick)]">Page:</span>
        <span className="text-[var(--color-su-black)] ml-2">{data.page}</span>
      </div>
    </Frame>
  )
}
