import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import { ActionDisplay } from './shared/ActionDisplay'

interface MeldDisplayProps {
  data: {
    name: string
    source: string
    description?: string
    hitPoints?: number
    structurePoints?: number
    salvageValue?: number
    abilities?: Array<{
      name: string
      description?: string
      effect?: string
      range?: string
      damage?: { type: string; amount: number } | string
      actionType?: string
      traits?: Array<{ type: string; amount?: number }>
    }>
    traits?: Array<{ type: string; amount?: number }>
    page: number
  }
}

export function MeldDisplay({ data }: MeldDisplayProps) {
  const stats = []
  if (data.hitPoints !== undefined) {
    stats.push({ label: 'HP', value: data.hitPoints.toString() })
  }
  if (data.structurePoints !== undefined) {
    stats.push({ label: 'SP', value: data.structurePoints.toString() })
  }
  if (data.salvageValue !== undefined) {
    stats.push({ label: 'SV', value: data.salvageValue.toString() })
  }

  const traitsText = data.traits
    ?.map((trait) => {
      if (trait.amount !== undefined) {
        return `${trait.type} (${trait.amount})`
      }
      return trait.type
    })
    .join(', ')

  return (
    <Frame
      header={data.name}
      headerContent={
        stats.length > 0 ? (
          <div className="ml-auto pb-24" style={{ overflow: 'visible' }}>
            <StatList stats={stats} up={false} />
          </div>
        ) : undefined
      }
      showSidebar={false}
    >
      {/* Traits */}
      {traitsText && (
        <div className="mb-4 p-3 border-2 border-[var(--color-su-black)] bg-[var(--color-su-light-orange)]">
          <p className="text-[var(--color-su-black)] font-bold uppercase text-sm">
            Traits: <span className="font-normal capitalize">{traitsText}</span>
          </p>
        </div>
      )}

      {/* Description */}
      {data.description && (
        <div className="mb-4 p-3 border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]">
          <p className="text-[var(--color-su-black)]">{data.description}</p>
        </div>
      )}

      {/* Abilities */}
      {data.abilities && data.abilities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-su-black)] uppercase">Abilities</h3>
          {data.abilities.map((ability, index) => (
            <div
              key={index}
              className="border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]"
            >
              {/* Ability Header */}
              <div className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 font-bold uppercase">
                {ability.name}
              </div>

              {/* Ability Details */}
              <div className="p-3 space-y-2">
                <ActionDisplay action={ability} />

                {/* Description */}
                {ability.description && (
                  <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
                    <p className="text-[var(--color-su-black)]">{ability.description}</p>
                  </div>
                )}

                {/* Effect */}
                {ability.effect && (
                  <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
                    <p className="text-[var(--color-su-black)] italic">{ability.effect}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page Reference */}
      <div className="mt-4 pt-3 border-t-2 border-[var(--color-su-black)] text-sm text-[var(--color-su-black)]">
        <span className="font-bold uppercase">{data.source}</span> • Page {data.page}
      </div>
    </Frame>
  )
}
