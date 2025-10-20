import { Frame } from './shared/Frame'
import { DataList } from './shared/DataList'
import type { Ability } from 'salvageunion-reference'
import type { DataValue } from '../types/common'

interface AbilityDisplayProps {
  data: Ability
  compact?: boolean
  onClick?: () => void
  disabled?: boolean
  dimmed?: boolean
  showRemoveButton?: boolean
  onRemove?: () => void
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

function AbilityContent({ data }: { data: Ability }) {
  return (
    <div className="space-y-4">
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
    </div>
  )
}

export function AbilityDisplay({
  data,
  compact = false,
  onClick,
  disabled = false,
  dimmed = false,
  showRemoveButton = false,
  onRemove,
}: AbilityDisplayProps) {
  const details = generateAbilityDetails(data)
  const isLegendary = String(data.level).toUpperCase() === 'L' || data.tree.includes('Legendary')
  const headerColor = isLegendary ? 'var(--color-su-pink)' : 'var(--color-su-orange)'

  // Full-page mode with Frame
  if (!compact) {
    return (
      <Frame
        header={data.name}
        level={data.level}
        headerColor={headerColor}
        details={details}
        notes={'notes' in data && typeof data.notes === 'string' ? data.notes : undefined}
        showSidebar={false}
      >
        <AbilityContent data={data} />
      </Frame>
    )
  }

  // Compact mode for selector/list
  const WrapperComponent = onClick ? 'button' : 'div'
  const opacityClass = dimmed ? 'opacity-50 hover:opacity-100' : 'opacity-100'
  const wrapperProps = onClick
    ? {
        onClick,
        disabled,
        className: `w-full text-left border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)] transition-opacity disabled:cursor-not-allowed disabled:hover:opacity-50 ${opacityClass} ${showRemoveButton ? 'relative' : ''}`,
      }
    : {
        className: `w-full border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)] ${opacityClass} ${showRemoveButton ? 'relative' : ''}`,
      }

  return (
    <WrapperComponent {...wrapperProps}>
      {/* Header */}
      <div
        className="text-[var(--color-su-white)] px-3 py-2 font-bold uppercase flex items-center gap-2"
        style={{ backgroundColor: headerColor }}
      >
        <span className="bg-[var(--color-su-white)] text-[var(--color-su-black)] font-bold px-2 py-1 rounded min-w-[30px] text-center">
          {data.level}
        </span>
        <span className="flex-1">{data.name}</span>
        {showRemoveButton && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-1 rounded font-bold hover:bg-[var(--color-su-black)] transition-colors text-sm"
            aria-label="Remove ability"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {details.length > 0 && (
          <div>
            <DataList values={details} textColor="var(--color-su-brick)" />
          </div>
        )}

        {data.description && (
          <div>
            <p className="text-[var(--color-su-black)] text-sm">{data.description}</p>
          </div>
        )}

        {data.effect && (
          <div>
            <p className="text-[var(--color-su-black)] text-sm leading-relaxed whitespace-pre-line">
              {data.effect}
            </p>
          </div>
        )}

        {/* Footer - Source, Page */}
        <div className="pt-2 border-t border-[var(--color-su-black)] text-xs text-[var(--color-su-brick)]">
          <div className="flex items-center gap-2">
            <span className="font-bold">Source:</span>
            <span className="capitalize">{data.source}</span>
            <span>•</span>
            <span className="font-bold">Page:</span>
            <span>{data.page}</span>
          </div>
        </div>
      </div>
    </WrapperComponent>
  )
}
