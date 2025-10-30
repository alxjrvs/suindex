import { EntityDisplay } from '../../entity/EntityDisplay'
import type { SURefAbility } from 'salvageunion-reference'

interface AbilityDisplayProps {
  data: SURefAbility | undefined
  onClick?: () => void
  disabled?: boolean
  dimmed?: boolean
  disableRemove?: boolean
  onRemove?: () => void
  collapsible?: boolean
  defaultExpanded?: boolean
  hideActions?: boolean
  expanded?: boolean
  onToggleExpanded?: () => void
  showSelectButton?: boolean
  selectButtonText?: string
  trained?: boolean
  hideLevel?: boolean
  compact?: boolean
}

export function AbilityDisplay({
  compact = false,
  data,
  onClick,
  hideLevel = false,
  disabled = false,
  dimmed = false,
  disableRemove = false,
  onRemove,
  collapsible = false,
  defaultExpanded = false,
  expanded,
  onToggleExpanded,
  showSelectButton = false,
  hideActions = false,
  selectButtonText,
  trained = true,
}: AbilityDisplayProps) {
  if (!data) return null
  const isLegendary = String(data.level).toUpperCase() === 'L' || data.tree.includes('Legendary')
  const isAdvancedOrHybrid = data.tree.includes('Advanced') || data.tree.includes('Hybrid')

  // Determine header color based on ability type
  let headerColor: string
  if (isLegendary) {
    headerColor = 'su.pink'
  } else if (isAdvancedOrHybrid) {
    headerColor = 'su.darkOrange'
  } else {
    // Core ability
    headerColor = 'su.orange'
  }

  const headerOpacity = trained ? 1 : 0.5

  return (
    <EntityDisplay
      compact={compact}
      schemaName="abilities"
      hideActions={hideActions}
      data={data}
      headerColor={headerColor}
      headerOpacity={headerOpacity}
      onClick={onClick}
      disabled={disabled}
      dimmed={dimmed}
      disableRemove={disableRemove}
      onRemove={onRemove}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      hideLevel={hideLevel}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      showSelectButton={showSelectButton}
      selectButtonText={selectButtonText}
    />
  )
}
