import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import type { Drone } from 'salvageunion-reference'
import { formatTraits as formatTraitsArray } from '../../utils/displayUtils'

interface DroneDisplayProps {
  data: Drone
}

function formatTraits(traits?: Drone['traits']): string {
  if (!traits || traits.length === 0) return ''
  return formatTraitsArray(traits).join(', ')
}

export function DroneDisplay({ data }: DroneDisplayProps) {
  return (
    <Frame
      header={data.name}
      techLevel={data.techLevel}
      description={data.description}
      headerContent={
        data.structurePoints !== undefined ? (
          <div className="ml-auto pb-6" style={{ overflow: 'visible' }}>
            <StatList
              stats={[{ label: 'Structure Pts.', value: data.structurePoints }]}
              up={false}
            />
          </div>
        ) : undefined
      }
      showSidebar={true}
      salvageValue={data.salvageValue}
    >
      {/* Drone Traits */}
      {data.traits && data.traits.length > 0 && (
        <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
          <span className="font-bold text-[var(--color-su-brick)]">Traits: </span>
          <span className="text-[var(--color-su-black)]">{formatTraits(data.traits)}</span>
        </div>
      )}

      {/* Systems */}
      {data.systems && data.systems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-su-brick)]">Systems</h3>
          {data.systems.map((system, index) => (
            <div
              key={index}
              className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3 space-y-2"
            >
              <div className="font-bold text-[var(--color-su-black)]">
                {system.name}
                {system.count && system.count > 1 && ` (×${system.count})`}
              </div>
              {system.range && (
                <div className="text-[var(--color-su-black)]">
                  <span className="font-bold text-[var(--color-su-brick)]">Range: </span>
                  {system.range}
                </div>
              )}
              {system.damage && (
                <div className="text-[var(--color-su-black)]">
                  <span className="font-bold text-[var(--color-su-brick)]">Damage: </span>
                  {system.damage.amount}
                  {system.damage.type}
                </div>
              )}
              {system.traits && system.traits.length > 0 && (
                <div className="text-[var(--color-su-black)]">
                  <span className="font-bold text-[var(--color-su-brick)]">Traits: </span>
                  {formatTraits(system.traits)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Frame>
  )
}
