import { Frame } from './shared/Frame'
import type { Ability } from 'salvageunion-reference'
import type { DataValue } from '../types/common'

interface AbilityDisplayProps {
  data: Ability
}

function generateAbilityDetails(ability: Ability): DataValue[] {
  const details: DataValue[] = []

  if (ability.activationCost) {
    const costValue =
      ability.activationCost === 'Variable' ? 'Variable AP' : `${ability.activationCost} AP`
    details.push({ value: costValue, cost: true })
  }

  if (ability.range) {
    details.push({ value: ability.range })
  }

  if (ability.actionType) {
    details.push({ value: ability.actionType })
  }

  return details
}

export function AbilityDisplay({ data }: AbilityDisplayProps) {
  const details = generateAbilityDetails(data)
  const isLegendary = String(data.level).toUpperCase() === 'L' || data.tree.includes('Legendary')

  return (
    <Frame
      header={data.name}
      level={data.level}
      headerColor={isLegendary ? 'var(--color-su-pink)' : 'var(--color-su-orange)'}
      details={details}
      notes={'notes' in data && typeof data.notes === 'string' ? data.notes : undefined}
      showSidebar={false}
    >
      <div className="space-y-4">
        <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-su-brick)]">Tree:</span>
            <span className="text-[var(--color-su-black)]">{data.tree}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-[var(--color-su-brick)]">Source:</span>
            <span className="text-[var(--color-su-black)] capitalize">{data.source}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-[var(--color-su-brick)]">Page:</span>
            <span className="text-[var(--color-su-black)]">{data.page}</span>
          </div>
        </div>

        {data.description && (
          <div>
            <h4 className="font-bold text-[var(--color-su-black)] mb-2">Description:</h4>
            <p className="text-[var(--color-su-black)] leading-relaxed">{data.description}</p>
          </div>
        )}

        {data.effect && (
          <div>
            <h4 className="font-bold text-[var(--color-su-black)] mb-2">Effect:</h4>
            <p className="text-[var(--color-su-black)] leading-relaxed whitespace-pre-line">
              {data.effect}
            </p>
          </div>
        )}
      </div>
    </Frame>
  )
}
