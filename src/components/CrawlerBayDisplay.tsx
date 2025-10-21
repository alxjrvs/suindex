import { Frame } from './shared/Frame'
import type { CrawlerBay } from 'salvageunion-reference'

interface CrawlerBayDisplayProps {
  data: CrawlerBay
}

export function CrawlerBayDisplay({ data }: CrawlerBayDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerColor="var(--color-su-pink)"
      description={data.description}
      showSidebar={false}
    >
      <div className="space-y-4">
        {/* Operator Information */}
        <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-[var(--color-su-black)]">Operator Position: </span>
              <span className="text-[var(--color-su-black)]">{data.operatorPosition}</span>
            </div>
            <div>
              <span className="font-bold text-[var(--color-su-black)]">Operator HP: </span>
              <span className="text-[var(--color-su-black)]">{data.operatorHitPoints}</span>
            </div>
          </div>
        </div>

        {/* Damaged Effect */}
        {data.damagedEffect && (
          <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
            <h3 className="text-lg font-bold text-[var(--color-su-brick)] mb-2">Damaged Effect</h3>
            <p className="text-[var(--color-su-black)]">{data.damagedEffect}</p>
          </div>
        )}

        {/* Abilities */}
        {data.abilities && data.abilities.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[var(--color-su-brick)]">Abilities</h3>
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

        {/* Tech Level Effects */}
        {data.techLevelEffects && data.techLevelEffects.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[var(--color-su-brick)]">Tech Level Effects</h3>
            {data.techLevelEffects.map((effect, index) => (
              <div
                key={index}
                className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3"
              >
                <div className="font-bold text-[var(--color-su-black)]">
                  Tech Level {effect.techLevelMin}
                  {effect.techLevelMax !== effect.techLevelMin && `-${effect.techLevelMax}`}
                </div>
                <div className="text-[var(--color-su-black)] mt-1">{effect.effect}</div>
              </div>
            ))}
          </div>
        )}

        {/* Roll Table */}
        {data.rollTable && (
          <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
            <h3 className="text-lg font-bold text-[var(--color-su-brick)] mb-2">Roll Table</h3>
            <div className="space-y-1">
              {Object.entries(data.rollTable)
                .filter(([key]) => key !== 'type')
                .map(([roll, result]) => (
                  <div key={roll} className="text-[var(--color-su-black)]">
                    <span className="font-bold">{roll}: </span>
                    {result}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
            <h3 className="text-lg font-bold text-[var(--color-su-brick)] mb-2">Notes</h3>
            <p className="text-[var(--color-su-black)]">{data.notes}</p>
          </div>
        )}
      </div>
    </Frame>
  )
}
