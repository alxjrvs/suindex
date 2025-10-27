import { Grid, VStack } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { EntityDisplay } from '../../shared/EntityDisplay'
import { ActionCard } from '../../shared/ActionCard'
import type { SURefAbility } from 'salvageunion-reference'
import { extractOptions } from '../../shared/entityDisplayHelpers'
import { SheetDisplay } from '../../shared/SheetDisplay'

interface AbilityDisplayProps {
  data: SURefAbility
  onClick?: () => void
  dimmed?: boolean
  showRemoveButton?: boolean
  disableRemove?: boolean
  onRemove?: () => void
  collapsible?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onToggleExpanded?: () => void
  showSelectButton?: boolean
  selectButtonText?: string
}

export function AbilityDisplay({
  data,
  onClick,
  dimmed = false,
  showRemoveButton = false,
  disableRemove = false,
  onRemove,
  collapsible = false,
  defaultExpanded = false,
  expanded,
  onToggleExpanded,
  showSelectButton = false,
  selectButtonText,
}: AbilityDisplayProps) {
  const isLegendary = String(data.level).toUpperCase() === 'L' || data.tree.includes('Legendary')
  const headerColor = isLegendary ? 'su.pink' : 'su.orange'
  const options = extractOptions(data)

  return (
    <EntityDisplay
      entityName="Ability"
      data={data}
      headerColor={headerColor}
      onClick={onClick}
      dimmed={dimmed}
      showRemoveButton={showRemoveButton}
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
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={1}>
          {options.map((option, optIndex) => {
            const label = typeof option === 'string' ? '' : option.label
            const value = typeof option === 'string' ? option : option.value
            return <SheetDisplay key={optIndex} label={label} value={value} />
          })}
        </Grid>
      )}

      {data.subAbilities && data.subAbilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading level="h4" mb={2}>
            Sub-Abilities:
          </Heading>
          {data.subAbilities.map((subAbility, index) => (
            <ActionCard key={index} action={subAbility} activationCurrency="AP" />
          ))}
        </VStack>
      )}
    </EntityDisplay>
  )
}
