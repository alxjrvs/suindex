import type { Ability } from 'salvageunion-reference'
import { AbilityDisplay } from '../AbilityDisplay'

interface SelectableAbilityItemProps {
  ability: Ability
  cost: number
  canAfford: boolean
  alreadySelected: boolean
  isAvailable: boolean
  isExpanded: boolean
  onSelect: () => void
  onToggleExpanded: () => void
}

/**
 * Renders a single selectable ability with consistent styling and behavior
 */
export function SelectableAbilityItem({
  ability,
  cost,
  canAfford,
  alreadySelected,
  isAvailable,
  isExpanded,
  onSelect,
  onToggleExpanded,
}: SelectableAbilityItemProps) {
  const isSelectable = isAvailable && canAfford && !alreadySelected
  const isDisabled = alreadySelected || !canAfford || !isAvailable

  return (
    <AbilityDisplay
      key={ability.id}
      data={ability}
      compact
      onClick={isSelectable ? onSelect : undefined}
      disabled={isDisabled}
      dimmed={alreadySelected || !canAfford || !isAvailable}
      collapsible={true}
      expanded={isExpanded}
      onToggleExpanded={onToggleExpanded}
      showSelectButton={true}
      selectButtonCost={cost}
    />
  )
}

