import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import type { Creature } from 'salvageunion-reference'
import { formatTraits as formatTraitsArray } from '../../utils/displayUtils'

interface CreatureDisplayProps {
  data: Creature
}

function formatTraits(traits?: Creature['traits']): string {
  if (!traits || traits.length === 0) return ''
  return formatTraitsArray(traits).join(', ')
}

export function CreatureDisplay({ data }: CreatureDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerColor="var(--color-su-orange)"
      description={data.description}
      headerContent={
        <div className="ml-auto pb-6" style={{ overflow: 'visible' }}>
          <StatList stats={[{ label: 'Hit Points', value: data.hitPoints }]} up={false} />
        </div>
      }
      showSidebar={false}
    >
      {/* Creature Traits */}
      {data.traits && data.traits.length > 0 && (
        <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
          <span className="font-bold text-[var(--color-su-brick)]">Traits: </span>
          <span className="text-[var(--color-su-black)]">{formatTraits(data.traits)}</span>
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

              {/* Ability Stats */}
              <div className="space-y-1">
                {ability.range && (
                  <div className="text-[var(--color-su-black)]">
                    <span className="font-bold text-[var(--color-su-brick)]">Range: </span>
                    {ability.range}
                  </div>
                )}
                {ability.damage && (
                  <div className="text-[var(--color-su-black)]">
                    <span className="font-bold text-[var(--color-su-brick)]">Damage: </span>
                    {ability.damage.amount}
                    {ability.damage.type}
                  </div>
                )}
                {ability.traits && ability.traits.length > 0 && (
                  <div className="text-[var(--color-su-black)]">
                    <span className="font-bold text-[var(--color-su-brick)]">Traits: </span>
                    {formatTraits(ability.traits)}
                  </div>
                )}
              </div>

              {/* Ability Description */}
              {ability.description && (
                <div className="text-[var(--color-su-black)] pt-2 border-t border-[var(--color-su-black)]">
                  {ability.description}
                </div>
              )}
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
