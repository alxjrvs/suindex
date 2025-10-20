import { useState } from 'react'
import { Frame } from './shared/Frame'
import type { Ability } from 'salvageunion-reference'
import type { DataValue } from '../types/common'

interface AbilityDisplayProps {
  data: Ability
  compact?: boolean
  onClick?: () => void
  disabled?: boolean
  dimmed?: boolean
  showRemoveButton?: boolean
  disableRemove?: boolean
  onRemove?: () => void
  collapsible?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onToggleExpanded?: () => void
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
  dimmed = false,
  showRemoveButton = false,
  disableRemove = false,
  onRemove,
  collapsible = false,
  defaultExpanded = false,
  expanded,
  onToggleExpanded,
}: AbilityDisplayProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  // Use controlled expansion if provided, otherwise use internal state
  const isExpanded = expanded !== undefined ? expanded : internalExpanded
  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

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
  // Only apply hover effect if not dimmed (i.e., selectable)
  const opacityClass = dimmed ? 'opacity-50' : 'opacity-100 hover:opacity-100'

  return (
    <div
      className={`w-full border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)] ${opacityClass} ${showRemoveButton ? 'relative' : ''}`}
    >
      {/* Header */}
      <div
        className="text-[var(--color-su-white)] px-3 py-2 font-bold uppercase flex items-center gap-2 flex-wrap cursor-pointer"
        style={{ backgroundColor: headerColor }}
        onClick={collapsible ? handleToggle : undefined}
      >
        {/* Expand/Collapse Icon */}
        {collapsible && (
          <span className="text-[var(--color-su-white)] text-lg">{isExpanded ? '▼' : '▶'}</span>
        )}

        <span className="bg-[var(--color-su-white)] text-[var(--color-su-black)] font-bold px-2 py-1 rounded min-w-[30px] text-center">
          {data.level}
        </span>
        <span className="flex-1">{data.name}</span>

        {data.activationCost && (
          <div className="flex items-center" style={{ overflow: 'visible' }}>
            <div
              className="bg-[var(--color-su-black)] text-[var(--color-su-white)] font-bold uppercase flex items-center justify-center whitespace-nowrap"
              style={{
                fontSize: '13px',
                paddingLeft: '6px',
                paddingRight: '6px',
                paddingTop: '2px',
                paddingBottom: '2px',
                height: '20px',
                minWidth: '50px',
                zIndex: 2,
              }}
            >
              {data.activationCost === 'Variable' ? 'X AP' : `${data.activationCost} AP`}
            </div>
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '10px solid var(--color-su-black)',
                marginLeft: '0px',
                zIndex: 1,
              }}
            />
          </div>
        )}

        {/* Tags in header */}
        {data.range && (
          <span className="bg-[var(--color-su-white)] text-[var(--color-su-black)] px-2 py-1 rounded text-xs font-bold">
            {data.range}
          </span>
        )}
        {data.actionType && (
          <span className="bg-[var(--color-su-white)] text-[var(--color-su-black)] px-2 py-1 rounded text-xs font-bold">
            {data.actionType}
          </span>
        )}

        {showRemoveButton && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (disableRemove) return

              const confirmed = window.confirm(
                `Are you sure you want to remove "${data.name}"?\n\nThis will cost 1 TP.`
              )

              if (confirmed) {
                onRemove()
              }
            }}
            disabled={disableRemove}
            className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-1 rounded font-bold hover:bg-[var(--color-su-black)] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-su-brick)]"
            aria-label="Remove ability"
          >
            ✕
          </button>
        )}
      </div>

      {(!collapsible || isExpanded) && (
        <div
          className={`p-3 space-y-2 ${onClick && collapsible ? 'cursor-pointer hover:bg-[#f5f5f0] transition-colors' : ''}`}
          onClick={onClick && collapsible ? onClick : undefined}
        >
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
      )}
    </div>
  )
}
