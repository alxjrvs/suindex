import { Grid } from '@chakra-ui/react'
import { EntityDisplay } from '../../entity/EntityDisplay'
import type { SURefAbility } from 'salvageunion-reference'
import { extractOptions } from '../../entity/entityDisplayHelpers'
import { SheetDisplay } from '../../shared/SheetDisplay'

interface AbilityDisplayProps {
  data: SURefAbility | undefined
  onClick?: () => void
  disabled?: boolean
  dimmed?: boolean
  disableRemove?: boolean
  onRemove?: () => void
  collapsible?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onToggleExpanded?: () => void
  showSelectButton?: boolean
  selectButtonText?: string
  trained?: boolean
  compact?: boolean
}

export function AbilityDisplay({
  compact = false,
  data,
  onClick,
  disabled = false,
  dimmed = false,
  disableRemove = false,
  onRemove,
  collapsible = false,
  defaultExpanded = false,
  expanded,
  onToggleExpanded,
  showSelectButton = false,
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

  const options = extractOptions(data)

  return (
    <EntityDisplay
      compact={compact}
      schemaName="abilities"
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
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      showSelectButton={showSelectButton}
      selectButtonText={selectButtonText}
    >
      {data.effect && <SheetDisplay label="Effect" value={data.effect} />}
      {options && (
        <Grid gridTemplateColumns="repeat(2, 1fr)" gridAutoFlow="dense" gap={1}>
          {options.map((option, optIndex) => {
            const label = typeof option === 'string' ? '' : option.label
            const value = typeof option === 'string' ? option : option.value
            return <SheetDisplay key={optIndex} label={label} value={value} />
          })}
        </Grid>
      )}
    </EntityDisplay>
  )
}
