import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import { ActionDisplay } from './shared/ActionDisplay'
import type { Squad } from 'salvageunion-reference'

interface SquadDisplayProps {
  data: Squad
}

export function SquadDisplay({ data }: SquadDisplayProps) {
  const stats = []
  if (data.hitPoints !== undefined) {
    stats.push({ label: 'HP', value: data.hitPoints.toString() })
  }
  if (data.structurePoints !== undefined) {
    stats.push({ label: 'SP', value: data.structurePoints.toString() })
  }

  return (
    <Frame
      header={data.name}
      headerContent={
        stats.length > 0 ? (
          <div className="ml-auto pb-6" style={{ overflow: 'visible' }}>
            <StatList stats={stats} up={false} />
          </div>
        ) : undefined
      }
      showSidebar={false}
    >
      {data.description && (
        <div className="mb-4 p-3 border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]">
          <p className="text-[var(--color-su-black)]">{data.description}</p>
        </div>
      )}

      {data.abilities && data.abilities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-su-black)] uppercase">Abilities</h3>
          {data.abilities.map((ability, index) => (
            <div
              key={index}
              className="border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]"
            >
              <div className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 font-bold uppercase">
                {ability.name}
              </div>

              <div className="p-3 space-y-2">
                <ActionDisplay action={ability} />

                {'description' in ability && ability.description ? (
                  <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
                    <p className="text-[var(--color-su-black)]">{ability.description}</p>
                  </div>
                ) : null}

                {'effect' in ability && ability.effect && typeof ability.effect === 'string' ? (
                  <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
                    <p className="text-[var(--color-su-black)] italic">{ability.effect}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t-2 border-[var(--color-su-black)] text-sm text-[var(--color-su-black)]">
        <span className="font-bold uppercase">{data.source}</span> • Page {data.page}
      </div>
    </Frame>
  )
}
